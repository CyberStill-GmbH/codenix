import type { Request, Response } from "express";
export declare const problemController: {
    list(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    search(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    listTopics(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    findBySlug(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    runCode(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    submitCode(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=problems.controller.d.ts.map