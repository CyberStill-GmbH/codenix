import { HeatmapCell } from './HeatmapCell'
import type { ActivityDay } from './types/activity.types'

type HeatmapGridProps = {
  data: ActivityDay[]
}

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
const CELL_SIZE = 12
const CELL_GAP = 2
const COL_UNIT = CELL_SIZE + CELL_GAP
const MONTH_GAP = 8

export function HeatmapGrid({ data }: HeatmapGridProps) {
  if (!data.length) return null

  const firstDate = new Date(data[0].date)
  const firstDayOfWeek = firstDate.getDay()
  const totalCells = firstDayOfWeek + data.length
  const totalColumns = Math.ceil(totalCells / 7)
  const columns: Array<Array<ActivityDay | null>> = Array.from(
    { length: totalColumns },
    () => Array.from({ length: 7 }, () => null),
  )
  const columnMonths = Array.from({ length: totalColumns }, () => -1)

  data.forEach((day, index) => {
    const cellIndex = firstDayOfWeek + index
    const columnIndex = Math.floor(cellIndex / 7)
    const rowIndex = cellIndex % 7
    const [, month] = day.date.split('-').map(Number)

    columns[columnIndex][rowIndex] = day
    if (columnMonths[columnIndex] === -1) {
      columnMonths[columnIndex] = month - 1
    }
  })

  const monthGapBeforeColumn = Array.from({ length: totalColumns }, (_, columnIndex) => {
    if (columnIndex === 0) return 0

    const month = columnMonths[columnIndex]
    const previousMonth = columnMonths[columnIndex - 1]

    return month !== -1 && previousMonth !== -1 && month !== previousMonth
      ? MONTH_GAP
      : 0
  })

  const columnOffsets = monthGapBeforeColumn.reduce<number[]>((offsets, gap, columnIndex) => {
    const previousOffset = offsets[columnIndex - 1] ?? 0
    offsets.push(columnIndex === 0 ? 0 : previousOffset + COL_UNIT + gap)
    return offsets
  }, [])

  const monthLabels: { label: string; left: number }[] = []
  let currentMonth = -1

  for (let i = 0; i < data.length; i++) {
    const [year, monthNumber, dayNumber] = data[i].date.split('-').map(Number)
    const date = new Date(year, monthNumber - 1, dayNumber)
    const month = date.getMonth()

    if (month !== currentMonth && date.getDate() <= 14) {
      const columnIndex = Math.floor((firstDayOfWeek + i) / 7)
      const left = columnOffsets[columnIndex] ?? columnIndex * COL_UNIT
      const previousLeft = monthLabels[monthLabels.length - 1]?.left ?? -COL_UNIT * 6

      if (left - previousLeft >= COL_UNIT * 4) {
        monthLabels.push({ label: MONTHS[month], left })
        currentMonth = month
      }
    }
  }

  return (
    <div className="flex flex-col" style={{ gap: 6 }}>
      <div className="relative h-4 text-[0.625rem] text-[var(--color-text-subtle)]">
        {monthLabels.map((month, index) => (
          <span
            key={`${month.label}-${index}`}
            className="absolute leading-none"
            style={{ left: month.left }}
          >
            {month.label}
          </span>
        ))}
      </div>

      <div
        className="flex w-max"
        style={{ gap: CELL_GAP }}
        role="grid"
        aria-label="Mapa de calor de envios"
      >
        {columns.map((column, columnIndex) => (
          <div
            key={columnIndex}
            className="grid grid-rows-7"
            style={{
              gap: CELL_GAP,
              marginLeft: monthGapBeforeColumn[columnIndex],
            }}
          >
            {column.map((day, rowIndex) =>
              day ? (
                <HeatmapCell key={day.date} date={day.date} count={day.count} />
              ) : (
                <div
                  key={`empty-${columnIndex}-${rowIndex}`}
                  style={{ width: CELL_SIZE, height: CELL_SIZE }}
                />
              ),
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
