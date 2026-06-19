import type {
  AdminProblemFormValues,
  ProblemDifficulty,
  ProblemLanguage,
} from '@/features/admin/problems/types/problem.types'
import { DifficultySelector } from '@/features/admin/problems/components/problem-form/components/DifficultySelector'
import { FormSection } from '@/features/admin/problems/components/problem-form/components/FormSection'
import { TagInput } from '@/features/admin/problems/components/problem-form/components/TagInput'
import {
  availableLanguages,
  type ProblemFormErrors,
} from '@/features/admin/problems/components/problem-form/utils/problemSchema'
import { slugify } from '@/features/admin/problems/components/problem-form/utils/slugify'

type BasicInfoSectionProps = {
  values: AdminProblemFormValues
  errors: ProblemFormErrors
  tagSuggestions: string[]
  onChange: <Key extends keyof AdminProblemFormValues>(
    field: Key,
    value: AdminProblemFormValues[Key],
  ) => void
}

export function BasicInfoSection({
  values,
  errors,
  tagSuggestions,
  onChange,
}: BasicInfoSectionProps) {
  function toggleLanguage(language: ProblemLanguage) {
    const nextLanguages = values.supportedLanguages.includes(language)
      ? values.supportedLanguages.filter((current) => current !== language)
      : [...values.supportedLanguages, language]

    onChange('supportedLanguages', nextLanguages)
  }

  return (
    <FormSection
      title="Informacion basica"
      description="Datos de catalogo, descubrimiento y lenguajes soportados."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">
            Titulo
          </span>
          <input
            value={values.title}
            maxLength={100}
            onChange={(event) => {
              onChange('title', event.target.value)
              onChange('slug', slugify(event.target.value))
            }}
            className="h-11 rounded-xl border border-slate-700/50 bg-slate-900/70 px-4 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
            placeholder="Suma de Pares"
            aria-describedby="problem-title-help"
          />
          <span id="problem-title-help" className="text-xs text-[var(--color-text-subtle)]">
            {values.title.length}/100
          </span>
          {errors.title && (
            <span className="text-xs font-semibold text-[var(--color-error)]">
              {errors.title}
            </span>
          )}
        </label>

        <label className="grid gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">
            Slug
          </span>
          <input
            value={values.slug}
            onChange={(event) => onChange('slug', event.target.value)}
            className="h-11 rounded-xl border border-slate-700/50 bg-slate-900/70 px-4 font-mono text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
            placeholder="suma-de-pares"
          />
          <span className="text-xs text-[var(--color-text-subtle)]">
            /problems/{values.slug || 'nuevo-problema'}
          </span>
          {errors.slug && (
            <span className="text-xs font-semibold text-[var(--color-error)]">
              {errors.slug}
            </span>
          )}
        </label>

        <div className="grid gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">
            Dificultad
          </span>
          <DifficultySelector
            value={values.difficulty}
            onChange={(difficulty: ProblemDifficulty) => onChange('difficulty', difficulty)}
          />
        </div>

        <div className="grid gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">
            Tags
          </span>
          <TagInput
            value={values.tags}
            suggestions={tagSuggestions}
            onChange={(tags) => onChange('tags', tags)}
          />
          {errors.tags && (
            <span className="text-xs font-semibold text-[var(--color-error)]">
              {errors.tags}
            </span>
          )}
        </div>
      </div>

      <fieldset className="mt-5">
        <legend className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">
          Lenguajes soportados
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {availableLanguages.map((language) => (
            <label
              key={language.value}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900/60 px-3 text-sm font-semibold text-[var(--color-text-soft)]"
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
          <p className="mt-2 text-xs font-semibold text-[var(--color-error)]">
            {errors.supportedLanguages}
          </p>
        )}
      </fieldset>
    </FormSection>
  )
}
