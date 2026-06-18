import type { Request, Response } from "express";
import { oauthService } from "./oauth.service";
import type {
  OAuthCallbackQueryInput,
  OAuthRedirectQueryInput
} from "./oauth.schema";
import type { SupportedOAuthProvider } from "./oauth.types";

function getValidatedRedirectQuery(res: Response): OAuthRedirectQueryInput {
  return res.locals.validatedQuery as OAuthRedirectQueryInput;
}

function getValidatedCallbackQuery(res: Response): OAuthCallbackQueryInput {
  return res.locals.validatedQuery as OAuthCallbackQueryInput;
}

function redirectToProvider(provider: SupportedOAuthProvider) {
  return (_req: Request, res: Response) => {
    const query = getValidatedRedirectQuery(res);
    const url = oauthService.createAuthorizationUrl(provider, query);

    return res.redirect(url);
  };
}

function handleProviderCallback(provider: SupportedOAuthProvider) {
  return async (_req: Request, res: Response) => {
    const query = getValidatedCallbackQuery(res);
    const frontendCallbackUrl = await oauthService.handleCallback(provider, query);

    return res.redirect(frontendCallbackUrl);
  };
}

export const oauthController = {
  redirectGoogle: redirectToProvider("google"),
  redirectGitHub: redirectToProvider("github"),
  callbackGoogle: handleProviderCallback("google"),
  callbackGitHub: handleProviderCallback("github")
};