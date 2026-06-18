import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import { authRoutes } from "./modules/auth/auth.routes";
import { errorHandler } from "./shared/errors/error-handler";
import { notFoundHandler } from "./shared/middleware/not-found.middleware";
import { requestIdMiddleware } from "./shared/middleware/request-id.middleware";
import { problemsRoutes } from "./modules/problems/problems.routes";
import { submissionsRoutes } from "./modules/submissions/submissions.routes";
import { adminProblemsRoutes } from "./modules/admin/problems/admin-problems.routes";

export const app = express();

app.use(requestIdMiddleware);
app.use(helmet());

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

app.get("/api/health", (_req, res) => {
  return res.status(200).json({
    status: "ok"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/problems", problemsRoutes);
app.use("/api/submissions", submissionsRoutes);
app.use("/api/admin/problems", adminProblemsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);