import {
  Brackets,
  CircleDot,
  Code2,
  Database,
  GitBranch,
  Hash,
  Layers3,
  List,
  Network,
  SearchCode,
  Sigma,
} from 'lucide-react'

const topicGlyphs = [
  { match: /graph|tree/i, Icon: GitBranch, color: 'text-violet-400' },
  { match: /linked.?list|lista enlazada/i, Icon: Network, color: 'text-blue-400' },
  { match: /stack|pila|queue|cola/i, Icon: List, color: 'text-orange-400' },
  { match: /heap|priority/i, Icon: Layers3, color: 'text-fuchsia-400' },
  { match: /dynamic|dp|tabul/i, Icon: Layers3, color: 'text-amber-400' },
  { match: /greedy|voraz/i, Icon: CircleDot, color: 'text-yellow-400' },
  { match: /backtrack|recurs/i, Icon: GitBranch, color: 'text-rose-400' },
  { match: /sort|orden/i, Icon: List, color: 'text-indigo-400' },
  { match: /hash|map/i, Icon: Database, color: 'text-emerald-400' },
  { match: /string|cadena|text/i, Icon: Brackets, color: 'text-pink-400' },
  { match: /bit|binary|binario/i, Icon: Hash, color: 'text-lime-400' },
  { match: /math|matem|number|número/i, Icon: Sigma, color: 'text-red-400' },
  { match: /database|sql|shell|concurr/i, Icon: Database, color: 'text-teal-400' },
  { match: /search|búsqueda|ordenad/i, Icon: SearchCode, color: 'text-sky-400' },
  { match: /array|matriz/i, Icon: Brackets, color: 'text-cyan-400' },
] as const

export function TopicIcon({ topic, className = 'h-4 w-4' }: { topic: string; className?: string }) {
  const glyph = topicGlyphs.find(({ match }) => match.test(topic))
  if (!glyph) return <Code2 className={`${className} text-[var(--color-primary)]`} aria-hidden="true" />

  const Icon = glyph.Icon
  return <Icon className={`${className} ${glyph.color}`} aria-hidden="true" />
}
