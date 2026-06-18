import type { Request, Response } from "express";
import { AppError } from "../../shared/errors/app-error";
import { submissionsService } from "./submissions.service";
import type { SubmissionsQueryInput } from "./submissions.schema";

type AuthenticatedRequest = Request & {
  user?: {
    id?: string;
    userId?: string;
  };
  userId?: string;
  auth?: {
    userId?: string;
  };
};

function getValidatedQuery(res: Response): SubmissionsQueryInput {
  return res.locals.validatedQuery as SubmissionsQueryInput;
}

function getAuthenticatedUserId(req: Request) {
  const authReq = req as AuthenticatedRequest;

  const userId =
    authReq.user?.id ??
    authReq.user?.userId ??
    authReq.userId ??
    authReq.auth?.userId;

  if (!userId) {
    throw new AppError(401, "UNAUTHORIZED", "Authentication required.");
  }

  return userId;
}

export const submissionsController = {
  async list(req: Request, res: Response) {
    const userId = getAuthenticatedUserId(req);
    const query = getValidatedQuery(res);
    const response = await submissionsService.listByUser(userId, query);

    return res.status(200).json(response);
  }
};