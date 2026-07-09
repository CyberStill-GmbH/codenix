import { ChevronDown, Info } from 'lucide-react'
import { ActivityCalendar, type Activity } from 'react-activity-calendar'
import 'react-activity-calendar/tooltips.css'

import { UserCard } from '@/features/user/components/UserCard'
import {
  profileInteractiveSurfaceClassName,
} from '@/features/user/components/profileStyles'
import type { ActivityDay } from '@/features/user/types/user.types'
import { formatDate } from '@/shared/utils/date'
import {
  ACTIVITY_HEAT_COLORS,
  getActivityLevel,
  LEGEND_SAMPLE_COUNTS,
} from './activityHeatmap.constants'
import { getHeatmapColor } from './heatmapColorScale'
import { useActivityHeatmapData } from './useActivityHeatmapData'

type ActivityHeatmapProps = {
  activityDays?: ActivityDay[]
  year?: number
}

// El theme del calendario lee de la MISMA paleta que la leyenda (activityHeatmap.constants),
// así nunca se vuelven a desincronizar como antes.
// El nivel 0 (sin actividad) se sobreescribe a algo casi imperceptible contra el fondo de la card:
// si se deja el token --heat-0 tal cual, en LeetCode ese contraste es mínimo, y si el token
// definido en el design system tiene demasiado contraste los cuadros vacíos se ven "gordos"
// y con borde visible en vez de fundirse con el fondo.
const heatmapTheme = {
  dark: ['rgba(255,255,255,0.045)', ...ACTIVITY_HEAT_COLORS.slice(1)],
}

const labels = {
  // Weekday labels alineadas con weekStart={1} (Lunes primero). Solo se usan si
  // showWeekdayLabels se activa en el futuro; antes empezaban en Domingo y quedaban desfasadas.
  months: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  weekdays: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
  legend: {
    less: 'Menos',
    more: 'Mas',
  },
}

function getMaxStreak(data: Activity[]) {
  let maxStreak = 0
  let currentStreak = 0

  for (const day of data) {
    if (day.count > 0) {
      currentStreak += 1
      maxStreak = Math.max(maxStreak, currentStreak)
    } else {
      currentStreak = 0
    }
  }

  return maxStreak
}

// Arma la clave de fecha (YYYY-MM-DD) usando el calendario LOCAL del navegador, no UTC.
// Antes se usaba toISOString(), que siempre devuelve la fecha en UTC: para alguien en
// UTC-5 (Perú), pasadas las 7pm hora local ya es "mañana" en UTC, así que el punto de
// "hoy" aparecía corrido un día. GitHub y LeetCode arman la fecha con el calendario
// local del usuario, no con UTC — esto replica ese comportamiento.
function toLocalDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Ventana móvil de 12 meses terminando HOY (mes actual siempre visible al final),
// igual que "past one year" en GitHub/LeetCode. Alineada al día 1 del mes de hace 11
// meses, para que ningún mes quede partido en dos pedazos distintos. Se usa para "Año actual".
function buildRollingYearCalendar(activityDays: ActivityDay[]): ActivityDay[] {
  const activityByDate = new Map(activityDays.map((day) => [day.date, day]))
  const today = new Date()
  const start = new Date(today.getFullYear(), today.getMonth() - 11, 1)
  const days: ActivityDay[] = []

  for (const date = new Date(start); date <= today; date.setDate(date.getDate() + 1)) {
    const dateKey = toLocalDateKey(date)
    days.push(activityByDate.get(dateKey) ?? { date: dateKey, count: 0, accepted: 0 })
  }

  return days
}

// Año calendario fijo (Ene 1 - Dic 31) para cuando se navega a un año pasado específico.
function buildCalendarYear(activityDays: ActivityDay[], year: number): ActivityDay[] {
  const activityByDate = new Map(activityDays.map((day) => [day.date, day]))
  const start = new Date(year, 0, 1)
  const end = new Date(year + 1, 0, 1)
  const days: ActivityDay[] = []

  for (const date = new Date(start); date < end; date.setDate(date.getDate() + 1)) {
    const dateKey = toLocalDateKey(date)
    days.push(activityByDate.get(dateKey) ?? { date: dateKey, count: 0, accepted: 0 })
  }

  return days
}

export function ActivityHeatmap({
  activityDays,
  year = new Date().getFullYear(),
}: ActivityHeatmapProps) {
  const fallbackData = useActivityHeatmapData()
  const isCurrentYear = year === new Date().getFullYear()
  const sourceData = activityDays
    ? isCurrentYear
      ? buildRollingYearCalendar(activityDays)
      : buildCalendarYear(activityDays, year)
    : fallbackData
  const data = sourceData.map<Activity>((day) => ({
    ...day,
    level: getActivityLevel(day.count),
  }))

  const totalSubmissions = data.reduce((acc, curr) => acc + curr.count, 0)
  const activeDays = data.filter((day) => day.count > 0).length
  const maxStreak = getMaxStreak(data)

  return (
    <UserCard>
      <div className="p-3.5">
        {/* Header estilo LeetCode: total + label a la izquierda, stats compactas a la derecha */}
        <header className="mb-3 flex flex-col gap-2 pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-lg font-bold text-[var(--color-text)]">
              {totalSubmissions}
            </span>
            <span className="text-sm text-[var(--color-text-muted)]">
              {isCurrentYear ? 'envios en el ultimo año' : `envios en ${year}`}
            </span>
            <Info
              className="h-3.5 w-3.5 text-[var(--color-text-subtle)]"
              aria-hidden="true"
            />
          </div>

          <div className="flex items-center gap-4 text-sm text-[var(--color-text-muted)]">
            <span>
              Dias activos:{' '}
              <span className="font-mono font-semibold text-[var(--color-text)]">{activeDays}</span>
            </span>
            <span>
              Racha maxima:{' '}
              <span className="font-mono font-semibold text-[var(--color-text)]">{maxStreak}</span>
            </span>

            <button className={`inline-flex min-h-8 items-center gap-1.5 rounded-lg px-2.5 text-sm font-semibold text-[var(--color-text-soft)] ${profileInteractiveSurfaceClassName}`}>
              {isCurrentYear ? 'Año actual' : year}
              <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </header>

        <div className="flex w-full justify-center overflow-x-auto pb-1">
          <div className="w-fit">
            <ActivityCalendar
              data={data}
              blockSize={12}
              blockMargin={4}
              blockRadius={2}
              colorScheme="dark"
              fontSize={9}
              labels={labels}
              showColorLegend={false}
              showTotalCount={false}
              showWeekdayLabels={false}
              theme={heatmapTheme}
              tooltips={{
                activity: {
                  text: (activity) =>
                    `${activity.count} ${activity.count === 1 ? 'envio' : 'envios'} · ${formatDate(activity.date)}`,
                },
              }}
              weekStart={1}
            />
          </div>
        </div>

        <div className="mt-3 flex justify-end">
          <div className="flex items-center gap-1.5 text-[0.6875rem] text-[var(--color-text-subtle)]">
            <span>{labels.legend.less}</span>
            {LEGEND_SAMPLE_COUNTS.map((count) => (
              <span
                key={count}
                className="h-3 w-3 rounded-[3px] border border-[rgba(255,255,255,0.06)]"
                style={{ backgroundColor: getHeatmapColor(count) }}
                aria-hidden="true"
              />
            ))}
            <span>{labels.legend.more}</span>
          </div>
        </div>
      </div>
    </UserCard>
  )
}

