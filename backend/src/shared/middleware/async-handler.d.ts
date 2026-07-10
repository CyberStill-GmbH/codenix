import type { NextFunction, Request, Response } from "express";
type AsyncOrSyncHandler = (req: Request, res: Response, next: NextFunction) => unknown | Promise<unknown>;
export declare function asyncHandler(fn: AsyncOrSyncHandler): (req: Request, res: Response, next: NextFunction) => void;
export {};
//# sourceMappingURL=async-handler.d.ts.map