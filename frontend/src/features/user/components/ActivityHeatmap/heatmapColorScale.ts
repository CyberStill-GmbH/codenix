export function getHeatmapColor(count: number): string {
  if (count === 0) return 'var(--heat-0)'
  if (count <= 2) return 'var(--heat-1)'
  if (count <= 5) return 'var(--heat-2)'
  if (count <= 10) return 'var(--heat-3)'
  return 'var(--heat-4)'
}
