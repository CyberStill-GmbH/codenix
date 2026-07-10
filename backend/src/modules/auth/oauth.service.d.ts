import type { OAuthCallbackQueryInput, OAuthRedirectQueryInput } from "./oauth.schema";
import type { SupportedOAuthProvider } from "./oauth.types";
export declare const oauthService: {
    createAuthorizationUrl(provider: SupportedOAuthProvider, query: OAuthRedirectQueryInput): string;
    handleCallback(provider: SupportedOAuthProvider, query: OAuthCallbackQueryInput): Promise<string>;
};
//# sourceMappingURL=oauth.service.d.ts.map