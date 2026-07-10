import { Router } from "express";
import { usersController } from "./users.controller";
import { activityQuerySchema } from "./users.schema";
import { asyncHandler } from "../../shared/middleware/async-handler";
import { authMiddleware } from "../../shared/middleware/auth.middleware";
import { validate } from "../../shared/middleware/validate.middleware";
export const usersRoutes = Router();
usersRoutes.use(asyncHandler(authMiddleware));
usersRoutes.get("/me/stats", asyncHandler(usersController.stats));
usersRoutes.get("/me/progress", asyncHandler(usersController.progress));
usersRoutes.get("/me/activity", validate({ query: activityQuerySchema }), asyncHandler(usersController.activity));
//# sourceMappingURL=users.routes.js.map