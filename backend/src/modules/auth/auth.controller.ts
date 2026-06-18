import type { Request, Response } from "express";
import { authService } from "./auth.service";

export const authController = {
  async register(req: Request, res: Response) {
    const session = await authService.register(req.body);
    return res.status(201).json(session);
  },

  async login(req: Request, res: Response) {
    const session = await authService.login(req.body);
    return res.status(200).json(session);
  },

  async me(req: Request, res: Response) {
    const user = await authService.me(req.user!.id);
    return res.status(200).json(user);
  },

  async logout(_req: Request, res: Response) {
    return res.status(204).send();
  }
};