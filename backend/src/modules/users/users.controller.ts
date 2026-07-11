import type { Request, Response } from "express";
import { requireAuthenticatedUserId } from "../../shared/utils/authenticated-user";
import { usersService } from "./users.service";
import type { ActivityQueryInput } from "./users.schema";

function getValidatedActivityQuery(res: Response): ActivityQueryInput {
  return res.locals.validatedQuery as ActivityQueryInput;
}

export const usersController = {
  async stats(req: Request, res: Response) {
    const userId = requireAuthenticatedUserId(req);
    const response = await usersService.getStats(userId);

    return res.status(200).json(response);
  },

  async progress(req: Request, res: Response) {
    const userId = requireAuthenticatedUserId(req);
    const response = await usersService.getProgress(userId);

    return res.status(200).json(response);
  },

  async activity(req: Request, res: Response) {
    const userId = requireAuthenticatedUserId(req);
    const query = getValidatedActivityQuery(res);
    const response = await usersService.getActivity(userId, query);

    return res.status(200).json(response);
  }
};