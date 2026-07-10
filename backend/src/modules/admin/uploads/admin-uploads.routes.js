import { Router } from "express";
import { adminUploadsController } from "./admin-uploads.controller";
import { uploadAdminImage } from "./admin-uploads.middleware";
import { asyncHandler } from "../../../shared/middleware/async-handler";
import { authMiddleware } from "../../../shared/middleware/auth.middleware";
import { adminMiddleware } from "../../../shared/middleware/admin.middleware";
export const adminUploadsRoutes = Router();
adminUploadsRoutes.use(asyncHandler(authMiddleware));
adminUploadsRoutes.use(asyncHandler(adminMiddleware));
adminUploadsRoutes.post("/images", uploadAdminImage, asyncHandler(adminUploadsController.uploadImage));
//# sourceMappingURL=admin-uploads.routes.js.map