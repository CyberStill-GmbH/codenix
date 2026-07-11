import type { Request, Response } from "express";
import { requireAuthenticatedUserId } from "../../shared/utils/authenticated-user";
import { submissionsService } from "./submissions.service";
import type {
  SubmissionParamsInput,
  SubmissionsQueryInput
} from "./submissions.schema";

function getValidatedQuery(res: Response): SubmissionsQueryInput {
  return res.locals.validatedQuery as SubmissionsQueryInput;
}

function getValidatedParams(res: Response): SubmissionParamsInput {
  return res.locals.validatedParams as SubmissionParamsInput;
}

export const submissionsController = {
  async list(req: Request, res: Response) {
    const userId = requireAuthenticatedUserId(req);
    const query = getValidatedQuery(res);
    const response = await submissionsService.listByUser(userId, query);

    return res.status(200).json(response);
  },

  async findById(req: Request, res: Response) {
    const userId = requireAuthenticatedUserId(req);
    const { submissionId } = getValidatedParams(res);
    const response = await submissionsService.findByIdForUser(
      userId,
      submissionId
    );

    return res.status(200).json(response);
  }
};