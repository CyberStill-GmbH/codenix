type TopicChipsProps = {
  topics: string[]
  selectedTopic: string
  onSelectTopic: (topic: string) => void
}

export function TopicChips({ topics, selectedTopic, onSelectTopic }: TopicChipsProps) {
  const allTopics = ['All Topics', ...topics]

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin" aria-label="Filtrar por tema">
      {allTopics.map((topic) => {
        const isSelected = selectedTopic === topic

        return (
          <button
            key={topic}
            type="button"
            onClick={() => onSelectTopic(topic)}
            className={`inline-flex min-h-10 shrink-0 items-center rounded-full border px-4 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] ${
              isSelected
                ? 'border-slate-200 bg-slate-100 text-slate-950'
                : 'border-slate-700/50 bg-slate-900/70 text-[var(--color-text-muted)] hover:bg-slate-800/70 hover:text-[var(--color-text)]'
            }`}
          >
            {topic}
          </button>
        )
      })}
    </div>
  )
}
