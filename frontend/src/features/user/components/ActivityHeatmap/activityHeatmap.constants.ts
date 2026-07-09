/**
 * Fuente única de verdad para los niveles de actividad.
 * Tanto el theme del calendario, el color scale y la leyenda
 * deben leer de aquí para no desincronizarse.
 */

export const ACTIVITY_LEVEL_COUNT = 5 // niveles 0..4

// Límite superior (inclusive) de conteo para cada nivel 1..3.
// El nivel 0 es siempre count === 0, el nivel 4 es todo lo que exceda el último umbral.
const LEVEL_UPPER_BOUNDS = [2, 5, 10] as const

export type ActivityLevel = 0 | 1 | 2 | 3 | 4

export function getActivityLevel(count: number): ActivityLevel {
  if (count <= 0) return 0
  for (let level = 0; level < LEVEL_UPPER_BOUNDS.length; level += 1) {
    if (count <= LEVEL_UPPER_BOUNDS[level]) return (level + 1) as ActivityLevel
  }
  return 4
}

// Un conteo representativo por nivel, usado solo para pintar los swatches de la leyenda.
export const LEGEND_SAMPLE_COUNTS: readonly [number, number, number, number, number] = [
  0,
  1,
  LEVEL_UPPER_BOUNDS[1] - 2, // ~3
  LEVEL_UPPER_BOUNDS[2] - 4, // ~6
  LEVEL_UPPER_BOUNDS[2] + 1, // 11
]

// Colores por nivel: referencian las variables CSS del design system,
// así el theme del calendario y la leyenda SIEMPRE pintan igual.
export const ACTIVITY_HEAT_COLORS: readonly [string, string, string, string, string] = [
  'var(--heat-0)',
  'var(--heat-1)',
  'var(--heat-2)',
  'var(--heat-3)',
  'var(--heat-4)',
]