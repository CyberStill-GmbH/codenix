import { Router } from "express";
import { usersController } from "./users.controller";
import {
  activityQuerySchema,
  changePasswordSchema,
  changeUsernameSchema
} from "./users.schema";
import { asyncHandler } from "../../shared/middleware/async-handler";
import { authMiddleware } from "../../shared/middleware/auth.middleware";
import { validate } from "../../shared/middleware/validate.middleware";

export const usersRoutes = Router();

usersRoutes.use(asyncHandler(authMiddleware));

usersRoutes.get("/me/stats", asyncHandler(usersController.stats));

usersRoutes.get("/me/progress", asyncHandler(usersController.progress));

usersRoutes.get(
  "/me/activity",
  validate({ query: activityQuerySchema }),
  asyncHandler(usersController.activity)
);

usersRoutes.patch(
  "/me/password",
  validate({ body: changePasswordSchema }),
  asyncHandler(usersController.changePassword)
);

usersRoutes.patch(
  "/me/username",
  validate({ body: changeUsernameSchema }),
  asyncHandler(usersController.changeUsername)
);

usersRoutes.patch(
  "/me/profile",
  validate({ body: changeUsernameSchema }),
  asyncHandler(usersController.changeUsername)
);