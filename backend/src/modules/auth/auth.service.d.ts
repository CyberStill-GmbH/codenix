import type { LoginInput, RegisterInput } from "./auth.schema";
export declare const authService: {
    register(input: RegisterInput): Promise<{
        accessToken: string;
        user: {
            id: string;
            name: string;
            username: string;
            email: string;
            avatarUrl: string;
            degree: string;
            githubUrl: string;
            linkedinUrl: string;
            memberSince: string;
            role: "user" | "admin";
        };
    }>;
    login(input: LoginInput): Promise<{
        accessToken: string;
        user: {
            id: string;
            name: string;
            username: string;
            email: string;
            avatarUrl: string;
            degree: string;
            githubUrl: string;
            linkedinUrl: string;
            memberSince: string;
            role: "user" | "admin";
        };
    }>;
    me(userId: string): Promise<{
        id: string;
        name: string;
        username: string;
        email: string;
        avatarUrl: string;
        degree: string;
        githubUrl: string;
        linkedinUrl: string;
        memberSince: string;
        role: "user" | "admin";
    }>;
};
//# sourceMappingURL=auth.service.d.ts.map