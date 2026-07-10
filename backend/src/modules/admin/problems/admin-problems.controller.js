import { adminProblemsService } from "./admin-problems.service";
function getValidatedQuery(res) {
    return res.locals.validatedQuery;
}
function getValidatedParams(res) {
    return res.locals.validatedParams;
}
function getValidatedBody(res) {
    return res.locals.validatedBody;
}
function getValidatedTestcaseParams(res) {
    return res.locals.validatedParams;
}
function getValidatedTestcaseBody(res) {
    return res.locals.validatedBody;
}
export const adminProblemsController = {
    async list(_req, res) {
        const query = getValidatedQuery(res);
        const response = await adminProblemsService.list(query);
        return res.status(200).json(response);
    },
    async findByIdentifier(_req, res) {
        const { problemId } = getValidatedParams(res);
        const response = await adminProblemsService.findByIdentifier(problemId);
        return res.status(200).json(response);
    },
    async create(_req, res) {
        const body = getValidatedBody(res);
        const response = await adminProblemsService.create(body);
        return res.status(201).json(response);
    },
    async update(_req, res) {
        const { problemId } = getValidatedParams(res);
        const body = getValidatedBody(res);
        const response = await adminProblemsService.update(problemId, body);
        return res.status(200).json(response);
    },
    async publish(_req, res) {
        const { problemId } = getValidatedParams(res);
        const response = await adminProblemsService.publish(problemId);
        return res.status(200).json(response);
    },
    async unpublish(_req, res) {
        const { problemId } = getValidatedParams(res);
        const response = await adminProblemsService.unpublish(problemId);
        return res.status(200).json(response);
    },
    async listTestcases(_req, res) {
        const { problemId } = getValidatedParams(res);
        const response = await adminProblemsService.listTestcases(problemId);
        return res.status(200).json(response);
    },
    async createTestcase(_req, res) {
        const { problemId } = getValidatedParams(res);
        const body = getValidatedTestcaseBody(res);
        const response = await adminProblemsService.createTestcase(problemId, body);
        return res.status(201).json(response);
    },
    async updateTestcase(_req, res) {
        const { problemId, testcaseId } = getValidatedTestcaseParams(res);
        const body = getValidatedTestcaseBody(res);
        const response = await adminProblemsService.updateTestcase(problemId, testcaseId, body);
        return res.status(200).json(response);
    },
    async deleteTestcase(_req, res) {
        const { problemId, testcaseId } = getValidatedTestcaseParams(res);
        await adminProblemsService.deleteTestcase(problemId, testcaseId);
        return res.status(204).send();
    }
};
//# sourceMappingURL=admin-problems.controller.js.map