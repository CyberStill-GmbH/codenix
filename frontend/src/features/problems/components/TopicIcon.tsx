import {
  Brackets,
  ArrowDownUp,
  Binary,
  CircleDot,
  Database,
  GitPullRequest,
  SearchCode,
  Sigma,
  SquareStack,
  Undo2,
  Waypoints,
  WholeWord,
  Workflow,
  Zap,
  Code2,
} from 'lucide-react'

const topicGlyphs = [
  { match: /graph|tree/i, Icon: Waypoints, color: 'text-violet-400' },
  { match: /linked.?list|lista enlazada/i, Icon: GitPullRequest, color: 'text-blue-400' },
  { match: /stack|pila/i, Icon: SquareStack, color: 'text-orange-400' },
  { match: /queue|cola/i, Icon: ArrowDownUp, color: 'text-orange-300' },
  { match: /heap|priority/i, Icon: CircleDot, color: 'text-fuchsia-400' },
  { match: /dynamic|dp|tabul/i, Icon: Workflow, color: 'text-amber-400' },
  { match: /greedy|voraz/i, Icon: Zap, color: 'text-yellow-400' },
  { match: /backtrack|recurs/i, Icon: Undo2, color: 'text-rose-400' },
  { match: /sort|orden/i, Icon: ArrowDownUp, color: 'text-indigo-400' },
  { match: /hash|map/i, Icon: Database, color: 'text-emerald-400' },
  { match: /string|cadena|text/i, Icon: WholeWord, color: 'text-pink-400' },
  { match: /bit|binary|binario/i, Icon: Binary, color: 'text-lime-400' },
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
