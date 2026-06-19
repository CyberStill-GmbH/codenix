export function readStoredSplitPercent(storageKey: string, fallback: number) {
  const stored = window.localStorage.getItem(storageKey)
  if (!stored) return fallback

  const parsed = Number(stored)
  return Number.isFinite(parsed) ? parsed : fallback
}
