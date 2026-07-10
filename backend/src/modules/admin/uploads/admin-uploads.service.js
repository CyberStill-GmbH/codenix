import { mkdir } from "node:fs/promises";
import path from "node:path";
import { env } from "../../../config/env";
import { AppError } from "../../../shared/errors/app-error";
const UPLOADS_ROOT = path.resolve(process.cwd(), "uploads");
const IMAGES_DIR = path.join(UPLOADS_ROOT, "images");
const allowedMimeTypes = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif"
]);
export async function ensureImagesUploadDir() {
    await mkdir(IMAGES_DIR, { recursive: true });
}
export function assertAllowedImage(file) {
    if (!file) {
        throw new AppError(400, "FILE_REQUIRED", "Image file is required.");
    }
    if (!allowedMimeTypes.has(file.mimetype)) {
        throw new AppError(400, "INVALID_FILE_TYPE", "Only JPEG, PNG, WEBP and GIF images are allowed.");
    }
}
export function createImageUrl(filename) {
    const apiBaseUrl = `http://localhost:${env.PORT}`;
    return `${apiBaseUrl}/uploads/images/${filename}`;
}
export const adminUploadsService = {
    async uploadImage(file) {
        assertAllowedImage(file);
        return {
            url: createImageUrl(file.filename)
        };
    }
};
//# sourceMappingURL=admin-uploads.service.js.map