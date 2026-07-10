type DbUser = {
    id: string;
    name: string;
    username: string;
    email: string;
    avatarUrl: string;
    degree: string;
    githubUrl: string;
    linkedinUrl: string;
    role: "user" | "admin";
    createdAt: Date;
};
export declare function toAuthUser(user: DbUser): {
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
export {};
//# sourceMappingURL=auth.mapper.d.ts.map