import type {
  AdminProblemFormValues,
  ProblemCodeTemplate,
} from '@/features/admin/problems/types/problem.types'

type AdminProblemCodeTemplatesEditorProps = {
  codeTemplates: ProblemCodeTemplate[]
  onChange: (codeTemplates: ProblemCodeTemplate[]) => void
}

export function AdminProblemCodeTemplatesEditor({
  codeTemplates,
  onChange,
}: AdminProblemCodeTemplatesEditorProps) {
  const updateTemplate = (language: string, starterCode: string) => {
    onChange(
      codeTemplates.map((template) =>
        template.language === language ? { ...template, starterCode } : template,
      ),
    )
  }

  return (
    <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)]">
      <div>
        <h2 className="font-display text-xl font-bold text-[var(--color-text)]">
          Plantillas de código
        </h2>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Código inicial que verá la persona usuaria. Escribe solo la función: el servidor añade el adaptador de entrada y salida y serializa los casos.
        </p>
      </div>

      <div className="mt-5 grid gap-4">
        {codeTemplates.map((template) => (
          <label key={template.language} className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">
              {template.language}
            </span>
            <textarea
              value={template.starterCode}
              onChange={(event) => updateTemplate(template.language, event.target.value)}
              className="min-h-40 w-full rounded-2xl border border-[var(--color-border)] bg-slate-900/70 px-4 py-3 font-mono text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)] transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[rgba(14,165,233,0.22)]"
            />
          </label>
        ))}
      </div>
    </section>
  )
}

export type AdminProblemCodeTemplatesValue = AdminProblemFormValues['codeTemplates']
