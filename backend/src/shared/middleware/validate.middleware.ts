import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";
import { AppError } from "../errors/app-error";

type ValidationTarget = {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
};

export function validate(schemas: ValidationTarget) {
  return (req: Request, res: Response, next: NextFunction) => {
    const bodyResult = schemas.body?.safeParse(req.body);
    const queryResult = schemas.query?.safeParse(req.query);
    const paramsResult = schemas.params?.safeParse(req.params);

    const failedResult = [bodyResult, queryResult, paramsResult].find(
      (result) => result && !result.success
    );

    if (failedResult && !failedResult.success) {
      throw new AppError(422, "VALIDATION_ERROR", "Invalid request data.", {
        issues: failedResult.error.issues
      });
    }

    if (bodyResult?.success) {
      req.body = bodyResult.data;
      res.locals.validatedBody = bodyResult.data;
    }

    if (queryResult?.success) {
      res.locals.validatedQuery = queryResult.data;
    }

    if (paramsResult?.success) {
      res.locals.validatedParams = paramsResult.data;
    }

    next();
  };
}