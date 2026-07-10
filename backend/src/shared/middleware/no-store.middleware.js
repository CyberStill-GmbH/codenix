export function noStoreMiddleware(_req, res, next) {
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Vary", "Authorization");
    next();
}
//# sourceMappingURL=no-store.middleware.js.map