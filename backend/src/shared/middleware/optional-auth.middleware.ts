import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app-error";
import {
  getAccessTokenUser,
  isBearerAuthorizationHeader
} from "../utils/access-token-user";

export async function optionalAuthMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const header = req.header("authorization");

  if (!header) {
    next();
    return;
  }

  if (!isBearerAuthorizationHeader(header)) {
    throw new AppError(401, "UNAUTHORIZED", "Invalid authorization header.");
  }

  req.user = await getAccessTokenUser(header);

  next();
}
