import { env } from "../../config/env";
import { AppError } from "../../shared/errors/app-error";
import type {
  OAuthProviderConfig,
  SupportedOAuthProvider
} from "./oauth.types";

export const oauthProviders: Record<SupportedOAuthProvider, OAuthProviderConfig> = {
  google: {
    provider: "google",
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    callbackUrl: env.GOOGLE_CALLBACK_URL,
    authorizationUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    userInfoUrl: "https://openidconnect.googleapis.com/v1/userinfo",
    scopes: ["openid", "email", "profile"]
  },

  github: {
    provider: "github",
    clientId: env.GITHUB_CLIENT_ID,
    clientSecret: env.GITHUB_CLIENT_SECRET,
    callbackUrl: env.GITHUB_CALLBACK_URL,
    authorizationUrl: "https://github.com/login/oauth/authorize",
    tokenUrl: "https://github.com/login/oauth/access_token",
    userInfoUrl: "https://api.github.com/user",
    scopes: ["read:user", "user:email"]
  }
};

export function getOAuthProviderConfig(provider: SupportedOAuthProvider) {
  const config = oauthProviders[provider];

  if (!config.clientId || !config.clientSecret) {
    throw new AppError(
      503,
      "OAUTH_PROVIDER_NOT_CONFIGURED",
      `OAuth provider ${provider} is not configured.`
    );
  }

  return config;
}