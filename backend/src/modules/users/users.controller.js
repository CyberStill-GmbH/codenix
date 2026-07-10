import { AppError } from "../../shared/errors/app-error";
import { usersService } from "./users.service";
function getAuthenticatedUserId(req) {
    const authReq = req;
    const userId = authReq.user?.id ??
        authReq.user?.userId ??
        authReq.userId ??
        authReq.auth?.userId;
    if (!userId) {
        throw new AppError(401, "UNAUTHORIZED", "Authentication required.");
    }
    return userId;
}
function getValidatedActivityQuery(res) {
    return res.locals.validatedQuery;
}
export const usersController = {
    async stats(req, res) {
        const userId = getAuthenticatedUserId(req);
        const response = await usersService.getStats(userId);
        return res.status(200).json(response);
    },
    async progress(req, res) {
        const userId = getAuthenticatedUserId(req);
        const response = await usersService.getProgress(userId);
        return res.status(200).json(response);
    },
    async activity(req, res) {
        const userId = getAuthenticatedUserId(req);
        const query = getValidatedActivityQuery(res);
        const response = await usersService.getActivity(userId, query);
        return res.status(200).json(response);
    }
};
//# sourceMappingURL=users.controller.js.map