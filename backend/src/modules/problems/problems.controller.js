import { problemService } from "./problems.service";
function getValidatedQuery(res) {
    return res.locals.validatedQuery;
}
function getValidatedParams(res) {
    return res.locals.validatedParams;
}
export const problemController = {
    async list(req, res) {
        const query = getValidatedQuery(res);
        const response = await problemService.list(query, req.user?.id);
        return res.status(200).json(response);
    },
    async search(_req, res) {
        const query = getValidatedQuery(res);
        const response = await problemService.search(query);
        return res.status(200).json(response);
    },
    async listTopics(_req, res) {
        const response = await problemService.listTopics();
        return res.status(200).json(response);
    },
    async findBySlug(req, res) {
        const { slug } = getValidatedParams(res);
        const problem = await problemService.findBySlug(slug, req.user?.id);
        return res.status(200).json(problem);
    },
    async runCode(req, res) {
        const { problemId } = res.locals.validatedParams;
        const body = res.locals.validatedBody;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ code: "UNAUTHORIZED", message: "Unauthorized" });
        }
        const response = await problemService.runCode(problemId, body, userId);
        return res.status(202).json(response);
    },
    async submitCode(req, res) {
        const { problemId } = res.locals.validatedParams;
        const body = res.locals.validatedBody;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ code: "UNAUTHORIZED", message: "Unauthorized" });
        }
        const response = await problemService.submitCode(problemId, body, userId);
        return res.status(202).json(response);
    }
};
//# sourceMappingURL=problems.controller.js.map