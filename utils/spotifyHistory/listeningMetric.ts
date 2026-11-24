import type { SortBy } from './SpotifyHistoryFilter'
import type { ListeningTotals } from './dailyListening'
import { msToText } from '~/utils/helpers'

// Whole plays or whole minutes, at least one for anything played
export const getMetricValue = (totals: ListeningTotals, sortBy: SortBy) =>
  sortBy === 'count'
    ? totals.count
    : totals.count && Math.max(1, Math.round(totals.msPlayed / 60_000))

export const playsToText = (count: number) =>
  `${count} ${count === 1 ? 'play' : 'plays'}`

export const metricToText = (totals: ListeningTotals, sortBy: SortBy) =>
  sortBy === 'count' ? playsToText(totals.count) : msToText(totals.msPlayed)

export const dateToText = (date: Date, weekday = false) =>
  date.toLocaleDateString('en-GB', {
    weekday: weekday ? 'short' : undefined,
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
