import type { NextFunction, Request, Response } from "express";

export function noStoreMiddleware(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Vary", "Authorization");

  next();
}
