import type { Request, Response } from "express";
import { problemService } from "./problems.service";
import type {
  ProblemSlugParamsInput,
  ProblemsQueryInput,
  ProblemsSearchQueryInput
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
  }
};
