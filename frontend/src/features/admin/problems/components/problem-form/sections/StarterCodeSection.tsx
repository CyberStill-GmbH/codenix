import { useState } from 'react'

import type { ProblemLanguage } from '@/features/admin/problems/types/problem.types'
import { FormSection } from '@/features/admin/problems/components/problem-form/components/FormSection'
import { LanguageCodeEditor } from '@/features/admin/problems/components/problem-form/components/LanguageCodeEditor'
import {
  availableLanguages,
  defaultStarterCode,
} from '@/features/admin/problems/components/problem-form/utils/problemSchema'

type StarterCodeSectionProps = {
  supportedLanguages: ProblemLanguage[]
  starterCode: Record<ProblemLanguage, string>
  onChange: (starterCode: Record<ProblemLanguage, string>) => void
}

export function StarterCodeSection({
  supportedLanguages,
  starterCode,
  onChange,
}: StarterCodeSectionProps) {
  const [activeLanguage, setActiveLanguage] = useState<ProblemLanguage>(
    supportedLanguages[0] ?? 'typescript',
  )
  const activeSupportedLanguage = supportedLanguages.includes(activeLanguage)
    ? activeLanguage
    : supportedLanguages[0] ?? 'typescript'

  return (
    <FormSection
      title="Starter code"
      description="Un template por cada lenguaje soportado."
    >
      {supportedLanguages.length === 0 ? (
        <p className="text-sm font-semibold text-[var(--color-warning)]">
          Selecciona al menos un lenguaje en Informacion basica.
        </p>
      ) : (
        <div>
          <div className="flex flex-wrap gap-2">
            {supportedLanguages.map((language) => {
              const label =
                availableLanguages.find((item) => item.value === language)?.label ?? language
              return (
                <button
                  key={language}
                  type="button"
                  onClick={() => setActiveLanguage(language)}
                  className={`h-9 rounded-full px-3 text-xs font-bold transition ${
                    activeSupportedLanguage === language
                      ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary)]'
                      : 'bg-slate-900/70 text-[var(--color-text-muted)] hover:text-white'
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>

          <div className="mt-4">
            <LanguageCodeEditor
              language={activeSupportedLanguage}
              value={starterCode[activeSupportedLanguage]}
              onChange={(value) =>
                onChange({
                  ...starterCode,
                  [activeSupportedLanguage]: value,
                })
              }
            />
          </div>

          <button
            type="button"
            onClick={() =>
              onChange({
                ...starterCode,
                [activeSupportedLanguage]: defaultStarterCode[activeSupportedLanguage],
              })
            }
            className="mt-3 h-9 rounded-full border border-slate-700/60 px-4 text-xs font-bold text-[var(--color-text-soft)] hover:border-[var(--color-primary)]"
          >
            Restaurar template
          </button>
        </div>
      )}
    </FormSection>
  )
}
