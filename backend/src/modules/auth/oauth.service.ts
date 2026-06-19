import { randomBytes, randomInt } from "node:crypto";
import { env } from "../../config/env";
import { prisma } from "../../db/prisma";
import { AppError } from "../../shared/errors/app-error";
import { toAuthUser } from "./auth.mapper";
import { signAccessToken } from "./jwt.service";
import { verifyOAuthState, createOAuthState } from "./oauth.state";
import { getOAuthProviderConfig } from "./oauth.providers";
import { hashPassword } from "./password.service";
import type {
  OAuthCallbackQueryInput,
  OAuthRedirectQueryInput
} from "./oauth.schema";
import type {
  OAuthProfile,
  OAuthTokenResponse,
  SupportedOAuthProvider
} from "./oauth.types";
import type { User } from "../../generated/prisma/client";

type GoogleUserInfo = {
  sub: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
  profile?: string;
};

type GitHubUserInfo = {
  id: number;
  login: string;
  name?: string | null;
  avatar_url?: string | null;
  html_url?: string | null;
  email?: string | null;
};

type GitHubEmail = {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string | null;
};

function createFrontendCallbackUrl(params: {
  accessToken?: string;
  error?: string;
  returnTo?: string;
}) {
  const url = new URL(env.FRONTEND_AUTH_CALLBACK_URL);

  if (params.error) {
    url.searchParams.set("error", params.error);
  }

  if (params.returnTo) {
    url.searchParams.set("returnTo", params.returnTo);
  }

  if (params.accessToken) {
    url.hash = new URLSearchParams({
      accessToken: params.accessToken
    }).toString();
  }

  return url.toString();
}

function createAuthSession(user: User) {
  return {
    accessToken: signAccessToken(user.id),
    user: toAuthUser(user)
  };
}

function normalizeUsernameBase(value: string) {
  const sanitized = value
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);

  return sanitized || "user";
}

async function generateUniqueUsername(source: string) {
  const base = normalizeUsernameBase(source);

  for (let attempt = 0; attempt < 20; attempt++) {
    const username = attempt === 0 ? base : `${base}-${randomInt(1000, 9999)}`;

    const existing = await prisma.user.findUnique({
      where: {
        username
      },
      select: {
        id: true
      }
    });

    if (!existing) {
      return username;
    }
  }

  return `user-${randomInt(100000, 999999)}`;
}

async function createUnusablePasswordHash() {
  const randomPassword = randomBytes(32).toString("hex");
  return hashPassword(randomPassword);
}

async function exchangeCodeForToken(
  provider: SupportedOAuthProvider,
  code: string
): Promise<OAuthTokenResponse> {
  const config = getOAuthProviderConfig(provider);

  const body = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    code,
    redirect_uri: config.callbackUrl,
    grant_type: "authorization_code"
  });

  const response = await fetch(config.tokenUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body
  });

  const data = (await response.json()) as OAuthTokenResponse & {
    error?: string;
    error_description?: string;
  };

  if (!response.ok || data.error || !data.access_token) {
    throw new AppError(
      400,
      "OAUTH_TOKEN_EXCHANGE_FAILED",
      data.error_description ?? data.error ?? "OAuth token exchange failed."
    );
  }

  return data;
}

async function fetchGoogleProfile(accessToken: string): Promise<OAuthProfile> {
  const config = getOAuthProviderConfig("google");

  const response = await fetch(config.userInfoUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json"
    }
  });

  const data = (await response.json()) as GoogleUserInfo;

  if (!response.ok || !data.sub) {
    throw new AppError(400, "OAUTH_PROFILE_FAILED", "Could not fetch Google profile.");
  }

  return {
    provider: "google",
    providerAccountId: data.sub,
    ...(data.email ? { email: data.email.toLowerCase() } : {}),
    ...(typeof data.email_verified === "boolean"
      ? { emailVerified: data.email_verified }
      : {}),
    ...(data.name ? { name: data.name } : {}),
    ...(data.email ? { username: data.email.split("@")[0] } : {}),
    ...(data.picture ? { avatarUrl: data.picture } : {}),
    ...(data.profile ? { profileUrl: data.profile } : {})
  };
}

async function fetchGitHubPrimaryEmail(accessToken: string) {
  const response = await fetch("https://api.github.com/user/emails", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "Codenix"
    }
  });

  if (!response.ok) {
    return undefined;
  }

  const emails = (await response.json()) as GitHubEmail[];

  const primaryVerifiedEmail = emails.find(
    (item) => item.primary && item.verified
  );

  return primaryVerifiedEmail?.email.toLowerCase();
}

async function fetchGitHubProfile(accessToken: string): Promise<OAuthProfile> {
  const config = getOAuthProviderConfig("github");

  const response = await fetch(config.userInfoUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "Codenix"
    }
  });

  const data = (await response.json()) as GitHubUserInfo;

  if (!response.ok || !data.id) {
    throw new AppError(400, "OAUTH_PROFILE_FAILED", "Could not fetch GitHub profile.");
  }

  const primaryEmail = data.email?.toLowerCase() ?? (await fetchGitHubPrimaryEmail(accessToken));

  return {
    provider: "github",
    providerAccountId: String(data.id),
    ...(primaryEmail ? { email: primaryEmail } : {}),
    ...(primaryEmail ? { emailVerified: true } : {}),
    username: data.login,
    name: data.name ?? data.login,
    ...(data.avatar_url ? { avatarUrl: data.avatar_url } : {}),
    ...(data.html_url ? { profileUrl: data.html_url } : {})
  };
}

async function fetchOAuthProfile(
  provider: SupportedOAuthProvider,
  accessToken: string
) {
  if (provider === "google") {
    return fetchGoogleProfile(accessToken);
  }

  return fetchGitHubProfile(accessToken);
}

async function findOrCreateOAuthUser(profile: OAuthProfile) {
  const existingAccount = await prisma.oAuthAccount.findUnique({
    where: {
      provider_providerAccountId: {
        provider: profile.provider,
        providerAccountId: profile.providerAccountId
      }
    },
    include: {
      user: true
    }
  });

  if (existingAccount) {
    const user = await prisma.user.update({
      where: {
        id: existingAccount.userId
      },
      data: {
        ...(profile.avatarUrl ? { avatarUrl: profile.avatarUrl } : {})
      }
    });

    await prisma.oAuthAccount.update({
      where: {
        id: existingAccount.id
      },
      data: {
        lastLoginAt: new Date(),
        ...(profile.email ? { email: profile.email } : {}),
        ...(typeof profile.emailVerified === "boolean"
          ? { emailVerified: profile.emailVerified }
          : {}),
        ...(profile.username ? { username: profile.username } : {}),
        ...(profile.avatarUrl ? { avatarUrl: profile.avatarUrl } : {}),
        ...(profile.profileUrl ? { profileUrl: profile.profileUrl } : {})
      }
    });

    return user;
  }

  const userByEmail = profile.email
    ? await prisma.user.findUnique({
        where: {
          email: profile.email
        }
      })
    : null;

  if (userByEmail) {
    await prisma.oAuthAccount.create({
      data: {
        userId: userByEmail.id,
        provider: profile.provider,
        providerAccountId: profile.providerAccountId,
        ...(profile.email ? { email: profile.email } : {}),
        ...(typeof profile.emailVerified === "boolean"
          ? { emailVerified: profile.emailVerified }
          : {}),
        ...(profile.username ? { username: profile.username } : {}),
        ...(profile.avatarUrl ? { avatarUrl: profile.avatarUrl } : {}),
        ...(profile.profileUrl ? { profileUrl: profile.profileUrl } : {}),
        lastLoginAt: new Date()
      }
    });

    return userByEmail;
  }

  const usernameSource =
    profile.username ?? profile.email?.split("@")[0] ?? profile.name ?? "user";

  const username = await generateUniqueUsername(usernameSource);
  const passwordHash = await createUnusablePasswordHash();

  const user = await prisma.user.create({
    data: {
      name: profile.name ?? profile.username ?? "Codenix User",
      username,
      email:
        profile.email ??
        `${profile.provider}-${profile.providerAccountId}@oauth.codenix.local`,
      passwordHash,
      role: "user",
      ...(profile.avatarUrl ? { avatarUrl: profile.avatarUrl } : {}),
      ...(profile.provider === "github" && profile.profileUrl
        ? { githubUrl: profile.profileUrl }
        : {})
    }
  });

  await prisma.oAuthAccount.create({
    data: {
      userId: user.id,
      provider: profile.provider,
      providerAccountId: profile.providerAccountId,
      ...(profile.email ? { email: profile.email } : {}),
      ...(typeof profile.emailVerified === "boolean"
        ? { emailVerified: profile.emailVerified }
        : {}),
      ...(profile.username ? { username: profile.username } : {}),
      ...(profile.avatarUrl ? { avatarUrl: profile.avatarUrl } : {}),
      ...(profile.profileUrl ? { profileUrl: profile.profileUrl } : {}),
      lastLoginAt: new Date()
    }
  });

  return user;
}

export const oauthService = {
  createAuthorizationUrl(
    provider: SupportedOAuthProvider,
    query: OAuthRedirectQueryInput
  ) {
    const config = getOAuthProviderConfig(provider);
    const state = createOAuthState(provider, query.returnTo);

    const authorizationUrl = new URL(config.authorizationUrl);

    authorizationUrl.searchParams.set("client_id", config.clientId);
    authorizationUrl.searchParams.set("redirect_uri", config.callbackUrl);
    authorizationUrl.searchParams.set("response_type", "code");
    authorizationUrl.searchParams.set("scope", config.scopes.join(" "));
    authorizationUrl.searchParams.set("state", state);

    if (provider === "google") {
      authorizationUrl.searchParams.set("access_type", "offline");
      authorizationUrl.searchParams.set("prompt", "select_account");
    }

    return authorizationUrl.toString();
  },

  async handleCallback(
    provider: SupportedOAuthProvider,
    query: OAuthCallbackQueryInput
  ) {
    if (query.error) {
      return createFrontendCallbackUrl({
        error: query.error
      });
    }

    if (!query.code || !query.state) {
      throw new AppError(400, "INVALID_OAUTH_CALLBACK", "Invalid OAuth callback.");
    }

    const state = verifyOAuthState(query.state, provider);
    const tokenResponse = await exchangeCodeForToken(provider, query.code);
    const profile = await fetchOAuthProfile(provider, tokenResponse.access_token);
    const user = await findOrCreateOAuthUser(profile);
    const session = createAuthSession(user);

    return createFrontendCallbackUrl({
    accessToken: session.accessToken,
    ...(state.returnTo ? { returnTo: state.returnTo } : {})
    });
  }
};