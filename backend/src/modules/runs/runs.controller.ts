import type { Request, Response } from "express";
import { requireAuthenticatedUserId } from "../../shared/utils/authenticated-user";
import { runsService } from "./runs.service";

export class RunsController {
  async getRun(req: Request, res: Response) {
    const runId = res.locals.validatedParams.runId;
    const userId = requireAuthenticatedUserId(req);

    const run = await runsService.getRunById(runId, userId);

    return res.status(200).json(run);
  }
}

export const runsController = new RunsController();
