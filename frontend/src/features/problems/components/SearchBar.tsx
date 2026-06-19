import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'

import { t } from '@/features/problems/utils/problemsI18n'

type SearchBarProps = {
  value: string
  onSearch: (value: string) => void
}

const controlClassName =
  'h-10 w-full rounded-lg border border-slate-700/50 bg-slate-800/50 py-2 pl-10 pr-4 text-sm text-slate-200 outline-none transition-shadow duration-150 placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-[var(--color-primary)]'

export function SearchBar({ value, onSearch }: SearchBarProps) {
  const [draft, setDraft] = useState(value)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      onSearch(draft)
    }, 300)

    return () => window.clearTimeout(timeoutId)
  }, [draft, onSearch])

  return (
    <label className="relative block w-full lg:max-w-sm">
      <span className="sr-only">{t('search.label')}</span>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        type="search"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder={t('search.placeholder')}
        className={controlClassName}
      />
    </label>
  )
}
