import { useEffect, useRef } from 'react'
import Editor, { loader, type OnMount } from '@monaco-editor/react'

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
  const containerRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)
  const layoutFrameRef = useRef(0)

  useEffect(() => {
    return () => {
      cancelAnimationFrame(layoutFrameRef.current)
      resizeObserverRef.current?.disconnect()
    }
  }, [])

  const handleMount: OnMount = (editor) => {
    editorRef.current = editor
    editor.layout()

    resizeObserverRef.current?.disconnect()
    resizeObserverRef.current = new ResizeObserver(() => {
      cancelAnimationFrame(layoutFrameRef.current)
      layoutFrameRef.current = requestAnimationFrame(() => editorRef.current?.layout())
    })

    if (containerRef.current) resizeObserverRef.current.observe(containerRef.current)
  }

  return (
    <div ref={containerRef} className="h-full min-h-0 w-full overflow-hidden">
      <Editor
        height="100%"
        width="100%"
        onMount={handleMount}
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
    </div>
  )
}
