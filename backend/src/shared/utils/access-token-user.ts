import { prisma } from "../../db/prisma";
import { verifyAccessToken } from "../../modules/auth/jwt.service";
import { AppError } from "../errors/app-error";

const BEARER_PREFIX = "Bearer ";
const MAX_TOKEN_LENGTH = 4096;

export function isBearerAuthorizationHeader(header: string) {
  return header.startsWith(BEARER_PREFIX);
}

export async function getAccessTokenUser(header: string) {
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

  return user;
}
