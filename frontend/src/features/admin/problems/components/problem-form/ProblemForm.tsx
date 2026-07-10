import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type DragEvent,
  type ReactNode,
} from "react";
import MDEditor from "@uiw/react-md-editor";
import {
  Bold,
  CheckCircle2,
  Circle,
  Code2,
  Eye,
  FileText,
  Heading2,
  ImagePlus,
  Italic,
  LinkIcon,
  List,
  ListOrdered,
  Minus,
  PanelLeftClose,
  PanelLeftOpen,
  Pilcrow,
  Play,
  Quote,
  Save,
  Send,
  Sigma,
  Table2,
  Workflow,
  X,
} from "lucide-react";

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

import type {
  AdminProblemFormValues,
  ProblemDifficulty,
  ProblemLanguage,
  ProblemStatus,
} from "@/features/admin/problems/types/problem.types";
import { ProblemDescription } from "@/features/admin/problems/components/ProblemDescription";
import { TagInput } from "@/features/admin/problems/components/problem-form/components/TagInput";
import {
  availableLanguages,
  markdownPlaceholder,
  type ProblemFormErrors,
  validateProblemForm,
} from "@/features/admin/problems/components/problem-form/utils/problemSchema";
import { slugify } from "@/features/admin/problems/components/problem-form/utils/slugify";
import { useProblemForm } from "@/features/admin/problems/components/problem-form/hooks/useProblemForm";
import { uploadAdminProblemImage } from "@/features/admin/problems/services/adminUploads.service";
import { toBackendProblemPayload } from "@/features/admin/problems/utils/problemPayload";
import { TestcasesSection } from "@/features/admin/problems/components/problem-form/sections/TestcasesSection";
import { StarterCodeSection } from "@/features/admin/problems/components/problem-form/sections/StarterCodeSection";

type ProblemFormProps = {
  initialValues: AdminProblemFormValues;
  mode: "create" | "edit";
  isSaving: boolean;
  tagSuggestions: string[];
  onSubmit: (values: AdminProblemFormValues) => Promise<void>;
  onCancel: () => void;
};

type InsertSnippetOptions = {
  prefix?: string;
  suffix?: string;
  placeholder?: string;
  block?: string;
};

const autosaveDelayMs = 7000;

type FormTab = "statement" | "testcases" | "starterCode";

const difficultyOptions: Array<{ value: ProblemDifficulty; label: string }> = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

function syncLegacyStatementFields(
  values: AdminProblemFormValues,
): AdminProblemFormValues {
  return {
    ...values,
    statement: values.descriptionMarkdown,
    constraints: values.constraintsList.join("\n"),
  };
}

export function ProblemForm({
  initialValues,
  mode,
  isSaving,
  tagSuggestions,
  onSubmit,
  onCancel,
}: ProblemFormProps) {
  const { values, updateField, publishErrors, hasUnsavedChanges } =
    useProblemForm(initialValues);
  const [submitErrors, setSubmitErrors] = useState<string[]>([]);
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [lastAutosavedAt, setLastAutosavedAt] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [activeTab, setActiveTab] = useState<FormTab>("statement");
  const editorRef = useRef<HTMLTextAreaElement | null>(null);

  const hasSampleTestcase = values.testcases.some((tc) => tc.isSample);
  const hasHiddenTestcase = values.testcases.some((tc) => !tc.isSample);
  const testcasesComplete = hasSampleTestcase && hasHiddenTestcase;
  const starterCodeComplete = values.supportedLanguages.length > 0 &&
    values.supportedLanguages.every(
      (lang) => (values.starterCode[lang] ?? "").trim().length > 0,
    );
  const statementComplete = values.descriptionMarkdown.trim().length > 0;

  const errorSummary = useMemo(
    () => Object.values(publishErrors).filter(Boolean) as string[],
    [publishErrors],
  );

  useEffect(() => {
    function handleBeforeUnload(event: BeforeUnloadEvent) {
      if (!hasUnsavedChanges) return;
      event.preventDefault();
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const timeoutId = window.setTimeout(() => {
      window.localStorage.setItem(
        "codenix_admin_problem_autosave",
        JSON.stringify(syncLegacyStatementFields(values)),
      );
      setLastAutosavedAt(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    }, autosaveDelayMs);

    return () => window.clearTimeout(timeoutId);
  }, [hasUnsavedChanges, values]);

  function setStatement(markdown: string) {
    updateField("descriptionMarkdown", markdown);
    updateField("statement", markdown);
  }

  function insertSnippet(options: InsertSnippetOptions) {
    const textarea = editorRef.current;
    const currentValue = values.descriptionMarkdown;

    if (options.block) {
      const separator =
        currentValue.endsWith("\n") || currentValue.length === 0 ? "" : "\n\n";
      setStatement(`${currentValue}${separator}${options.block}`);
      return;
    }

    const start = textarea?.selectionStart ?? currentValue.length;
    const end = textarea?.selectionEnd ?? currentValue.length;
    const selectedText =
      currentValue.slice(start, end) || options.placeholder || "";
    const nextValue = `${currentValue.slice(0, start)}${options.prefix ?? ""}${selectedText}${options.suffix ?? ""}${currentValue.slice(end)}`;
    setStatement(nextValue);

    window.requestAnimationFrame(() => {
      textarea?.focus();
      const cursor =
        start + (options.prefix?.length ?? 0) + selectedText.length;
      textarea?.setSelectionRange(cursor, cursor);
    });
  }

  async function insertImage(file: File) {
    try {
      setUploadError("");
      const { url } = await uploadAdminProblemImage(file);
      insertSnippet({ block: `![${file.name}](${url})` });
    } catch {
      setUploadError(
        "No pudimos subir la imagen. Intenta con PNG, JPG, WebP o GIF.",
      );
    }
  }

  async function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) await insertImage(file);
  }

  async function handlePaste(event: ClipboardEvent<HTMLDivElement>) {
    const image = Array.from(event.clipboardData.files).find((file) =>
      file.type.startsWith("image/"),
    );
    if (!image) return;

    event.preventDefault();
    await insertImage(image);
  }

  async function handleDrop(event: DragEvent<HTMLDivElement>) {
    const image = Array.from(event.dataTransfer.files).find((file) =>
      file.type.startsWith("image/"),
    );
    if (!image) return;

    event.preventDefault();
    await insertImage(image);
  }

  async function saveDraft() {
    const draftValues = syncLegacyStatementFields({
      ...values,
      status: "draft",
    });
    const criticalErrors = validateProblemForm(draftValues, false);
    if (Object.keys(criticalErrors).length > 0) {
      setSubmitErrors(
        Object.values(criticalErrors).filter(Boolean) as string[],
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    window.localStorage.setItem(
      "codenix_admin_problem_draft",
      JSON.stringify(draftValues),
    );
    await onSubmit(draftValues);
  }

  async function publish() {
    const publishedValues = syncLegacyStatementFields({
      ...values,
      status: "published",
    });
    const nextErrors = validateProblemForm(publishedValues, true);
    const nextErrorSummary = Object.values(nextErrors).filter(
      Boolean,
    ) as string[];

    if (nextErrorSummary.length > 0) {
      setSubmitErrors(nextErrorSummary);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    window.localStorage.setItem(
      "codenix_admin_problem_last_payload",
      JSON.stringify(toBackendProblemPayload(publishedValues), null, 2),
    );
    await onSubmit(publishedValues);
  }

  return (
    <div className="space-y-4">
      <div className="sticky top-16 z-30 rounded-xl border border-slate-700/50 bg-slate-950/90 p-3 shadow-[0_18px_50px_rgba(2,8,23,0.34)] backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-[var(--color-text)]">
              {mode === "create" ? "Nuevo problema" : "Editar problema"}
              {hasUnsavedChanges && (
                <span className="ml-2 inline-flex items-center gap-1 text-xs text-[var(--color-warning)]">
                  <span className="h-2 w-2 rounded-full bg-[var(--color-warning)]" />
                  Cambios sin guardar
                </span>
              )}
            </p>
            <p className="mt-1 text-xs text-[var(--color-text-subtle)]">
              {lastAutosavedAt
                ? `Autosave ${lastAutosavedAt}`
                : "Autosave activo"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 sm:flex">
              <CompletionBadge label="Enunciado" complete={statementComplete} />
              <CompletionBadge label="Testcases" complete={testcasesComplete} />
              <CompletionBadge label="Starter Code" complete={starterCodeComplete} />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onCancel}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-700/60 px-4 text-sm font-bold text-[var(--color-text-soft)]"
              >
                <X className="h-4 w-4" />
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => setIsPreviewVisible((current) => !current)}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-700/60 px-4 text-sm font-bold text-[var(--color-text-soft)]"
              >
                <Eye className="h-4 w-4" />
                Preview
              </button>
              <button
                type="button"
                disabled={isSaving}
                onClick={saveDraft}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900/70 px-4 text-sm font-bold text-[var(--color-text-soft)] disabled:opacity-60"
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Guardando..." : "Guardar"}
              </button>
              <button
                type="button"
                disabled={isSaving || errorSummary.length > 0}
                onClick={publish}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-[var(--color-success-soft)] px-4 text-sm font-bold text-[var(--color-success)] disabled:opacity-60"
              >
                <Send className="h-4 w-4" />
                {isSaving ? "Publicando..." : "Publicar"}
              </button>
            </div>
          </div>
        </div>

        {(submitErrors.length > 0 || uploadError) && (
          <div className="mt-3 rounded-lg border border-[var(--color-error)]/30 bg-[var(--color-error-soft)] p-3 text-sm font-semibold text-[var(--color-error)]">
            {uploadError && <p>{uploadError}</p>}
            {submitErrors.map((error) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        )}
      </div>

      <div className="grid min-h-[calc(100vh-220px)] gap-4 xl:grid-cols-[minmax(280px,340px)_1fr]">
        {isSidebarOpen && (
          <MetadataSidebar
            values={values}
            errors={publishErrors}
            tagSuggestions={tagSuggestions}
            onChange={updateField}
          />
        )}

        <div className="min-w-0 space-y-4">
          <nav className="flex gap-1 rounded-xl border border-slate-700/50 bg-slate-950/70 p-1.5 shadow-[0_18px_50px_rgba(2,8,23,0.18)]">
            <FormTabButton
              active={activeTab === "statement"}
              onClick={() => setActiveTab("statement")}
              icon={<FileText className="h-4 w-4" />}
              label="Enunciado"
              complete={statementComplete}
            />
            <FormTabButton
              active={activeTab === "testcases"}
              onClick={() => setActiveTab("testcases")}
              icon={<Play className="h-4 w-4" />}
              label="Testcases"
              complete={testcasesComplete}
              count={values.testcases.length}
            />
            <FormTabButton
              active={activeTab === "starterCode"}
              onClick={() => setActiveTab("starterCode")}
              icon={<Code2 className="h-4 w-4" />}
              label="Starter Code"
              complete={starterCodeComplete}
            />
          </nav>

          {activeTab === "statement" && (
            <section className="min-w-0 overflow-hidden rounded-xl border border-slate-700/50 bg-slate-950/60 shadow-[0_18px_50px_rgba(2,8,23,0.22)]">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 p-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsSidebarOpen((current) => !current)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700/60 text-[var(--color-text-muted)] hover:text-white"
                    aria-label={
                      isSidebarOpen ? "Ocultar metadata" : "Mostrar metadata"
                    }
                  >
                    {isSidebarOpen ? (
                      <PanelLeftClose className="h-4 w-4" />
                    ) : (
                      <PanelLeftOpen className="h-4 w-4" />
                    )}
                  </button>
                  <p className="text-sm font-bold text-[var(--color-text)]">
                    Statement Markdown
                  </p>
                </div>
                <EditorToolbar
                  insertSnippet={insertSnippet}
                  onImageChange={handleImageChange}
                />
              </div>

              <div
                className={`grid min-h-[680px] ${isPreviewVisible ? "lg:grid-cols-2" : "grid-cols-1"}`}
                data-color-mode="dark"
                onPaste={handlePaste}
                onDrop={handleDrop}
                onDragOver={(event) => event.preventDefault()}
              >
                <div className="min-w-0 border-b border-slate-800 lg:border-b-0 lg:border-r">
                  <MDEditor
                    value={values.descriptionMarkdown}
                    onChange={(nextValue, event) => {
                      editorRef.current = event?.currentTarget ?? editorRef.current;
                      setStatement(nextValue ?? "");
                    }}
                    preview="edit"
                    height={680}
                    textareaProps={{
                      placeholder: markdownPlaceholder,
                      "aria-label": "Problem statement Markdown",
                    }}
                  />
                </div>

                {isPreviewVisible && (
                  <div className="min-h-[680px] min-w-0 overflow-auto bg-slate-950/45 p-5">
                    <ProblemDescription
                      markdown={values.descriptionMarkdown || markdownPlaceholder}
                    />
                  </div>
                )}
              </div>
            </section>
          )}

          {activeTab === "testcases" && (
            <TestcasesSection
              parameters={values.parameters}
              outputType={values.outputType}
              testcases={values.testcases}
              error={publishErrors.testcases}
              onParametersChange={(parameters) => updateField("parameters", parameters)}
              onOutputTypeChange={(outputType) => updateField("outputType", outputType)}
              onTestcasesChange={(testcases) => updateField("testcases", testcases)}
            />
          )}

          {activeTab === "starterCode" && (
            <StarterCodeSection
              supportedLanguages={values.supportedLanguages}
              starterCode={values.starterCode}
              onChange={(starterCode) => updateField("starterCode", starterCode)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

type FormTabButtonProps = {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
  complete: boolean;
  count?: number;
};

function FormTabButton({
  active,
  onClick,
  icon,
  label,
  complete,
  count,
}: FormTabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-bold transition ${
        active
          ? "bg-slate-800 text-white shadow-sm"
          : "text-[var(--color-text-muted)] hover:bg-slate-900/60 hover:text-[var(--color-text-soft)]"
      }`}
    >
      {icon}
      {label}
      {count !== undefined && count > 0 && (
        <span className="rounded-full bg-slate-700/60 px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-[var(--color-text-subtle)]">
          {count}
        </span>
      )}
      {complete ? (
        <CheckCircle2 className="h-3.5 w-3.5 text-[var(--color-success)]" />
      ) : (
        <Circle className="h-3.5 w-3.5 text-slate-600" />
      )}
    </button>
  );
}

function CompletionBadge({
  label,
  complete,
}: {
  label: string;
  complete: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
        complete
          ? "bg-[var(--color-success-soft)] text-[var(--color-success)]"
          : "bg-slate-800/60 text-[var(--color-text-subtle)]"
      }`}
    >
      {complete ? (
        <CheckCircle2 className="h-3 w-3" />
      ) : (
        <Circle className="h-3 w-3" />
      )}
      {label}
    </span>
  );
}

type MetadataSidebarProps = {
  values: AdminProblemFormValues;
  errors: ProblemFormErrors;
  tagSuggestions: string[];
  onChange: <Key extends keyof AdminProblemFormValues>(
    field: Key,
    value: AdminProblemFormValues[Key],
  ) => void;
};

function MetadataSidebar({
  values,
  errors,
  tagSuggestions,
  onChange,
}: MetadataSidebarProps) {
  function toggleLanguage(language: ProblemLanguage) {
    const nextLanguages = values.supportedLanguages.includes(language)
      ? values.supportedLanguages.filter((current) => current !== language)
      : [...values.supportedLanguages, language];

    onChange("supportedLanguages", nextLanguages);
  }

  return (
    <aside className="h-fit rounded-xl border border-slate-700/50 bg-slate-950/70 p-4 shadow-[0_18px_50px_rgba(2,8,23,0.18)] xl:sticky xl:top-36">
      <div className="space-y-4">
        <TextField
          label="Problem Title"
          value={values.title}
          error={errors.title}
          maxLength={100}
          onChange={(value) => {
            onChange("title", value);
            onChange("slug", slugify(value));
          }}
          placeholder="Suma de Pares"
        />
        <TextField
          label="Slug"
          value={values.slug}
          error={errors.slug}
          onChange={(value) => onChange("slug", value)}
          placeholder="suma-de-pares"
          mono
        />

        <div className="grid gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">
            Difficulty
          </span>
          <div className="grid grid-cols-3 rounded-lg border border-slate-800 bg-slate-950/70 p-1">
            {difficultyOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange("difficulty", option.value)}
                className={`h-9 rounded-md text-xs font-bold transition ${
                  values.difficulty === option.value
                    ? "bg-slate-800 text-white"
                    : "text-[var(--color-text-muted)] hover:text-white"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">
            Tags
          </span>
          <TagInput
            value={values.tags}
            suggestions={tagSuggestions}
            onChange={(tags) => onChange("tags", tags)}
          />
          {errors.tags && <FieldError>{errors.tags}</FieldError>}
        </div>

        <StatusControl
          value={values.status}
          onChange={(status) => onChange("status", status)}
        />

        <NumberField
          label="Time Limit"
          suffix="ms"
          value={values.timeLimitMs}
          min={500}
          max={10000}
          step={100}
          error={errors.timeLimitMs}
          onChange={(value) => onChange("timeLimitMs", value)}
        />
        <NumberField
          label="Memory Limit"
          suffix="MB"
          value={values.memoryLimitMb}
          min={64}
          max={512}
          step={32}
          error={errors.memoryLimitMb}
          onChange={(value) => onChange("memoryLimitMb", value)}
        />

        <fieldset>
          <legend className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">
            Supported Languages
          </legend>
          <div className="mt-2 grid gap-2">
            {availableLanguages.map((language) => (
              <label
                key={language.value}
                className="flex min-h-9 items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/45 px-3 text-sm font-semibold text-[var(--color-text-soft)]"
              >
                <input
                  type="checkbox"
                  checked={values.supportedLanguages.includes(language.value)}
                  onChange={() => toggleLanguage(language.value)}
                />
                {language.label}
              </label>
            ))}
          </div>
          {errors.supportedLanguages && (
            <FieldError>{errors.supportedLanguages}</FieldError>
          )}
        </fieldset>

        <TextField
          label="Contest"
          value=""
          onChange={() => undefined}
          placeholder="Opcional"
          disabled
        />
        <NumberField
          label="Points"
          suffix="pts"
          value={0}
          min={0}
          max={1000}
          step={50}
          onChange={() => undefined}
          disabled
        />
      </div>
    </aside>
  );
}

function EditorToolbar({
  insertSnippet,
  onImageChange,
}: {
  insertSnippet: (options: InsertSnippetOptions) => void;
  onImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  const buttons = [
    {
      label: "Bold",
      Icon: Bold,
      action: () =>
        insertSnippet({ prefix: "**", suffix: "**", placeholder: "bold" }),
    },
    {
      label: "Italic",
      Icon: Italic,
      action: () =>
        insertSnippet({ prefix: "_", suffix: "_", placeholder: "italic" }),
    },
    {
      label: "Heading",
      Icon: Heading2,
      action: () => insertSnippet({ block: "## Heading" }),
    },
    {
      label: "Table",
      Icon: Table2,
      action: () =>
        insertSnippet({
          block: "| Column | Value |\n| --- | --- |\n| item | value |",
        }),
    },
    {
      label: "Code Block",
      Icon: Code2,
      action: () => insertSnippet({ block: "```typescript\n// code\n```" }),
    },
    {
      label: "Quote",
      Icon: Quote,
      action: () => insertSnippet({ block: "> Important note" }),
    },
    {
      label: "Ordered List",
      Icon: ListOrdered,
      action: () => insertSnippet({ block: "1. First item\n2. Second item" }),
    },
    {
      label: "Bullet List",
      Icon: List,
      action: () => insertSnippet({ block: "- First item\n- Second item" }),
    },
    {
      label: "Link",
      Icon: LinkIcon,
      action: () =>
        insertSnippet({
          prefix: "[",
          suffix: "](https://)",
          placeholder: "link text",
        }),
    },
    {
      label: "Horizontal Rule",
      Icon: Minus,
      action: () => insertSnippet({ block: "---" }),
    },
    {
      label: "Math",
      Icon: Sigma,
      action: () => insertSnippet({ block: "$$\nO(n)\n$$" }),
    },
    {
      label: "Mermaid",
      Icon: Workflow,
      action: () =>
        insertSnippet({ block: "```mermaid\ngraph LR\nA --> B\n```" }),
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1">
      {buttons.map(({ label, Icon, action }) => (
        <button
          key={label}
          type="button"
          onClick={action}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-text-muted)] transition hover:bg-slate-900 hover:text-white"
          aria-label={label}
          title={label}
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
      <label
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-text-muted)] transition hover:bg-slate-900 hover:text-white"
        title="Image"
      >
        <ImagePlus className="h-4 w-4" />
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
          onChange={onImageChange}
          className="absolute inset-0 cursor-pointer opacity-0"
          aria-label="Upload image"
        />
      </label>
      <Pilcrow
        className="ml-1 h-4 w-4 text-[var(--color-text-subtle)]"
        aria-hidden="true"
      />
    </div>
  );
}

function TextField({
  label,
  value,
  placeholder,
  error,
  mono = false,
  disabled = false,
  maxLength,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  error?: string;
  mono?: boolean;
  disabled?: boolean;
  maxLength?: number;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">
        {label}
      </span>
      <input
        value={value}
        disabled={disabled}
        maxLength={maxLength}
        onChange={(event) => onChange(event.target.value)}
        className={`h-10 rounded-lg border border-slate-800 bg-slate-900/70 px-3 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50 ${mono ? "font-mono" : ""}`}
        placeholder={placeholder}
      />
      {error && <FieldError>{error}</FieldError>}
    </label>
  );
}

function NumberField({
  label,
  suffix,
  value,
  min,
  max,
  step,
  error,
  disabled = false,
  onChange,
}: {
  label: string;
  suffix: string;
  value: number;
  min: number;
  max: number;
  step: number;
  error?: string;
  disabled?: boolean;
  onChange: (value: number) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">
        {label}: {value} {suffix}
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-10 rounded-lg border border-slate-800 bg-slate-900/70 px-3 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50"
      />
      {error && <FieldError>{error}</FieldError>}
    </label>
  );
}

function StatusControl({
  value,
  onChange,
}: {
  value: ProblemStatus;
  onChange: (value: ProblemStatus) => void;
}) {
  return (
    <div className="grid gap-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">
        Visibility
      </span>
      <div className="grid grid-cols-2 rounded-lg border border-slate-800 bg-slate-950/60 p-1">
        {(["draft", "published"] as ProblemStatus[]).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`h-9 rounded-md text-xs font-bold transition ${
              value === option
                ? option === "published"
                  ? "bg-[var(--color-success-soft)] text-[var(--color-success)]"
                  : "bg-slate-800 text-[var(--color-text)]"
                : "text-[var(--color-text-muted)] hover:text-white"
            }`}
          >
            {option === "published" ? "Public" : "Draft"}
          </button>
        ))}
      </div>
    </div>
  );
}

function FieldError({ children }: { children: ReactNode }) {
  return (
    <span className="text-xs font-semibold text-[var(--color-error)]">
      {children}
    </span>
  );
}
