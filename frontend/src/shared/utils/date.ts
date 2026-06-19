const dateFormatter = new Intl.DateTimeFormat(undefined, {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

const relativeFormatter = new Intl.RelativeTimeFormat(undefined, {
  numeric: 'auto',
})

const relativeUnits = [
  { unit: 'year', seconds: 31_536_000 },
  { unit: 'month', seconds: 2_592_000 },
  { unit: 'week', seconds: 604_800 },
  { unit: 'day', seconds: 86_400 },
  { unit: 'hour', seconds: 3_600 },
  { unit: 'minute', seconds: 60 },
] as const

export function formatDate(isoString: string) {
  const date = new Date(isoString)
  if (Number.isNaN(date.getTime())) return isoString

  return dateFormatter.format(date)
}

export function formatRelativeDate(isoString: string) {
  const date = new Date(isoString)
  if (Number.isNaN(date.getTime())) return isoString

  const diffSeconds = Math.round((date.getTime() - Date.now()) / 1000)
  const absSeconds = Math.abs(diffSeconds)

  for (const { unit, seconds } of relativeUnits) {
    if (absSeconds >= seconds) {
      return relativeFormatter.format(
        Math.round(diffSeconds / seconds),
        unit,
      )
    }
  }

  return relativeFormatter.format(0, 'minute')
}
