import type { Request, Response } from "express";
export declare const adminProblemsController: {
    list(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    findByIdentifier(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    create(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    update(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    publish(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    unpublish(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    listTestcases(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    createTestcase(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    updateTestcase(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteTestcase(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=admin-problems.controller.d.ts.map