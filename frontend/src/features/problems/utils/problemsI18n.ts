import problemsEs from '@/locales/es/problems.json'

type TranslationValues = Record<string, string | number>

function getValue(path: string) {
  return path.split('.').reduce<unknown>((current, key) => {
    if (current && typeof current === 'object' && key in current) {
      return (current as Record<string, unknown>)[key]
    }
    return undefined
  }, problemsEs)
}

export function t(path: string, values: TranslationValues = {}) {
  const value = getValue(path)
  if (typeof value !== 'string') return path

  return Object.entries(values).reduce(
    (result, [key, replacement]) =>
      result.replaceAll(`{{${key}}}`, String(replacement)),
    value,
  )
}

export function translateTopic(topic: string) {
  return topic
}
