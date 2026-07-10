import type { ActivityQueryInput } from "./users.schema";
export declare const usersService: {
    getStats(userId: string): Promise<{
        totalSubmissions: number;
        acceptedSubmissions: number;
        attemptedProblems: number;
        solvedProblems: number;
        acceptanceRate: number;
        currentStreak: number;
        rank: number;
        percentile: number;
        totalUsers: number;
        distribution: {
            bucket: string;
            count: number;
        }[];
    }>;
    getProgress(userId: string): Promise<{
        data: {
            difficulty: "easy" | "medium" | "hard";
            solved: number;
            total: number;
        }[];
        totals: {
            solved: number;
            total: number;
        };
    }>;
    getActivity(userId: string, query: ActivityQueryInput): Promise<{
        year: number;
        data: {
            date: string;
            count: number;
            accepted: number;
        }[];
    }>;
};
//# sourceMappingURL=users.service.d.ts.map