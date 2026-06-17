import { useMemo } from 'react'
import type { ActivityDay } from './types/activity.types'

function buildActiveDayIndexes() {
  const activeIndexes = new Set<number>([280, 281, 282])

  for (let index = 0; activeIndexes.size < 67 && index < 365; index += 5) {
    activeIndexes.add(index)
  }

  return activeIndexes
}

export function useActivityHeatmapData() {
  // TODO: API - GET /api/users/me/activity?year={year}
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
        date: date.toISOString().split('T')[0],
        count,
      }
    })
  }, [])
}
