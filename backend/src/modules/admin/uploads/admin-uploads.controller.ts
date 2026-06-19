import type { Request, Response } from "express";
import { adminUploadsService } from "./admin-uploads.service";

export const adminUploadsController = {
  async uploadImage(req: Request, res: Response) {
    const response = await adminUploadsService.uploadImage(req.file);

    return res.status(201).json(response);
  }
};