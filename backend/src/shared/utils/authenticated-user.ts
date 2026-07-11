import type { Request } from "express";
import { AppError } from "../errors/app-error";

export function requireAuthenticatedUserId(req: Request) {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError(401, "UNAUTHORIZED", "Authentication required.");
  }

  return userId;
}
