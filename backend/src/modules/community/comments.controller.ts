import type { Request, Response } from "express";
import { commentsService } from "./comments.service";

function userId(req: Request) {
  if (!req.user?.id) throw new Error("Authentication required");
  return req.user.id;
}

export const commentsController = {
  async list(req: Request, res: Response) {
    const result = await commentsService.list(
      String(req.params.problemId),
      req.user?.id,
      res.locals.validatedQuery
    );
    return res.json(result);
  },
  async create(req: Request, res: Response) {
    const result = await commentsService.create(String(req.params.problemId), userId(req), req.body.content, req.body.parentId);
    return res.status(201).json(result);
  },
  async vote(req: Request, res: Response) {
    const result = await commentsService.vote(String(req.params.commentId), userId(req), req.body.vote);
    return res.json(result);
  },
  async profile(req: Request, res: Response) {
    const result = await commentsService.getPublicProfile(String(req.params.userId), req.user?.id);
    return res.json(result);
  },
};
