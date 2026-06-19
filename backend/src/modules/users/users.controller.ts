import type { Request, Response } from "express";
import { AppError } from "../../shared/errors/app-error";
import { usersService } from "./users.service";
import type { ActivityQueryInput } from "./users.schema";

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

function getValidatedActivityQuery(res: Response): ActivityQueryInput {
  return res.locals.validatedQuery as ActivityQueryInput;
}

export const usersController = {
  async stats(req: Request, res: Response) {
    const userId = getAuthenticatedUserId(req);
    const response = await usersService.getStats(userId);

    return res.status(200).json(response);
  },

  async progress(req: Request, res: Response) {
    const userId = getAuthenticatedUserId(req);
    const response = await usersService.getProgress(userId);

    return res.status(200).json(response);
  },

  async activity(req: Request, res: Response) {
    const userId = getAuthenticatedUserId(req);
    const query = getValidatedActivityQuery(res);
    const response = await usersService.getActivity(userId, query);

    return res.status(200).json(response);
  }
};