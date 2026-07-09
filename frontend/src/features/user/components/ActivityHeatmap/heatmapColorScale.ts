import { ACTIVITY_HEAT_COLORS, getActivityLevel } from './activityHeatmap.constants'

export function getHeatmapColor(count: number): string {
  return ACTIVITY_HEAT_COLORS[getActivityLevel(count)]
}