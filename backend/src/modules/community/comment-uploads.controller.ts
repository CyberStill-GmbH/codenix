import type { Request, Response } from "express";
import { commentUploadsService } from "./comment-uploads.service";

export const commentUploadsController = {
  async upload(req: Request, res: Response) {
    const result = await commentUploadsService.upload(String(req.params.problemId), req.file);
    return res.status(201).json(result);
  },
};
