import Editor, { loader } from '@monaco-editor/react'

import type { ProblemCodeLanguage } from '@/features/problems/types/problem.types'

type MonacoEditorLanguage = ProblemCodeLanguage | 'java' | 'cpp'

type CodeEditorProps = {
  language: MonacoEditorLanguage
  value: string
  onChange: (value: string) => void
}

const monacoLanguageByProblemLanguage: Record<MonacoEditorLanguage, string> = {
  typescript: 'typescript',
  javascript: 'javascript',
  python: 'python',
  c: 'c',
  rust: 'rust',
  java: 'java',
  cpp: 'cpp',
}

loader.config({
  paths: {
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.55.1/min/vs',
  },
})

export function CodeEditor({ language, value, onChange }: CodeEditorProps) {
  return (
    <Editor
      height="100%"
      width="100%"
      theme="vs-dark"
      language={monacoLanguageByProblemLanguage[language]}
      value={value}
      onChange={(nextValue) => onChange(nextValue ?? '')}
      options={{
        automaticLayout: true,
        minimap: { enabled: false },
        wordWrap: 'on',
        fontSize: 14,
        fontLigatures: true,
        lineNumbersMinChars: 3,
        scrollBeyondLastLine: false,
        smoothScrolling: true,
        padding: { top: 16, bottom: 16 },
      }}
    />
  )
}
