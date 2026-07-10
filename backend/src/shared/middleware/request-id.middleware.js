import { randomUUID } from "node:crypto";
export function requestIdMiddleware(req, res, next) {
    const requestId = req.header("x-header-id") ?? randomUUID();
    req.requestId = requestId;
    res.setHeader("x-request-id", requestId);
    next();
}
//# sourceMappingURL=request-id.middleware.js.map