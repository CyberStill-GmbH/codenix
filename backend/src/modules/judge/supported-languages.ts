export const SUPPORTED_JUDGE_LANGUAGES = [
  "python",
  "javascript",
  "typescript",
  "c",
  "rust"
] as const;

export type SupportedJudgeLanguage =
  (typeof SUPPORTED_JUDGE_LANGUAGES)[number];

const supportedLanguageSet = new Set<string>(SUPPORTED_JUDGE_LANGUAGES);

export function isSupportedJudgeLanguage(
  language: string
): language is SupportedJudgeLanguage {
  return supportedLanguageSet.has(language);
}
