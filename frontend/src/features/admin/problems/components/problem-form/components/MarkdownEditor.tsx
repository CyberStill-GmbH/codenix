import type { ChangeEvent } from 'react'
import MDEditor from '@uiw/react-md-editor'
import { ImagePlus } from 'lucide-react'

import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'

import { ProblemDescription } from '@/features/admin/problems/components/ProblemDescription'
import { markdownPlaceholder } from '@/features/admin/problems/components/problem-form/utils/problemSchema'

type MarkdownEditorProps = {
  value: string
  onChange: (value: string) => void
  onUploadImage?: (file: File) => Promise<string>
}

export function MarkdownEditor({ value, onChange, onUploadImage }: MarkdownEditorProps) {
  async function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file || !onUploadImage) return

    try {
      const imageUrl = await onUploadImage(file)
      const nextValue = `${value}${value.endsWith('\n') || value.length === 0 ? '' : '\n'}![Imagen del problema](${imageUrl})`
      onChange(nextValue)
    } catch {
      // The parent section renders the backend validation message.
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2" data-color-mode="dark">
      <label className="grid gap-2">
        <span className="flex items-center justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">
            Markdown
          </span>
          {onUploadImage && (
            <span className="relative inline-flex">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImageChange}
                className="absolute inset-0 cursor-pointer opacity-0"
                aria-label="Subir imagen"
              />
              <span className="inline-flex h-8 items-center gap-2 rounded-lg border border-slate-700/60 bg-slate-900/80 px-3 text-xs font-bold text-[var(--color-text-soft)]">
                <ImagePlus className="h-3.5 w-3.5" aria-hidden="true" />
                Imagen
              </span>
            </span>
          )}
        </span>
        <div className="min-h-[400px] resize-y overflow-hidden rounded-xl border border-slate-700/50 bg-slate-950">
          <MDEditor
            value={value}
            onChange={(nextValue) => onChange(nextValue ?? '')}
            preview="edit"
            height={400}
            textareaProps={{
              placeholder: markdownPlaceholder,
              'aria-label': 'Descripcion Markdown del problema',
            }}
          />
        </div>
      </label>

      <div className="min-h-[400px] overflow-auto rounded-xl border border-slate-700/50 bg-slate-950/70 p-4">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">
          Preview seguro
        </p>
        <ProblemDescription markdown={value || markdownPlaceholder} />
      </div>
    </div>
  )
}
