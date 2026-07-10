export declare const SUPPORTED_JUDGE_LANGUAGES: readonly ["python", "javascript", "typescript", "c", "rust"];
export type SupportedJudgeLanguage = (typeof SUPPORTED_JUDGE_LANGUAGES)[number];
export declare function isSupportedJudgeLanguage(language: string): language is SupportedJudgeLanguage;
//# sourceMappingURL=supported-languages.d.ts.map