import { AppError } from "../../shared/errors/app-error";
import { submissionsService } from "./submissions.service";
function getValidatedQuery(res) {
    return res.locals.validatedQuery;
}
function getValidatedParams(res) {
    return res.locals.validatedParams;
}
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
export const submissionsController = {
    async list(req, res) {
        const userId = getAuthenticatedUserId(req);
        const query = getValidatedQuery(res);
        const response = await submissionsService.listByUser(userId, query);
        return res.status(200).json(response);
    },
    async findById(req, res) {
        const userId = getAuthenticatedUserId(req);
        const { submissionId } = getValidatedParams(res);
        const response = await submissionsService.findByIdForUser(userId, submissionId);
        return res.status(200).json(response);
    }
};
//# sourceMappingURL=submissions.controller.js.map