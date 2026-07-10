export type SolvedProblemCount = {
    userId: string;
    solvedProblems: number;
};
export declare const solvedProblemsService: {
    getSolvedProblemIds(userId: string, problemIds?: string[]): Promise<Set<string>>;
    getSolvedProblemCount(userId: string): Promise<number>;
    getSolvedProblemCountsByUser(): Promise<SolvedProblemCount[]>;
    getActiveUserIds(): Promise<string[]>;
};
//# sourceMappingURL=solved-problems.service.d.ts.map