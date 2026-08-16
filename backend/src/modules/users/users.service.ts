import bcrypt from "bcryptjs";
import { prisma } from "../../db/prisma";
import { AppError } from "../../shared/errors/app-error";
import { solvedProblemsService } from "../../shared/services/solved-problems.service";
import type { ActivityQueryInput } from "./users.schema";

const difficulties = ["easy", "medium", "hard"] as const;
const DISTRIBUTION_BUCKET_SIZE = 5;

function roundPercentage(value: number) {
  return Math.round(value * 10) / 10;
}

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function toDistributionBucket(solvedProblems: number) {
  if (solvedProblems === 0) {
    return "0";
  }

  const start =
    Math.floor((solvedProblems - 1) / DISTRIBUTION_BUCKET_SIZE) *
      DISTRIBUTION_BUCKET_SIZE +
    1;
  const end = start + DISTRIBUTION_BUCKET_SIZE - 1;

  return `${start}-${end}`;
}

function getBucketStart(bucket: string) {
  if (bucket === "0") {
    return 0;
  }

  return Number(bucket.split("-")[0]);
}

async function getRankingSummary(userId: string, solvedProblems: number) {
  const [activeUserIds, solvedCounts] = await Promise.all([
    solvedProblemsService.getActiveUserIds(),
    solvedProblemsService.getSolvedProblemCountsByUser()
  ]);

  const solvedByUser = new Map(
    solvedCounts.map((item) => [item.userId, item.solvedProblems])
  );
  const rankingUserIds = new Set(activeUserIds);

  rankingUserIds.add(userId);

  const rankingCounts = [...rankingUserIds].map((rankingUserId) =>
    rankingUserId === userId
      ? solvedProblems
      : solvedByUser.get(rankingUserId) ?? 0
  );

  const totalUsers = rankingCounts.length;
  const rank =
    totalUsers === 0
      ? 1
      : rankingCounts.filter((count) => count > solvedProblems).length + 1;
  const percentile =
    totalUsers === 0
      ? 0
      : roundPercentage((rank / totalUsers) * 100);
  const userBucket = toDistributionBucket(solvedProblems);
  const usersInBucket = rankingCounts.filter(
    (count) => toDistributionBucket(count) === userBucket,
  );
  const bucketRank =
    usersInBucket.filter((count) => count > solvedProblems).length + 1;
  const bucketTotalUsers = usersInBucket.length;
  const bucketPercentile =
    bucketTotalUsers === 0
      ? 0
      : roundPercentage((bucketRank / bucketTotalUsers) * 100);

  const distributionByBucket = new Map<string, number>();

  for (const count of rankingCounts) {
    const bucket = toDistributionBucket(count);
    distributionByBucket.set(bucket, (distributionByBucket.get(bucket) ?? 0) + 1);
  }

  const distribution = [...distributionByBucket.entries()]
    .sort(([bucketA], [bucketB]) => getBucketStart(bucketA) - getBucketStart(bucketB))
    .map(([bucket, count]) => ({
      bucket,
      count
    }));

  return {
    rank,
    percentile,
    bucket: userBucket,
    bucketRank,
    bucketTotalUsers,
    bucketPercentile,
    totalUsers,
    distribution
  };
}

export const usersService = {
  async getStats(userId: string) {
    const [totalSubmissions, acceptedSubmissions, attemptedProblems, solvedProblems] =
      await Promise.all([
        prisma.submission.count({
          where: {
            userId
          }
        }),

        prisma.submission.count({
          where: {
            userId,
            result: "accepted"
          }
        }),

        prisma.submission.findMany({
          where: {
            userId
          },
          distinct: ["problemId"],
          select: {
            problemId: true
          }
        }),

        solvedProblemsService.getSolvedProblemCount(userId)
      ]);

    const ranking = await getRankingSummary(userId, solvedProblems);

    const acceptanceRate =
      totalSubmissions === 0
        ? 0
        : roundPercentage((acceptedSubmissions / totalSubmissions) * 100);

    return {
      totalSubmissions,
      acceptedSubmissions,
      attemptedProblems: attemptedProblems.length,
      solvedProblems,
      acceptanceRate,
      currentStreak: 0,
      rank: ranking.rank,
      percentile: ranking.percentile,
      bucket: ranking.bucket,
      bucketRank: ranking.bucketRank,
      bucketTotalUsers: ranking.bucketTotalUsers,
      bucketPercentile: ranking.bucketPercentile,
      totalUsers: ranking.totalUsers,
      distribution: ranking.distribution
    };
  },

  async getProgress(userId: string) {
    const [publishedProblems, solvedRows] = await Promise.all([
      prisma.problem.findMany({
        where: {
          status: "published"
        },
        select: {
          id: true,
          difficulty: true
        }
      }),

      prisma.submission.findMany({
        where: {
          userId,
          result: "accepted",
          problem: {
            is: {
              status: "published"
            }
          }
        },
        distinct: ["problemId"],
        select: {
          problemId: true
        }
      })
    ]);

    const solvedProblemIds = new Set(solvedRows.map((row) => row.problemId));

    const data = difficulties.map((difficulty) => {
      const total = publishedProblems.filter(
        (problem) => problem.difficulty === difficulty
      ).length;

      const solved = publishedProblems.filter(
        (problem) =>
          problem.difficulty === difficulty && solvedProblemIds.has(problem.id)
      ).length;

      return {
        difficulty,
        solved,
        total
      };
    });

    const total = data.reduce((sum, item) => sum + item.total, 0);
    const solved = data.reduce((sum, item) => sum + item.solved, 0);

    return {
      data,
      totals: {
        solved,
        total
      }
    };
  },

  async getActivity(userId: string, query: ActivityQueryInput) {
    const startDate = new Date(Date.UTC(query.year, 0, 1, 0, 0, 0));
    const endDate = new Date(Date.UTC(query.year + 1, 0, 1, 0, 0, 0));

    const submissions = await prisma.submission.findMany({
      where: {
        userId,
        submittedAt: {
          gte: startDate,
          lt: endDate
        }
      },
      select: {
        submittedAt: true,
        result: true
      },
      orderBy: {
        submittedAt: "asc"
      }
    });

    const activityByDate = new Map<
      string,
      {
        date: string;
        count: number;
        accepted: number;
      }
    >();

    for (const submission of submissions) {
      const date = toDateKey(submission.submittedAt);
      const current =
        activityByDate.get(date) ??
        {
          date,
          count: 0,
          accepted: 0
        };

      current.count += 1;

      if (submission.result === "accepted") {
        current.accepted += 1;
      }

      activityByDate.set(date, current);
    }

    return {
      year: query.year,
      data: [...activityByDate.values()]
    };
  },

  async changeUserPassword(
    userId: string,
    currentPassword: string,
    confirmPassword: string,
    newPassword: string
  ) {
    if (!currentPassword || !confirmPassword || !newPassword) {
      throw new AppError(400, "MISSING_FIELDS", "Todos los campos son obligatorios.");
    }

    if (confirmPassword !== newPassword) {
      throw new AppError(400, "PASSWORD_MISMATCH", "Las contraseñas no coinciden.");
    }

    if (newPassword.length < 8) {
      throw new AppError(
        400,
        "PASSWORD_TOO_SHORT",
        "La nueva contraseña debe tener al menos 8 caracteres."
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    });

    if (!user) {
      throw new AppError(404, "USER_NOT_FOUND", "Usuario no encontrado.");
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.passwordHash
    );

    if (!isCurrentPasswordValid) {
      throw new AppError(400, "INVALID_CURRENT_PASSWORD", "La contraseña actual es incorrecta.");
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        passwordHash: newPasswordHash
      }
    });

    return {
      message: "Contraseña actualizada de forma exitosa."
    };
  },

  async changeUsername(
    userId: string,
    input: { name?: string | undefined; newUsername?: string | undefined } | string
  ) {
    const payload = typeof input === "string" ? { newUsername: input } : input;
    const { name, newUsername } = payload;

    if (!name && !newUsername) {
      throw new AppError(400, "MISSING_FIELDS", "No se ingresó información para actualizar.");
    }

    const updateData: { name?: string; username?: string } = {};

    if (name !== undefined && name.trim().length > 0) {
      const trimmedName = name.trim();
      if (trimmedName.length < 2 || trimmedName.length > 50) {
        throw new AppError(
          400,
          "INVALID_NAME_FORMAT",
          "El nombre completo debe tener entre 2 y 50 caracteres."
        );
      }
      updateData.name = trimmedName;
    }

    if (newUsername !== undefined && newUsername.trim().length > 0) {
      const trimmedUsername = newUsername.trim();
      if (!/^[a-zA-Z0-9_]{3,20}$/.test(trimmedUsername)) {
        throw new AppError(
          400,
          "INVALID_USERNAME_FORMAT",
          "Nombre de usuario inválido. Usa 3-20 caracteres alfanuméricos o _."
        );
      }

      const existingUser = await prisma.user.findUnique({
        where: {
          username: trimmedUsername
        }
      });

      if (existingUser && existingUser.id !== userId) {
        throw new AppError(409, "USERNAME_TAKEN", "El nombre de usuario ya está en uso.");
      }

      updateData.username = trimmedUsername;
    }

    if (Object.keys(updateData).length === 0) {
      throw new AppError(400, "NO_CHANGES", "No se realizaron cambios.");
    }

    const user = await prisma.user.update({
      where: {
        id: userId
      },
      data: updateData,
      select: {
        id: true,
        name: true,
        username: true,
        email: true
      }
    });

    return {
      message: "Información de perfil actualizada exitosamente.",
      user
    };
  }
};
