import type SpotifyHistoryEntry from './spotifyHistoryEntry'

export type ListeningTotals = { count: number; msPlayed: number }
export type ListeningDay = ListeningTotals & {
  date: Date
  entries: SpotifyHistoryEntry[]
}
export type ListeningYear = ListeningTotals & { year: number }
export type TrackTotals = ListeningTotals & { uri: string; name: string }
export type CalendarDay = {
  key: string
  date: Date
  // Grid position: week column from the start of the year, Monday = 0
  week: number
  weekday: number
}

const LEVEL_QUANTILES = [0.5, 0.8, 0.95]

// Spotify's timestamps are UTC; days are the listener's local ones
export const toDayKey = (date: Date) =>
  [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-')

// Days with at least one play, in order, by day key
export const getListeningDays = (
  entries: Iterable<SpotifyHistoryEntry>,
): Map<string, ListeningDay> => {
  const days = new Map<string, ListeningDay>()
  const sorted = [...entries].sort(
    (a, b) => a.Timestamp.valueOf() - b.Timestamp.valueOf(),
  )

  for (const entry of sorted) {
    const key = toDayKey(entry.Timestamp)
    let day = days.get(key)
    if (!day) {
      const { Timestamp: t } = entry
      day = {
        date: new Date(t.getFullYear(), t.getMonth(), t.getDate()),
        count: 0,
        msPlayed: 0,
        entries: [],
      }
      days.set(key, day)
    }
    day.count += 1
    day.msPlayed += entry.MsPlayed
    day.entries.push(entry)
  }

  return days
}

// Every year from the first play to the last, including silent ones
export const getListeningYears = (
  days: Map<string, ListeningDay>,
): ListeningYear[] => {
  const years: ListeningYear[] = []
  for (const day of days.values()) {
    const year = day.date.getFullYear()
    let last = years.at(-1)
    while (!last || last.year < year) {
      last = { year: last ? last.year + 1 : year, count: 0, msPlayed: 0 }
      years.push(last)
    }
    last.count += day.count
    last.msPlayed += day.msPlayed
  }
  return years
}

export const getDayTracks = (day: ListeningDay): TrackTotals[] => {
  const tracks = new Map<string, TrackTotals>()
  for (const entry of day.entries) {
    const uri = entry.SpotifyTrackUri
    const track = tracks.get(uri) ?? {
      uri,
      name: entry.TrackName,
      count: 0,
      msPlayed: 0,
    }
    track.count += 1
    track.msPlayed += entry.MsPlayed
    tracks.set(uri, track)
  }
  return [...tracks.values()].sort(
    (a, b) => b.count - a.count || b.msPlayed - a.msPlayed,
  )
}

// Plays in each of the day's 24 hours
export const getDayHours = (day: ListeningDay): number[] => {
  const hours = Array.from({ length: 24 }, () => 0)
  for (const entry of day.entries) {
    hours[entry.Timestamp.getHours()]! += 1
  }
  return hours
}

// Lowest value of each level above the first. There are fewer levels when the
// values don't differ enough to fill them
export const getLevelThresholds = (values: number[]): number[] => {
  const sorted = [...values].sort((a, b) => a - b)
  const thresholds: number[] = []
  let previous = sorted[0] ?? 0

  for (const quantile of LEVEL_QUANTILES) {
    const atQuantile = sorted[Math.floor(quantile * (sorted.length - 1))] ?? 0
    const threshold = sorted.find((v) => v > previous && v >= atQuantile)
    if (threshold === undefined) break
    thresholds.push(threshold)
    previous = threshold
  }

  return thresholds
}

// 0 for no listening, then 1 and up
export const getLevel = (value: number, thresholds: number[]) =>
  value > 0 ? 1 + thresholds.filter((t) => value >= t).length : 0

export const getCalendarDays = (year: number): CalendarDay[] => {
  const days: CalendarDay[] = []
  const offset = (new Date(year, 0, 1).getDay() + 6) % 7
  for (let i = 0; ; i++) {
    // Through the calendar rather than by adding 24h, which daylight saving
    // would throw off
    const date = new Date(year, 0, 1 + i)
    if (date.getFullYear() !== year) return days
    days.push({
      key: toDayKey(date),
      date,
      week: Math.floor((i + offset) / 7),
      weekday: (i + offset) % 7,
    })
  }
}
