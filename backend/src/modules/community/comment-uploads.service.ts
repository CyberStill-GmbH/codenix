import crypto from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { AppError } from "../../shared/errors/app-error";
import { prisma } from "../../db/prisma";
import { hasValidImageSignature, commentImageMimetypes } from "./comment-uploads.middleware";

const directory = path.resolve(process.cwd(), "uploads", "images", "comments");
const extensionByMime: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

export const commentUploadsService = {
  async upload(problemId: string, file: Express.Multer.File | undefined) {
    const problem = await prisma.problem.findUnique({ where: { id: problemId }, select: { id: true } });
    if (!problem) throw new AppError(404, "PROBLEM_NOT_FOUND", "Problem not found.");
    if (!file) throw new AppError(400, "FILE_REQUIRED", "Image file is required.");
    if (!commentImageMimetypes.has(file.mimetype) || !hasValidImageSignature(file)) {
      throw new AppError(400, "INVALID_FILE_TYPE", "The uploaded file is not a supported image.");
    }
    await mkdir(directory, { recursive: true });
    const filename = `${crypto.randomUUID()}.${extensionByMime[file.mimetype]}`;
    await writeFile(path.join(directory, filename), file.buffer, { flag: "wx", mode: 0o600 });
    return { url: `/uploads/images/comments/${filename}` };
  },
};
