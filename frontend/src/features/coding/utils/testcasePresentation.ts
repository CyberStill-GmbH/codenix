function parseSerializedValue(value: string | null | undefined): unknown {
  const trimmed = value?.trim() ?? ''
  if (!trimmed) return ''

  try {
    return JSON.parse(trimmed)
  } catch {
    return trimmed
  }
}

function formatValue(value: unknown): string {
  if (typeof value === 'string') return value
  if (value === null) return 'null'
  if (value === undefined) return ''
  if (Array.isArray(value)) {
    return `[${value.map((item) => formatValue(item)).join(', ')}]`
  }
  if (typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>)
      .map(([key, item]) => `${key} = ${formatValue(item)}`)
      .join('\n')
  }
  return String(value)
}

export function formatTestcaseInput(input: string | null | undefined): string {
  const parsed = parseSerializedValue(input)
  if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
    return formatValue(parsed)
  }
  return formatValue(parsed)
}

export function formatTestcaseOutput(output: string | null | undefined): string {
  return formatValue(parseSerializedValue(output))
}

function parseHumanValue(value: string): unknown {
  const trimmed = value.trim()
  if (!trimmed) return ''

  try {
    return JSON.parse(trimmed)
  } catch {
    return trimmed
  }
}

export function serializeHumanInput(value: string): string {
  if (!value.trim()) return ''

  const lines = value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
  const assignments = lines
    .map((line) => {
      const separator = line.indexOf('=')
      if (separator <= 0) return null
      return [line.slice(0, separator).trim(), parseHumanValue(line.slice(separator + 1))] as const
    })
    .filter((entry): entry is readonly [string, unknown] => Boolean(entry))

  if (assignments.length === lines.length && assignments.length > 0) {
    return JSON.stringify(Object.fromEntries(assignments))
  }

  const parsed = parseHumanValue(value)
  return typeof parsed === 'string' ? parsed : JSON.stringify(parsed)
}

export function serializeHumanOutput(value: string): string {
  if (!value.trim()) return ''
  const parsed = parseHumanValue(value)
  return typeof parsed === 'string' ? parsed : JSON.stringify(parsed)
}
