import multer from "multer";
import { AppError } from "../../shared/errors/app-error";

export const commentImageMimetypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export const uploadCommentImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, callback) => {
    if (!commentImageMimetypes.has(file.mimetype)) {
      callback(new AppError(400, "INVALID_FILE_TYPE", "Only JPEG, PNG and WEBP images are allowed."));
      return;
    }
    callback(null, true);
  },
}).single("image");

export function hasValidImageSignature(file: Express.Multer.File) {
  const bytes = file.buffer;
  const isJpeg = bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const isPng = bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  const isWebp = bytes.length >= 12 && bytes.subarray(0, 4).toString("ascii") === "RIFF" && bytes.subarray(8, 12).toString("ascii") === "WEBP";
  return isJpeg || isPng || isWebp;
}
