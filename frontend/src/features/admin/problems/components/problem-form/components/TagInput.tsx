import { useRef } from 'react'
import { X } from 'lucide-react'

type TagInputProps = {
  value: string[]
  suggestions: string[]
  onChange: (value: string[]) => void
}

export function TagInput({ value, suggestions, onChange }: TagInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  function addTag(tag: string) {
    const normalizedTag = tag.trim()
    if (!normalizedTag || value.includes(normalizedTag) || value.length >= 5) return
    onChange([...value, normalizedTag])
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="grid gap-2">
      <input
        ref={inputRef}
        list="admin-problem-tags"
        placeholder="Array, Graph, DP..."
        className="h-11 rounded-xl border border-slate-700/50 bg-slate-900/70 px-4 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
        onKeyDown={(event) => {
          if (event.key !== 'Enter') return
          event.preventDefault()
          addTag(event.currentTarget.value)
        }}
        onChange={(event) => {
          // datalist selection fires onChange with the full suggestion value
          const val = event.currentTarget.value
          if (suggestions.includes(val)) {
            addTag(val)
          }
        }}
      />
      <datalist id="admin-problem-tags">
        {suggestions.map((tag) => (
          <option key={tag} value={tag} />
        ))}
      </datalist>
      <div className="flex flex-wrap gap-2">
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900/70 px-3 py-1 text-xs font-bold text-[var(--color-text-soft)]"
          >
            {tag}
            <button
              type="button"
              aria-label={`Quitar tag ${tag}`}
              onClick={() => onChange(value.filter((currentTag) => currentTag !== tag))}
              className="text-[var(--color-text-muted)] hover:text-white"
            >
              <X className="h-3 w-3" aria-hidden="true" />
            </button>
          </span>
        ))}
      </div>
      <p className="text-xs text-[var(--color-text-subtle)]">Maximo 5 tags. Enter o click para agregar.</p>
    </div>
  )
}
