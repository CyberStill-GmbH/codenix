import type { NextFunction, Request, Response } from "express";
import { prisma } from "../../db/prisma";
import { AppError } from "../errors/app-error";
import { requireAuthenticatedUserId } from "../utils/authenticated-user";

export async function adminMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const userId = requireAuthenticatedUserId(req);

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