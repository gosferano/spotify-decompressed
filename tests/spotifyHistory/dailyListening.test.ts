import { describe, expect, it } from 'vitest'
import { rawEntry, toEntry, type RawHistoryEntry } from './fixtures'
import {
  getCalendarDays,
  getDayTracks,
  getLevel,
  getLevelThresholds,
  getListeningDays,
  getListeningYears,
  toDayKey,
} from '~/utils/spotifyHistory/dailyListening'

// Local time, so the tests hold in any time zone
const playAt = (
  [year, month, day, hour = 12]: [number, number, number, number?],
  overrides: Partial<RawHistoryEntry> = {},
) =>
  toEntry(
    rawEntry({
      ts: new Date(year, month - 1, day, hour).toISOString(),
      ...overrides,
    }),
  )

describe('getListeningDays', () => {
  it('groups plays by local day, in order', () => {
    const days = getListeningDays([
      playAt([2024, 3, 2, 0], { ms_played: 1000 }),
      playAt([2024, 3, 1, 23], { ms_played: 2000 }),
      playAt([2024, 3, 2, 23], { ms_played: 3000 }),
    ])

    expect([...days.keys()]).toEqual(['2024-03-01', '2024-03-02'])
    expect(days.get('2024-03-01')).toMatchObject({ count: 1, msPlayed: 2000 })
    expect(days.get('2024-03-02')).toMatchObject({ count: 2, msPlayed: 4000 })
  })

  it('is empty without plays', () => {
    expect(getListeningDays([]).size).toBe(0)
  })
})

describe('getListeningYears', () => {
  it('totals each year and keeps silent ones in between', () => {
    const years = getListeningYears(
      getListeningDays([
        playAt([2021, 12, 31, 23], { ms_played: 1000 }),
        playAt([2023, 1, 1, 0], { ms_played: 2000 }),
        playAt([2023, 6, 1], { ms_played: 3000 }),
      ]),
    )

    expect(years).toEqual([
      { year: 2021, count: 1, msPlayed: 1000 },
      { year: 2022, count: 0, msPlayed: 0 },
      { year: 2023, count: 2, msPlayed: 5000 },
    ])
  })

  it('is empty without plays', () => {
    expect(getListeningYears(new Map())).toEqual([])
  })
})

describe('getDayTracks', () => {
  it('totals the tracks of a day, most played first', () => {
    const a = {
      spotify_track_uri: 'spotify:track:a',
      master_metadata_track_name: 'A',
      ms_played: 1000,
    }
    const b = {
      spotify_track_uri: 'spotify:track:b',
      master_metadata_track_name: 'B',
      ms_played: 1000,
    }
    const days = getListeningDays([
      playAt([2024, 1, 1, 1], a),
      playAt([2024, 1, 1, 2], b),
      playAt([2024, 1, 1, 3], b),
    ])

    expect(getDayTracks(days.get('2024-01-01')!)).toEqual([
      { uri: 'spotify:track:b', name: 'B', count: 2, msPlayed: 2000 },
      { uri: 'spotify:track:a', name: 'A', count: 1, msPlayed: 1000 },
    ])
  })
})

describe('levels', () => {
  it('spreads varied values over four levels', () => {
    const values = Array.from({ length: 100 }, (_, i) => i + 1)
    const thresholds = getLevelThresholds(values)

    expect(thresholds).toEqual([50, 80, 95])
    expect(
      [0, 1, 49, 50, 80, 95, 100].map((v) => getLevel(v, thresholds)),
    ).toEqual([0, 1, 1, 2, 3, 4, 4])
  })

  it('keeps the most common value on the first level when it is the lowest', () => {
    const thresholds = getLevelThresholds([1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 5])

    expect(thresholds).toEqual([2, 5])
    expect(getLevel(1, thresholds)).toBe(1)
    expect(getLevel(5, thresholds)).toBe(3)
  })

  it('has a single level when all days are alike', () => {
    expect(getLevelThresholds([3, 3, 3])).toEqual([])
    expect(getLevel(3, [])).toBe(1)
  })

  it('handles no values', () => {
    expect(getLevelThresholds([])).toEqual([])
  })
})

describe('getCalendarDays', () => {
  it('covers every day of the year once', () => {
    expect(getCalendarDays(2023)).toHaveLength(365)
    const leap = getCalendarDays(2024)
    expect(new Set(leap.map((d) => d.key)).size).toBe(366)
    expect(leap[0]!.key).toBe('2024-01-01')
    expect(leap.at(-1)!.key).toBe('2024-12-31')
  })

  it('places days in Monday-first weeks', () => {
    // 2024 starts on a Monday, 2023 on a Sunday
    expect(getCalendarDays(2024)[0]).toMatchObject({ week: 0, weekday: 0 })
    expect(getCalendarDays(2023)[0]).toMatchObject({ week: 0, weekday: 6 })
    expect(getCalendarDays(2023)[1]).toMatchObject({ week: 1, weekday: 0 })
  })

  it('uses the same keys as listening days', () => {
    expect(getCalendarDays(2024)[59]!.key).toBe(
      toDayKey(new Date(2024, 1, 29, 23, 59)),
    )
  })
})
