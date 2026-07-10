import { oauthService } from "./oauth.service";
function getValidatedRedirectQuery(res) {
    return res.locals.validatedQuery;
}
function getValidatedCallbackQuery(res) {
    return res.locals.validatedQuery;
}
function redirectToProvider(provider) {
    return (_req, res) => {
        const query = getValidatedRedirectQuery(res);
        const url = oauthService.createAuthorizationUrl(provider, query);
        return res.redirect(url);
    };
}
function handleProviderCallback(provider) {
    return async (_req, res) => {
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
//# sourceMappingURL=oauth.controller.js.map