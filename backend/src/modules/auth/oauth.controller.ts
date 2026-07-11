import type { CookieOptions, Request, Response } from "express";
import { env } from "../../config/env";
import { oauthService } from "./oauth.service";
import type {
  OAuthCallbackQueryInput,
  OAuthRedirectQueryInput,
} from "./oauth.schema";
import type { SupportedOAuthProvider } from "./oauth.types";

const OAUTH_STATE_TTL_MS = 10 * 60 * 1000;

function getValidatedRedirectQuery(res: Response): OAuthRedirectQueryInput {
  return res.locals.validatedQuery as OAuthRedirectQueryInput;
}

function getValidatedCallbackQuery(res: Response): OAuthCallbackQueryInput {
  return res.locals.validatedQuery as OAuthCallbackQueryInput;
}

function getStateCookieName(provider: SupportedOAuthProvider) {
  return `codenix-oauth-state-${provider}`;
}

function getStateCookieOptions(
  provider: SupportedOAuthProvider,
): CookieOptions {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    path: `/api/auth/${provider}/callback`,
  };
}

function getCookie(req: Request, name: string) {
  const prefix = `${name}=`;
  const cookie = req.headers.cookie
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));

  return cookie?.slice(prefix.length);
}

function redirectToProvider(provider: SupportedOAuthProvider) {
  return (_req: Request, res: Response) => {
    const query = getValidatedRedirectQuery(res);
    const authorizationRequest = oauthService.createAuthorizationRequest(
      provider,
      query,
    );

    res.cookie(getStateCookieName(provider), authorizationRequest.state, {
      ...getStateCookieOptions(provider),
      maxAge: OAUTH_STATE_TTL_MS,
    });

    return res.redirect(authorizationRequest.url);
  };
}

function handleProviderCallback(provider: SupportedOAuthProvider) {
  return async (req: Request, res: Response) => {
    const query = getValidatedCallbackQuery(res);
    const cookieName = getStateCookieName(provider);
    const expectedState = getCookie(req, cookieName);

    res.clearCookie(cookieName, getStateCookieOptions(provider));

    const frontendCallbackUrl = await oauthService.handleCallback(
      provider,
      query,
      expectedState,
    );

    return res.redirect(frontendCallbackUrl);
  };
}

export const oauthController = {
  redirectGoogle: redirectToProvider("google"),
  redirectGitHub: redirectToProvider("github"),
  callbackGoogle: handleProviderCallback("google"),
  callbackGitHub: handleProviderCallback("github"),
};
