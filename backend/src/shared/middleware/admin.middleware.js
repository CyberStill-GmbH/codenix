import { prisma } from "../../db/prisma";
import { AppError } from "../errors/app-error";
function getAuthenticatedUserId(req) {
    const authReq = req;
    return (authReq.user?.id ??
        authReq.user?.userId ??
        authReq.userId ??
        authReq.auth?.userId);
}
export async function adminMiddleware(req, _res, next) {
    const userId = getAuthenticatedUserId(req);
    if (!userId) {
        throw new AppError(401, "UNAUTHORIZED", "Authentication required.");
    }
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
        select: {
            id: true,
            role: true
        }
    });
    if (!user) {
        throw new AppError(401, "UNAUTHORIZED", "Authentication required.");
    }
    if (user.role !== "admin") {
        throw new AppError(403, "FORBIDDEN", "Admin access required.");
    }
    next();
}
//# sourceMappingURL=admin.middleware.js.map