import type { NextFunction, Request, Response } from "express";
import { prisma } from "../../db/prisma";
import { verifyAccessToken } from "../../modules/auth/jwt.service";
import { AppError } from "../errors/app-error";

const BEARER_PREFIX = "Bearer ";
const MAX_TOKEN_LENGTH = 4096;

export async function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const header = req.header("authorization");

  if (!header || !header.startsWith(BEARER_PREFIX)) {
    throw new AppError(401, "UNAUTHORIZED", "Missing access token.");
  }

  const token = header.slice(BEARER_PREFIX.length).trim();

  if (!token || token.length > MAX_TOKEN_LENGTH) {
    throw new AppError(401, "UNAUTHORIZED", "Invalid access token.");
  }

  const payload = verifyAccessToken(token);

  const user = await prisma.user.findUnique({
    where: {
      id: payload.userId
    },
    select: {
      id: true,
      email: true,
      role: true
    }
  });

  if (!user) {
    throw new AppError(401, "UNAUTHORIZED", "Invalid access token.");
  }

  req.user = {
    id: user.id,
    email: user.email,
    role: user.role
  };

  next();
}