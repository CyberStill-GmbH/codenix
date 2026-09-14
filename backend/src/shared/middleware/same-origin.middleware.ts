import type { NextFunction, Request, Response } from "express";
import { env } from "../../config/env";
import { AppError } from "../errors/app-error";

/** Bearer auth is the primary CSRF boundary; this adds an explicit origin check for browser mutations. */
export function sameOriginMiddleware(req: Request, _res: Response, next: NextFunction) {
  const origin = req.header("origin");
  if (origin && origin !== env.FRONTEND_URL) {
    throw new AppError(403, "ORIGIN_NOT_ALLOWED", "Request origin is not allowed.");
  }
  next();
}
