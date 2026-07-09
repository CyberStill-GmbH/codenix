import { useMemo } from 'react'
import type { ActivityDay } from './types/activity.types'

function buildActiveDayIndexes() {
  const activeIndexes = new Set<number>([280, 281, 282])

  for (let index = 0; activeIndexes.size < 67 && index < 365; index += 5) {
    activeIndexes.add(index)
  }

  return activeIndexes
}

// Misma fecha en calendario LOCAL (no UTC) que en ActivityHeatmap.tsx, para que este
// fallback de desarrollo se comporte igual que los datos reales de la API.
function toLocalDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function useActivityHeatmapData() {
  // Development fallback for isolated visual rendering; ProfilePage passes API data.
  return useMemo<ActivityDay[]>(() => {
    const today = new Date()
    const activeIndexes = buildActiveDayIndexes()
    const sortedActiveIndexes = Array.from(activeIndexes).sort((a, b) => a - b)
    const boostedIndex = sortedActiveIndexes[0]

    return Array.from({ length: 365 }, (_, index) => {
      const date = new Date(today)
      date.setDate(date.getDate() - (364 - index))

      const isActive = activeIndexes.has(index)
      const count = !isActive
        ? 0
        : index === boostedIndex
          ? 5
          : 4

      return {
        date: toLocalDateKey(date),
        count,
        accepted: count,
      }
    })
  }, [])
}