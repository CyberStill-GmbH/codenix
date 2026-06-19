import path from "node:path";
import crypto from "node:crypto";
import multer from "multer";
import { AppError } from "../../../shared/errors/app-error";

const uploadDir = path.resolve(process.cwd(), "uploads", "images");

const extensionByMimeType: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif"
};

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, uploadDir);
  },

  filename: (_req, file, callback) => {
    const extension = extensionByMimeType[file.mimetype];

    if (!extension) {
      callback(
        new AppError(
          400,
          "INVALID_FILE_TYPE",
          "Only JPEG, PNG, WEBP and GIF images are allowed."
        ),
        ""
      );
      return;
    }

    const safeName = `${Date.now()}-${crypto.randomUUID()}${extension}`;
    callback(null, safeName);
  }
});

export const uploadAdminImage = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024
  },
  fileFilter: (_req, file, callback) => {
    if (!extensionByMimeType[file.mimetype]) {
      callback(
        new AppError(
          400,
          "INVALID_FILE_TYPE",
          "Only JPEG, PNG, WEBP and GIF images are allowed."
        )
      );
      return;
    }

    callback(null, true);
  }
}).single("file");