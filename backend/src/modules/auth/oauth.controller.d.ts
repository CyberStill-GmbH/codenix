import type { Request, Response } from "express";
export declare const oauthController: {
    redirectGoogle: (_req: Request, res: Response) => void;
    redirectGitHub: (_req: Request, res: Response) => void;
    callbackGoogle: (_req: Request, res: Response) => Promise<void>;
    callbackGitHub: (_req: Request, res: Response) => Promise<void>;
};
//# sourceMappingURL=oauth.controller.d.ts.map