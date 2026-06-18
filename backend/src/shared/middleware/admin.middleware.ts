import type { NextFunction, Request, Response } from "express";
import { prisma } from "../../db/prisma";
import { AppError } from "../errors/app-error";

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

  return (
    authReq.user?.id ??
    authReq.user?.userId ??
    authReq.userId ??
    authReq.auth?.userId
  );
}

export async function adminMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const userId = getAuthenticatedUserId(req);

  if (!userId) {
    throw new AppError(401, "UNAUTHORIZED", "Authentication required.");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      id: true,
      role: true
    }
  });

  if (!user) {
    throw new AppError(401, "UNAUTHORIZED", "Authentication required.");
  }

  if (user.role !== "admin") {
    throw new AppError(403, "FORBIDDEN", "Admin access required.");
  }

  next();
}