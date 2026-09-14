import { Brackets, Database, GitBranch, Layers3, SearchCode } from 'lucide-react'

const topicGlyphs = [
  { match: /graph|tree/i, Icon: GitBranch, color: 'text-violet-400' },
  { match: /dynamic|dp|tabul/i, Icon: Layers3, color: 'text-amber-400' },
  { match: /hash|map/i, Icon: Database, color: 'text-emerald-400' },
  { match: /search|búsqueda|ordenad/i, Icon: SearchCode, color: 'text-sky-400' },
  { match: /array|matriz/i, Icon: Brackets, color: 'text-cyan-400' },
] as const

export function TopicIcon({ topic, className = 'h-4 w-4' }: { topic: string; className?: string }) {
  const glyph = topicGlyphs.find(({ match }) => match.test(topic))
  if (!glyph) return <span className={`${className} rounded-sm border border-current text-[var(--color-primary)]`} aria-hidden="true" />

  const Icon = glyph.Icon
  return <Icon className={`${className} ${glyph.color}`} aria-hidden="true" />
}
