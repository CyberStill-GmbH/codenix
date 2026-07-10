import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";
type ValidationTarget = {
    body?: ZodSchema;
    query?: ZodSchema;
    params?: ZodSchema;
};
export declare function validate(schemas: ValidationTarget): (req: Request, res: Response, next: NextFunction) => void;
export {};
//# sourceMappingURL=validate.middleware.d.ts.map