import { ChevronDown } from 'lucide-react'
import { ActivityCalendar, type Activity } from 'react-activity-calendar'
import 'react-activity-calendar/tooltips.css'

import { UserCard } from '@/features/user/components/UserCard'
import {
  profileDividerClassName,
  profileInteractiveSurfaceClassName,
} from '@/features/user/components/profileStyles'
import type { ActivityDay } from '@/features/user/types/user.types'
import { formatDate } from '@/shared/utils/date'
import { getHeatmapColor } from './heatmapColorScale'
import { useActivityHeatmapData } from './useActivityHeatmapData'

type ActivityHeatmapProps = {
  activityDays?: ActivityDay[]
  year?: number
}

const heatmapTheme = {
  dark: [
    'rgba(255,255,255,0.04)',
    'rgba(56,189,248,0.22)',
    'rgba(56,189,248,0.50)',
    '#38bdf8',
    '#0ea5e9',
  ],
}

const labels = {
  months: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  weekdays: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  legend: {
    less: 'Menos',
    more: 'Mas',
  },
}

function getActivityLevel(count: number) {
  if (count === 0) return 0
  if (count <= 2) return 1
  if (count <= 5) return 2
  if (count <= 10) return 3
  return 4
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

function buildYearCalendar(activityDays: ActivityDay[], year: number): ActivityDay[] {
  const activityByDate = new Map(activityDays.map((day) => [day.date, day]))
  const start = new Date(Date.UTC(year, 0, 1))
  const end = new Date(Date.UTC(year + 1, 0, 1))
  const days: ActivityDay[] = []

  for (const date = new Date(start); date < end; date.setUTCDate(date.getUTCDate() + 1)) {
    const dateKey = date.toISOString().slice(0, 10)
    days.push(activityByDate.get(dateKey) ?? { date: dateKey, count: 0, accepted: 0 })
  }

  return days
}

export function ActivityHeatmap({
  activityDays,
  year = new Date().getFullYear(),
}: ActivityHeatmapProps) {
  const fallbackData = useActivityHeatmapData()
  const sourceData = activityDays ? buildYearCalendar(activityDays, year) : fallbackData
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
        <header className={`mb-3 flex flex-col gap-3 pb-3 md:flex-row md:items-center md:justify-between ${profileDividerClassName}`}>
          <div>
            <h2 className="font-display text-xl font-bold text-[var(--color-text)]">
              Actividad
            </h2>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              <span className="font-mono font-bold text-[var(--color-text)]">{totalSubmissions}</span> envios
              <span className="text-[var(--color-text-subtle)]"> · </span>
              <span className="font-mono font-bold text-[var(--color-text)]">{activeDays}</span> dias activos
              <span className="text-[var(--color-text-subtle)]"> · </span>
              racha maxima de <span className="font-mono font-bold text-[var(--color-text)]">{maxStreak}</span> dias
            </p>
          </div>

          <button className={`inline-flex min-h-10 w-fit items-center gap-2 rounded-lg px-3 text-sm font-semibold text-[var(--color-text-soft)] ${profileInteractiveSurfaceClassName}`}>
            {year === new Date().getFullYear() ? 'Año actual' : year}
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </button>
        </header>

        <div className="w-full overflow-x-auto pb-1">
          <div className="min-w-max">
            <ActivityCalendar
              data={data}
              blockSize={10}
              blockMargin={3}
              blockRadius={3}
              colorScheme="dark"
              fontSize={10}
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
            <span>Menos</span>
            {[0, 1, 3, 6, 11].map((count) => (
              <span
                key={count}
                className="h-3 w-3 rounded-[3px] border border-[rgba(255,255,255,0.06)]"
                style={{ backgroundColor: getHeatmapColor(count) }}
                aria-hidden="true"
              />
            ))}
            <span>Mas</span>
          </div>
        </div>
      </div>
    </UserCard>
  )
}
