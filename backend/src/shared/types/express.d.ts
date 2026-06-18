import type { Role } from "../../generated/prisma/client";

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
      user?: {
        id: string;
        email: string;
        role: "user" | "admin";
      };
    }
  }
}

export {};
