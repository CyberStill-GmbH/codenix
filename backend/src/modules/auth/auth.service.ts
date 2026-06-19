import { randomInt } from "node:crypto";
import { prisma } from "../../db/prisma";
import { AppError } from "../../shared/errors/app-error";
import { toAuthUser } from "./auth.mapper";
import { signAccessToken } from "./jwt.service";
import { hashPassword, verifyPassword } from "./password.service";
import type { LoginInput, RegisterInput } from "./auth.schema";
import type { User } from "../../generated/prisma/client";

const DUMMY_PASSWORD_HASH =
  "$2a$12$C6UzMDM.H6dfI/f/IKcEeOZzTQaSEZ2fKRG17eImi9Lo9beTJD32e";

function isPrismaUniqueError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2002"
  );
}

function createAuthSession(user: User) {
  return {
    accessToken: signAccessToken(user.id),
    user: toAuthUser(user)
  };
}

function normalizeUsernameBase(email: string) {
  const localPart = email.split("@").at(0);

  const sanitized = (localPart ?? "user")
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);

  return sanitized || "user";
}

async function generateUniqueUsername(email: string) {
  const base = normalizeUsernameBase(email);

  for (let attempt = 0; attempt < 20; attempt++) {
    const username = attempt === 0 ? base : `${base}-${randomInt(1000, 9999)}`;

    const existing = await prisma.user.findUnique({
      where: {
        username
      },
      select: {
        id: true
      }
    });

    if (!existing) {
      return username;
    }
  }

  return `user-${randomInt(100000, 999999)}`;
}

export const authService = {
  async register(input: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: input.email
      },
      select: {
        id: true
      }
    });

    if (existingUser) {
      throw new AppError(409, "EMAIL_ALREADY_EXISTS", "Email is already registered.");
    }

    const passwordHash = await hashPassword(input.password);
    const username = await generateUniqueUsername(input.email);

    try {
      const user = await prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          username,
          passwordHash,
          role: "user"
        }
      });

      return createAuthSession(user);
    } catch (error) {
      if (isPrismaUniqueError(error)) {
        throw new AppError(409, "USER_ALREADY_EXISTS", "User already exists.");
      }

      throw error;
    }
  },

  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: {
        email: input.email
      }
    });

    const passwordHash = user?.passwordHash ?? DUMMY_PASSWORD_HASH;
    const validPassword = await verifyPassword(input.password, passwordHash);

    if (!user || !validPassword) {
      throw new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password.");
    }

    return createAuthSession(user);
  },

  async me(userId: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    });

    if (!user) {
      throw new AppError(401, "UNAUTHORIZED", "Invalid access token.");
    }

    return toAuthUser(user);
  }
};