import { CodeEditor } from '@/features/coding/components/CodeEditor'
import type { ProblemLanguage } from '@/features/admin/problems/types/problem.types'

type LanguageCodeEditorProps = {
  language: ProblemLanguage
  value: string
  onChange: (value: string) => void
}

export function LanguageCodeEditor({ language, value, onChange }: LanguageCodeEditorProps) {
  return (
    <div className="h-72 overflow-hidden rounded-xl border border-slate-700/50 bg-slate-950">
      <CodeEditor language={language} value={value} onChange={onChange} />
    </div>
  )
}
