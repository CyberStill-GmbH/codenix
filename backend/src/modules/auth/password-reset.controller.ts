import type { Request, Response } from "express";
import { passwordResetService } from "./password-reset.service";

export const passwordResetController = {
  async forgotPassword(req: Request, res: Response) {
    await passwordResetService.forgotPassword(req.body);

    return res.status(204).send();
  },

  async resetPassword(req: Request, res: Response) {
    await passwordResetService.resetPassword(req.body);

    return res.status(204).send();
  }
};