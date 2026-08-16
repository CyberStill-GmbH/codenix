import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, BadgeCheck, ChevronDown, FileText, ListChecks, Tags } from "lucide-react";

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
  { id: "description", label: "Descripción" },
  { id: "submissions", label: "Mis envíos" },
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
          className="h-16 animate-pulse rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-surface-soft)]"
        />
      ))}
    </div>
  );
}

function EmptyPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-surface)] p-4 text-sm font-semibold text-[var(--color-text-muted)]">
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
  const [topicsOpen, setTopicsOpen] = useState(false);

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
              : "No pudimos cargar tus envíos.",
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
          "Este envío no tiene código fuente disponible.",
        );
        return;
      }

      const language = normalizeLanguage(detail.language);
      if (!language) {
        setSubmissionsError(
          "El lenguaje de este envío no está soportado por el editor.",
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
          : "No pudimos cargar el detalle del envío.",
      );
    } finally {
      setLoadingSubmissionId(null);
    }
  }

  return (
    <aside className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-lg)]">
      <div className="sticky top-0 z-10 shrink-0 border-b border-[var(--color-border-soft)] bg-[var(--color-surface)] px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <Link
            to="/problems"
            title="Volver a problemas"
            aria-label="Volver a problemas"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[var(--color-text-muted)] transition hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </Link>
          <div className="flex min-w-0 items-center gap-1 rounded-lg bg-[var(--color-bg-soft)] p-1">
            {tabItems.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setLoadedTabs((current) => new Set(current).add(tab.id));
                }}
                className={`inline-flex min-h-8 items-center gap-1.5 rounded-md px-3 text-xs font-bold transition ${
                  activeTab === tab.id
                    ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                }`}
              >
                {tab.id === 'description' ? <FileText className="h-3.5 w-3.5" aria-hidden="true" /> : <ListChecks className="h-3.5 w-3.5" aria-hidden="true" />}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-4">
        <div className="mb-6 border-b border-[var(--color-border-soft)] px-1 pb-5">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-3xl font-bold text-[var(--color-text)]">
              {problem.title}
            </h1>
            <span className={difficultyClassName[problem.difficulty]}>
              {problem.difficulty}
            </span>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="relative">
              <button
                type="button"
                onClick={() => setTopicsOpen((current) => !current)}
                className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-3 text-xs font-semibold text-[var(--color-text-soft)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                aria-expanded={topicsOpen}
                aria-haspopup="menu"
              >
                <Tags className="h-3.5 w-3.5 text-[var(--color-primary)]" aria-hidden="true" />
                Temas
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${topicsOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>
              {topicsOpen && (
                <div className="absolute left-0 top-11 z-20 min-w-48 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-2 shadow-[var(--shadow-xl)]" role="menu">
                  {problem.topics.map((topic) => (
                    <span key={topic} className="block rounded-lg px-3 py-2 text-xs font-medium text-[var(--color-text-soft)]" role="menuitem">
                      {topic}
                    </span>
                  ))}
                  <span className="mt-1 block border-t border-[var(--color-border-soft)] px-3 pt-2 text-[0.6875rem] font-semibold text-[var(--color-text-subtle)]">
                    Discusión próximamente
                  </span>
                </div>
              )}
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-subtle)]">
              <BadgeCheck className="h-3.5 w-3.5 text-[var(--color-success)]" aria-hidden="true" />
              {problem.solved ? 'Accepted' : 'Sin resolver'}
            </span>
            <span className="text-xs font-semibold text-[var(--color-text-muted)]">
              Acceptance Rate <strong className="text-[var(--color-text-soft)]">{problem.acceptance.toFixed(1)}%</strong>
            </span>
          </div>
        </div>
        {activeTab === "description" && (
          <section className="space-y-4 text-sm text-[var(--color-text-soft)]">
            {problem.statement ? (
              <ProblemMarkdownRenderer markdown={problem.statement} />
            ) : (
              <p>
                Resuelve este reto usando el editor. Aquí se muestra el
                contenido disponible del problema.
              </p>
            )}
            {problem.examples.map((example, index) => (
              <div
                key={example.id}
                className="rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-surface-soft)] p-4"
              >
                <h2 className="text-base font-bold text-[var(--color-text)]">
                  Ejemplo {index + 1}
                </h2>
                <pre className="problem-example-code mt-3 whitespace-pre-wrap rounded-md border-l-2 border-[var(--color-border-strong)] bg-[var(--color-bg-muted)] p-3 font-mono text-xs text-[var(--color-text-soft)]">
                  entrada: {example.input}
                  {"\n"}salida: {example.output}
                </pre>
                {example.explanation && (
                  <p className="mt-3 text-xs text-[var(--color-text-subtle)]">
                    {example.explanation}
                  </p>
                )}
              </div>
            ))}
            {problem.constraints && (
              <div className="rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-surface-soft)] p-4">
                <h2 className="text-base font-bold text-[var(--color-text)]">
                  Restricciones
                </h2>
                <p className="mt-2 whitespace-pre-wrap text-xs text-[var(--color-text-muted)]">
                  {problem.constraints}
                </p>
              </div>
            )}
            {(problem.inputFormat || problem.outputFormat) && (
              <details className="group rounded-lg border border-[var(--color-border-soft)] bg-[var(--color-bg-muted)] px-3 py-2">
                <summary className="cursor-pointer list-none text-xs font-semibold text-[var(--color-text-muted)] marker:hidden">
                  Formatos de entrada y salida
                </summary>
                <div className="mt-3 space-y-3 border-t border-[var(--color-border-soft)] pt-3">
                  {problem.inputFormat && (
                    <div>
                      <h2 className="text-[0.6875rem] font-bold uppercase tracking-wider text-[var(--color-text-subtle)]">Entrada</h2>
                      <p className="mt-1 whitespace-pre-wrap text-xs leading-relaxed text-[var(--color-text-muted)]">{problem.inputFormat}</p>
                    </div>
                  )}
                  {problem.outputFormat && (
                    <div>
                      <h2 className="text-[0.6875rem] font-bold uppercase tracking-wider text-[var(--color-text-subtle)]">Salida</h2>
                      <p className="mt-1 whitespace-pre-wrap text-xs leading-relaxed text-[var(--color-text-muted)]">{problem.outputFormat}</p>
                    </div>
                  )}
                </div>
              </details>
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
                  Aún no tienes envíos para este problema.
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
                  className="grid w-full gap-3 rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-surface)] p-3 text-left transition hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-elevated)] disabled:cursor-not-allowed disabled:opacity-75"
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
                      Cargando código del envío...
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
