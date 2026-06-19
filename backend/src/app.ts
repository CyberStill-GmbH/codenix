import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "node:path";
import { adminUploadsRoutes } from "./modules/admin/uploads/admin-uploads.routes";
import { corsOptions } from "./config/cors";
import { env } from "./config/env";
import { authRoutes } from "./modules/auth/auth.routes";
import { errorHandler } from "./shared/errors/error-handler";
import { noStoreMiddleware } from "./shared/middleware/no-store.middleware";
import { notFoundHandler } from "./shared/middleware/not-found.middleware";
import { requestIdMiddleware } from "./shared/middleware/request-id.middleware";
import { problemsRoutes } from "./modules/problems/problems.routes";
import { submissionsRoutes } from "./modules/submissions/submissions.routes";
import { adminProblemsRoutes } from "./modules/admin/problems/admin-problems.routes";
import { usersRoutes } from "./modules/users/users.routes";
import { runsRoutes } from "./modules/runs/runs.routes";

export const app = express();

app.disable("etag");

app.use(requestIdMiddleware);
app.use(helmet());

app.use(cors(corsOptions));

app.use(express.json({ limit: "1mb" }));
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

app.use("/api", noStoreMiddleware);

app.get("/api/health", (_req, res) => {
  return res.status(200).json({
    status: "ok"
  });
});

app.use(
  "/uploads/images",
  express.static(path.resolve(process.cwd(), "uploads", "images"))
);

app.use("/api/auth", authRoutes);
app.use("/api/problems", problemsRoutes);
app.use("/api/submissions", submissionsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/runs", runsRoutes);
app.use("/api/admin/problems", adminProblemsRoutes);
app.use("/api/admin/uploads", adminUploadsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
