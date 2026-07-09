import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { JudgeStatusBadge } from "@/features/coding/components/JudgeStatusBadge";
import {
  getProblemSubmissions,
  getSubmissionDetail,
} from "@/features/coding/services/codingApi";
import type {
  CodingTestcase,
  ProblemSubmission,
  TestcaseRunResult,
} from "@/features/coding/types/coding.types";
import type {
  Problem,
  ProblemCodeLanguage,
} from "@/features/problems/types/problem.types";
import { ProblemMarkdownRenderer } from "@/features/problems/components/ProblemMarkdownRenderer";

type ProblemContentTabsProps = {
  problem: Problem;
  testcases?: CodingTestcase[];
  runResults?: TestcaseRunResult[];
  submissionsRefreshKey?: number;
  onTestcasesChange?: (testcases: CodingTestcase[]) => void;
  onLoadSubmissionCode: (payload: {
    code: string;
    language: ProblemCodeLanguage;
    submissionId: string;
  }) => void;
};

type ContentTab = "description" | "submissions";

const tabItems = [
  { id: "description", label: "Descripcion" },
  { id: "submissions", label: "Mis Submissions" },
] satisfies Array<{ id: ContentTab; label: string }>;

const difficultyClassName = {
  Easy: "badge badge--easy",
  Medium: "badge badge--medium",
  Hard: "badge badge--hard",
};

function relativeDate(dateValue: string) {
  const timestamp = new Date(dateValue).getTime();
  const diffMs = Date.now() - timestamp;
  const diffMinutes = Math.max(1, Math.round(diffMs / 60000));

  if (diffMinutes < 60) return `hace ${diffMinutes}m`;

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `hace ${diffHours}h`;

  return `hace ${Math.round(diffHours / 24)}d`;
}

function normalizeLanguage(language: string): ProblemCodeLanguage | null {
  const normalized = language.toLowerCase();
  if (
    ["typescript", "javascript", "python", "c", "rust"].includes(normalized)
  ) {
    return normalized as ProblemCodeLanguage;
  }
  return null;
}

function SkeletonRows() {
  return (
    <div className="space-y-3">
      {[0, 1, 2].map((item) => (
        <div
          key={item}
          className="h-16 animate-pulse rounded-xl border border-slate-800 bg-slate-900/55"
        />
      ))}
    </div>
  );
}

function EmptyPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 text-sm font-semibold text-[var(--color-text-muted)]">
      {children}
    </div>
  );
}

export function ProblemContentTabs({
  problem,
  submissionsRefreshKey,
  onLoadSubmissionCode,
}: ProblemContentTabsProps) {
  const [activeTab, setActiveTab] = useState<ContentTab>("description");
  const [loadedTabs, setLoadedTabs] = useState<Set<ContentTab>>(
    () => new Set(["description"]),
  );
  const [submissions, setSubmissions] = useState<ProblemSubmission[]>([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);
  const [loadingSubmissionId, setLoadingSubmissionId] = useState<string | null>(
    null,
  );
  const [submissionsError, setSubmissionsError] = useState("");

  useEffect(() => {
    if (!loadedTabs.has("submissions")) return;

    let isMounted = true;

    async function loadSubmissions() {
      try {
        setIsLoadingSubmissions(true);
        setSubmissionsError("");
        const response = await getProblemSubmissions(
          problem.apiId ?? problem.id,
        );
        if (isMounted) {
          setSubmissions(response.data);
        }
      } catch (error) {
        if (isMounted) {
          setSubmissionsError(
            error instanceof Error
              ? error.message
              : "No pudimos cargar tus submissions.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoadingSubmissions(false);
        }
      }
    }

    loadSubmissions();

    return () => {
      isMounted = false;
    };
  }, [loadedTabs, problem.apiId, problem.id, submissionsRefreshKey]);

  async function handleSubmissionClick(submission: ProblemSubmission) {
    try {
      setLoadingSubmissionId(submission.id);
      setSubmissionsError("");
      const detail = submission.sourceCode
        ? submission
        : await getSubmissionDetail(submission.id);

      if (!detail.sourceCode) {
        setSubmissionsError(
          "Esta submission no tiene codigo fuente disponible.",
        );
        return;
      }

      const language = normalizeLanguage(detail.language);
      if (!language) {
        setSubmissionsError(
          "El lenguaje de esta submission no esta soportado por el editor.",
        );
        return;
      }

      onLoadSubmissionCode({
        code: detail.sourceCode,
        language,
        submissionId: detail.id,
      });
    } catch (error) {
      setSubmissionsError(
        error instanceof Error
          ? error.message
          : "No pudimos cargar el detalle de la submission.",
      );
    } finally {
      setLoadingSubmissionId(null);
    }
  }

  return (
    <aside className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-slate-700/50 bg-slate-950/60 shadow-[0_18px_50px_rgba(2,8,23,0.22)]">
      <div className="shrink-0 border-b border-slate-800/80 p-4">
        <Link
          to="/problems"
          className="inline-flex items-center gap-2 rounded-full text-sm font-semibold text-[var(--color-text-muted)] transition hover:text-[var(--color-text)]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to problems
        </Link>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <h1 className="font-display text-3xl font-bold text-[var(--color-text)]">
            {problem.title}
          </h1>
          <span className={difficultyClassName[problem.difficulty]}>
            {problem.difficulty}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {problem.topics.map((topic) => (
            <span
              key={topic}
              className="rounded-full border border-slate-700/60 bg-slate-900/70 px-2 py-1 text-xs font-medium text-[var(--color-text-muted)]"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>

      <div className="flex shrink-0 gap-1 border-b border-slate-800/80 bg-slate-950/70 px-2 py-2">
        {tabItems.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setActiveTab(tab.id);
              setLoadedTabs((current) => new Set(current).add(tab.id));
            }}
            className={`min-h-9 rounded-lg px-3 text-sm font-bold transition ${
              activeTab === tab.id
                ? "bg-sky-400/12 text-white"
                : "text-[var(--color-text-muted)] hover:bg-slate-900 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-4">
        {activeTab === "description" && (
          <section className="space-y-4 text-sm text-[var(--color-text-soft)]">
            {problem.statement ? (
              <ProblemMarkdownRenderer markdown={problem.statement} />
            ) : (
              <p>
                Solve this challenge using the editor. The MVP uses local
                problem content here, ready to be replaced by the problem
                statement API.
              </p>
            )}
            {problem.inputFormat && (
              <div className="rounded-xl border border-slate-800 bg-slate-900/55 p-4">
                <h2 className="text-base font-bold text-[var(--color-text)]">
                  Input format
                </h2>
                <p className="mt-2 whitespace-pre-wrap text-xs text-[var(--color-text-muted)]">
                  {problem.inputFormat}
                </p>
              </div>
            )}
            {problem.outputFormat && (
              <div className="rounded-xl border border-slate-800 bg-slate-900/55 p-4">
                <h2 className="text-base font-bold text-[var(--color-text)]">
                  Output format
                </h2>
                <p className="mt-2 whitespace-pre-wrap text-xs text-[var(--color-text-muted)]">
                  {problem.outputFormat}
                </p>
              </div>
            )}
            {problem.examples.map((example, index) => (
              <div
                key={example.id}
                className="rounded-xl border border-slate-800 bg-slate-900/55 p-4"
              >
                <h2 className="text-base font-bold text-[var(--color-text)]">
                  Example {index + 1}
                </h2>
                <pre className="mt-3 whitespace-pre-wrap font-mono text-xs text-[var(--color-text-muted)]">
                  input: {example.input}
                  {"\n"}output: {example.output}
                </pre>
                {example.explanation && (
                  <p className="mt-3 text-xs text-[var(--color-text-subtle)]">
                    {example.explanation}
                  </p>
                )}
              </div>
            ))}
            {problem.constraints && (
              <div className="rounded-xl border border-slate-800 bg-slate-900/55 p-4">
                <h2 className="text-base font-bold text-[var(--color-text)]">
                  Constraints
                </h2>
                <p className="mt-2 whitespace-pre-wrap text-xs text-[var(--color-text-muted)]">
                  {problem.constraints}
                </p>
              </div>
            )}
          </section>
        )}

        {activeTab === "submissions" && (
          <section className="space-y-3">
            {isLoadingSubmissions && <SkeletonRows />}
            {submissionsError && !isLoadingSubmissions && (
              <EmptyPanel>{submissionsError}</EmptyPanel>
            )}
            {!isLoadingSubmissions &&
              !submissionsError &&
              submissions.length === 0 && (
                <EmptyPanel>
                  Aun no tienes submissions para este problema.
                </EmptyPanel>
              )}
            {!isLoadingSubmissions &&
              !submissionsError &&
              submissions.map((submission) => (
                <button
                  key={submission.id}
                  type="button"
                  disabled={loadingSubmissionId === submission.id}
                  onClick={() => handleSubmissionClick(submission)}
                  className="grid w-full gap-3 rounded-xl border border-slate-800 bg-slate-950/55 p-3 text-left transition hover:border-slate-700 disabled:cursor-not-allowed disabled:opacity-75"
                >
                  <div className="flex items-center justify-between gap-3">
                    <JudgeStatusBadge status={submission.result} />
                    <span className="text-xs font-semibold text-[var(--color-text-subtle)]">
                      {relativeDate(submission.submittedAt)}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs text-[var(--color-text-muted)]">
                    <span>{submission.language}</span>
                    <span>{submission.executionTimeMs ?? "-"} ms</span>
                    <span>
                      {submission.memoryKb
                        ? `${(submission.memoryKb / 1024).toFixed(1)} MB`
                        : "-"}
                    </span>
                  </div>
                  {loadingSubmissionId === submission.id && (
                    <p className="text-xs text-[var(--color-text-subtle)]">
                      Cargando codigo de la submission...
                    </p>
                  )}
                </button>
              ))}
          </section>
        )}
      </div>
    </aside>
  );
}
