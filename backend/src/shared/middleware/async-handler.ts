import type { NextFunction, Request, Response } from "express";

type AsyncOrSyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => unknown | Promise<unknown>;

export function asyncHandler(fn: AsyncOrSyncHandler) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve()
      .then(() => fn(req, res, next))
      .catch(next);
  };
}