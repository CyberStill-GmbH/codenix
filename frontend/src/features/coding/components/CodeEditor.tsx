import { useEffect, useRef } from 'react'
import Editor, { loader, type BeforeMount, type OnMount } from '@monaco-editor/react'

import type { ProblemCodeLanguage } from '@/features/problems/types/problem.types'
import { useAppSettings } from '@/features/settings/hooks/useAppSettings'
import { useTheme } from '@/shared/providers/ThemeProvider'

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

const CODENIX_DARK_THEME = 'codenix-dark'
const CODENIX_LIGHT_THEME = 'codenix-light'

const defineCodenixThemes: BeforeMount = (monaco) => {
  // Dark theme — matches the dark token set
  monaco.editor.defineTheme(CODENIX_DARK_THEME, {
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

  // Light theme — crisp white surface, dark text, same cyan accent
  monaco.editor.defineTheme(CODENIX_LIGHT_THEME, {
    base: 'vs',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#FFFFFF',
      'editor.foreground': '#1E293B',
      'editorCursor.foreground': '#0369A1',
      'editor.lineHighlightBackground': '#F8FAFC',
      'editor.selectionBackground': '#0369A133',
      'editor.inactiveSelectionBackground': '#0369A11A',
      'editorLineNumber.foreground': '#94A3B8',
      'editorLineNumber.activeForeground': '#475569',
      'editorIndentGuide.background1': '#E2E8F0',
      'editorIndentGuide.activeBackground1': '#CBD5E1',
      'editorWidget.background': '#FFFFFF',
      'editorWidget.border': '#CBD5E1',
      'editorSuggestWidget.background': '#FFFFFF',
      'editorSuggestWidget.border': '#CBD5E1',
      'editorSuggestWidget.selectedBackground': '#F0F4F8',
    },
  })
}

export function CodeEditor({ language, value, onChange }: CodeEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)
  const layoutFrameRef = useRef(0)
  const { settings } = useAppSettings()
  const { resolvedTheme } = useTheme()

  const monacoTheme = resolvedTheme === 'light' ? CODENIX_LIGHT_THEME : CODENIX_DARK_THEME

  // Switch Monaco theme when the app theme changes, even if editor is already mounted
  useEffect(() => {
    import('@monaco-editor/react').then(({ loader: l }) => {
      l.init().then((monaco) => {
        monaco.editor.setTheme(monacoTheme)
      })
    })
  }, [monacoTheme])

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

  const editorBg = resolvedTheme === 'light' ? '#FFFFFF' : '#071225'

  return (
    <div ref={containerRef} className="h-full min-h-0 w-full overflow-hidden" style={{ background: editorBg }}>
      <Editor
        height="100%"
        width="100%"
        beforeMount={defineCodenixThemes}
        onMount={handleMount}
        theme={monacoTheme}
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
