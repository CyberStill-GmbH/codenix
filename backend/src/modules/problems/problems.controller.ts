import type { Request, Response } from "express";
import { problemService } from "./problems.service";
import type {
  ProblemSlugParamsInput,
  ProblemsQueryInput,
  ProblemsSearchQueryInput,
  ProblemIdentifierParamsInput,
  RunCodeRequestInput,
  CreateSubmissionRequestInput
} from "./problems.schema";

function getValidatedQuery<T>(res: Response): T {
  return res.locals.validatedQuery as T;
}

function getValidatedParams(res: Response): ProblemSlugParamsInput {
  return res.locals.validatedParams as ProblemSlugParamsInput;
}

export const problemController = {
  async list(req: Request, res: Response) {
    const query = getValidatedQuery<ProblemsQueryInput>(res);
    const response = await problemService.list(query, req.user?.id);

    return res.status(200).json(response);
  },

  async search(_req: Request, res: Response) {
    const query = getValidatedQuery<ProblemsSearchQueryInput>(res);
    const response = await problemService.search(query);

    return res.status(200).json(response);
  },

  async listTopics(_req: Request, res: Response) {
    const response = await problemService.listTopics();

    return res.status(200).json(response);
  },

  async findBySlug(req: Request, res: Response) {
    const { slug } = getValidatedParams(res);
    const problem = await problemService.findBySlug(slug, req.user?.id);

    return res.status(200).json(problem);
  },

  async runCode(req: Request, res: Response) {
    const { problemId } = res.locals.validatedParams as ProblemIdentifierParamsInput;
    const body = res.locals.validatedBody as RunCodeRequestInput;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ code: "UNAUTHORIZED", message: "Unauthorized" });
    }

    const response = await problemService.runCode(problemId, body, userId);
    return res.status(202).json(response);
  },

  async submitCode(req: Request, res: Response) {
    const { problemId } = res.locals.validatedParams as ProblemIdentifierParamsInput;
    const body = res.locals.validatedBody as CreateSubmissionRequestInput;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ code: "UNAUTHORIZED", message: "Unauthorized" });
    }

    const response = await problemService.submitCode(problemId, body, userId);
    return res.status(202).json(response);
  }
};
