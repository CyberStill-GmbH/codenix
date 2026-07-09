import { useEffect, useRef } from 'react'
import Editor, { loader, type BeforeMount, type OnMount } from '@monaco-editor/react'

import type { ProblemCodeLanguage } from '@/features/problems/types/problem.types'

import { useAppSettings } from '@/features/settings/hooks/useAppSettings'

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

const CODENIX_EDITOR_THEME = 'codenix-dark'

const defineCodenixTheme: BeforeMount = (monaco) => {
  monaco.editor.defineTheme(CODENIX_EDITOR_THEME, {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#071225',
      'editor.foreground': '#CBD5E1',
      'editorCursor.foreground': '#38BDF8',
      'editor.lineHighlightBackground': '#0C1A2E',
      'editor.selectionBackground': '#0B7FC355',
      'editor.inactiveSelectionBackground': '#0B7FC330',
      'editorLineNumber.foreground': '#52647A',
      'editorLineNumber.activeForeground': '#CBD5E1',
      'editorIndentGuide.background1': '#172842',
      'editorIndentGuide.activeBackground1': '#285174',
    },
  })
}

export function CodeEditor({ language, value, onChange }: CodeEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)
  const layoutFrameRef = useRef(0)
  const { settings } = useAppSettings()

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
    <div ref={containerRef} className="h-full min-h-0 w-full overflow-hidden bg-[#071225]">
      <Editor
        height="100%"
        width="100%"
        beforeMount={defineCodenixTheme}
        onMount={handleMount}
        theme={CODENIX_EDITOR_THEME}
        language={monacoLanguageByProblemLanguage[language]}
        value={value}
        onChange={(nextValue) => onChange(nextValue ?? '')}
        options={{
          automaticLayout: false,
          minimap: { enabled: false },
          wordWrap: settings.editorWordWrap ? 'on' : 'off',
          fontSize: settings.editorFontSize,
          fontFamily: settings.editorFontFamily,
          fontLigatures: settings.editorLigatures,
          tabSize: settings.editorTabSize,
          lineNumbersMinChars: 3,
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          padding: { top: 16, bottom: 16 },
          bracketPairColorization: { enabled: true },
          cursorBlinking: settings.editorCursorAnimation,
          cursorSmoothCaretAnimation: settings.editorCursorAnimation === 'smooth' ? 'on' : 'off',
        }}
      />
    </div>
  )
}
