export const SUPPORTED_JUDGE_LANGUAGES = [
    "python",
    "javascript",
    "typescript",
    "c",
    "rust"
];
const supportedLanguageSet = new Set(SUPPORTED_JUDGE_LANGUAGES);
export function isSupportedJudgeLanguage(language) {
    return supportedLanguageSet.has(language);
}
//# sourceMappingURL=supported-languages.js.map