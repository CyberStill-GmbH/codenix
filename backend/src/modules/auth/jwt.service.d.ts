export type VerifiedAccessToken = {
    userId: string;
    jwtId: string;
};
export declare function signAccessToken(userId: string): string;
export declare function verifyAccessToken(token: string): VerifiedAccessToken;
//# sourceMappingURL=jwt.service.d.ts.map