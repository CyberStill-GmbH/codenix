import type { ErrorRequestHandler } from "express";
import { env } from "../../config/env";
import { AppError } from "./app-error";

function isAppError(error: unknown): error is AppError {
  return (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    "code" in error &&
    "message" in error &&
    typeof (error as { statusCode?: unknown }).statusCode === "number" &&
    typeof (error as { code?: unknown }).code === "string" &&
    typeof (error as { message?: unknown }).message === "string"
  );
}

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  if (isAppError(err)) {
    return res.status(err.statusCode).json({
      code: err.code,
      message: err.message,
      ...(err.details ? { details: err.details } : {})
    });
  }

  const debugError = {
    requestId: req.requestId,
    name: err instanceof Error ? err.name : "UnknownError",
    message: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error ? err.stack : undefined
  };

  console.error(debugError);

  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({
      code: "INVALID_JSON",
      message: "Request body contains invalid JSON."
    });
  }

  return res.status(500).json({
    code: "INTERNAL_SERVER_ERROR",
    message: "Something went wrong.",
    ...(env.NODE_ENV !== "production" ? { debug: debugError } : {})
  });
};
