import type { SupportedOAuthProvider } from "./oauth.types";
export declare function createOAuthState(provider: SupportedOAuthProvider, returnTo?: string): string;
export declare function verifyOAuthState(state: string, expectedProvider: SupportedOAuthProvider): {
    provider: SupportedOAuthProvider;
    returnTo: string | undefined;
};
//# sourceMappingURL=oauth.state.d.ts.map