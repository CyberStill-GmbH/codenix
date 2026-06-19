import type { Request, Response } from "express";
import { adminProblemsService } from "./admin-problems.service";
import type {
  AdminProblemBodyInput,
  AdminProblemIdentifierParamsInput,
  AdminProblemTestcaseParamsInput,
  AdminProblemsQueryInput,
  AdminTestcaseBodyInput
} from "./admin-problems.schema";

function getValidatedQuery(res: Response): AdminProblemsQueryInput {
  return res.locals.validatedQuery as AdminProblemsQueryInput;
}

function getValidatedParams(
  res: Response
): AdminProblemIdentifierParamsInput {
  return res.locals.validatedParams as AdminProblemIdentifierParamsInput;
}

function getValidatedBody(res: Response): AdminProblemBodyInput {
  return res.locals.validatedBody as AdminProblemBodyInput;
}

function getValidatedTestcaseParams(
  res: Response
): AdminProblemTestcaseParamsInput {
  return res.locals.validatedParams as AdminProblemTestcaseParamsInput;
}

function getValidatedTestcaseBody(res: Response): AdminTestcaseBodyInput {
  return res.locals.validatedBody as AdminTestcaseBodyInput;
}

export const adminProblemsController = {
  async list(_req: Request, res: Response) {
    const query = getValidatedQuery(res);
    const response = await adminProblemsService.list(query);

    return res.status(200).json(response);
  },

  async findByIdentifier(_req: Request, res: Response) {
    const { problemId } = getValidatedParams(res);
    const response = await adminProblemsService.findByIdentifier(problemId);

    return res.status(200).json(response);
  },

  async create(_req: Request, res: Response) {
    const body = getValidatedBody(res);
    const response = await adminProblemsService.create(body);

    return res.status(201).json(response);
  },

  async update(_req: Request, res: Response) {
    const { problemId } = getValidatedParams(res);
    const body = getValidatedBody(res);
    const response = await adminProblemsService.update(problemId, body);

    return res.status(200).json(response);
  },

  async publish(_req: Request, res: Response) {
    const { problemId } = getValidatedParams(res);
    const response = await adminProblemsService.publish(problemId);

    return res.status(200).json(response);
  },

  async unpublish(_req: Request, res: Response) {
    const { problemId } = getValidatedParams(res);
    const response = await adminProblemsService.unpublish(problemId);

    return res.status(200).json(response);
  },

  async listTestcases(_req: Request, res: Response) {
    const { problemId } = getValidatedParams(res);
    const response = await adminProblemsService.listTestcases(problemId);

    return res.status(200).json(response);
    },

    async createTestcase(_req: Request, res: Response) {
    const { problemId } = getValidatedParams(res);
    const body = getValidatedTestcaseBody(res);
    const response = await adminProblemsService.createTestcase(problemId, body);

    return res.status(201).json(response);
    },

    async updateTestcase(_req: Request, res: Response) {
    const { problemId, testcaseId } = getValidatedTestcaseParams(res);
    const body = getValidatedTestcaseBody(res);
    const response = await adminProblemsService.updateTestcase(
        problemId,
        testcaseId,
        body
    );

    return res.status(200).json(response);
    },

    async deleteTestcase(_req: Request, res: Response) {
    const { problemId, testcaseId } = getValidatedTestcaseParams(res);

    await adminProblemsService.deleteTestcase(problemId, testcaseId);

    return res.status(204).send();
    }
};