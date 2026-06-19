import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { env } from "../../config/env";
import { prisma } from "../../db/prisma";
import { AppError } from "../../shared/errors/app-error";
import { hashPassword } from "./password.service";
import type {
  ForgotPasswordInput,
  ResetPasswordInput
} from "./password-reset.schema";

const RESET_TOKEN_TTL_MS = 15 * 60 * 1000;

function createResetToken() {
  return randomBytes(32).toString("base64url");
}

function hashResetToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function safeTokenHashCompare(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function createResetUrl(token: string) {
  const url = new URL("/reset-password", env.FRONTEND_URL);
  url.searchParams.set("token", token);

  return url.toString();
}

export const passwordResetService = {
  async forgotPassword(input: ForgotPasswordInput) {
    const user = await prisma.user.findUnique({
      where: {
        email: input.email
      },
      select: {
        id: true,
        email: true
      }
    });

    // Respuesta genérica: no revelar si el email existe o no.
    if (!user) {
      return;
    }

    const token = createResetToken();
    const tokenHash = hashResetToken(token);
    const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);

    await prisma.$transaction([
      prisma.passwordResetToken.updateMany({
        where: {
          userId: user.id,
          usedAt: null
        },
        data: {
          usedAt: new Date()
        }
      }),

      prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash,
          expiresAt
        }
      })
    ]);

    const resetUrl = createResetUrl(token);

    // MVP/dev: luego esto se reemplaza por email real.
    if (env.NODE_ENV !== "production") {
      console.log("");
      console.log("🔐 Password reset link:");
      console.log(`Email: ${user.email}`);
      console.log(`URL: ${resetUrl}`);
      console.log("");
    }
  },

  async resetPassword(input: ResetPasswordInput) {
    const tokenHash = hashResetToken(input.token);

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: {
        tokenHash
      },
      include: {
        user: true
      }
    });

    if (!resetToken) {
      throw new AppError(400, "INVALID_RESET_TOKEN", "Invalid or expired reset token.");
    }

    const tokenHashMatches = safeTokenHashCompare(resetToken.tokenHash, tokenHash);

    if (!tokenHashMatches) {
      throw new AppError(400, "INVALID_RESET_TOKEN", "Invalid or expired reset token.");
    }

    if (resetToken.usedAt) {
      throw new AppError(400, "INVALID_RESET_TOKEN", "Invalid or expired reset token.");
    }

    if (resetToken.expiresAt.getTime() < Date.now()) {
      throw new AppError(400, "INVALID_RESET_TOKEN", "Invalid or expired reset token.");
    }

    const newPasswordHash = await hashPassword(input.newPassword);

    await prisma.$transaction([
      prisma.user.update({
        where: {
          id: resetToken.userId
        },
        data: {
          passwordHash: newPasswordHash
        }
      }),

      prisma.passwordResetToken.update({
        where: {
          id: resetToken.id
        },
        data: {
          usedAt: new Date()
        }
      }),

      prisma.passwordResetToken.updateMany({
        where: {
          userId: resetToken.userId,
          usedAt: null,
          id: {
            not: resetToken.id
          }
        },
        data: {
          usedAt: new Date()
        }
      })
    ]);
  }
};