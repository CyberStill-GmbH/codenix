import type { Request, Response } from "express";
import { problemService } from "./problems.service";
import type {
  ProblemSlugParamsInput,
  ProblemsQueryInput
} from "./problems.schema";

function getValidatedQuery(res: Response): ProblemsQueryInput {
  return res.locals.validatedQuery as ProblemsQueryInput;
}

function getValidatedParams(res: Response): ProblemSlugParamsInput {
  return res.locals.validatedParams as ProblemSlugParamsInput;
}

export const problemController = {
  async list(_req: Request, res: Response) {
    const query = getValidatedQuery(res);
    const response = await problemService.list(query);

    return res.status(200).json(response);
  },

  async listTopics(_req: Request, res: Response) {
    const response = await problemService.listTopics();

    return res.status(200).json(response);
  },

  async findBySlug(_req: Request, res: Response) {
    const { slug } = getValidatedParams(res);
    const problem = await problemService.findBySlug(slug);

    return res.status(200).json(problem);
  }
};