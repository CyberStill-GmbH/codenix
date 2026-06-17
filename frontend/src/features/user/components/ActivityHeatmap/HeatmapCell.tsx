import { format } from 'date-fns'
import { es } from 'date-fns/locale'

import { getHeatmapColor } from './heatmapColorScale'

type HeatmapCellProps = {
  date: string
  count: number
}

export function HeatmapCell({ date, count }: HeatmapCellProps) {
  const readableDate = format(new Date(`${date}T00:00:00`), "d 'de' MMMM", { locale: es })
  const tooltipText = `${count} ${count === 1 ? 'envio' : 'envios'} el ${readableDate}`

  return (
    <div
      className="rounded-[2px] border border-slate-800/60 transition-colors duration-100 hover:opacity-90 hover:ring-1 hover:ring-[var(--color-border-strong)] hover:ring-offset-[1px] hover:ring-offset-[var(--color-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
      style={{
        width: 12,
        height: 12,
        backgroundColor: getHeatmapColor(count),
      }}
      title={tooltipText}
      aria-label={tooltipText}
      role="gridcell"
      tabIndex={0}
    />
  )
}
