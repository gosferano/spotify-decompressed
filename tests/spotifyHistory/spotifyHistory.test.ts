import { describe, expect, it } from 'vitest'
import { rawEntry, type RawHistoryEntry } from './fixtures'
import SpotifyHistory from '~/utils/spotifyHistory/spotifyHistory'
import SpotifyHistoryEntry from '~/utils/spotifyHistory/spotifyHistoryEntry'
import SpotifyHistoryFilter from '~/utils/spotifyHistory/SpotifyHistoryFilter'

const historyOf = (...entries: Partial<RawHistoryEntry>[]) =>
  new SpotifyHistory(
    // FromJson is typed for non-null fields; real exports contain nulls
    entries.map((e) => SpotifyHistoryEntry.FromJson(rawEntry(e) as any)),
  )

const allTime: [Date, Date] = [
  new Date('2000-01-01T00:00:00Z'),
  new Date('2100-01-01T00:00:00Z'),
]

describe('SpotifyHistory', () => {
  describe('date range', () => {
    it('spans the earliest and latest entry', () => {
      const history = historyOf(
        { ts: '2024-05-01T00:00:00Z' },
        { ts: '2023-01-01T10:00:00Z' },
        { ts: '2024-12-31T23:59:59Z' },
      )

      expect(history.DateFrom).toEqual(new Date('2023-01-01T10:00:00Z'))
      expect(history.DateTo).toEqual(new Date('2024-12-31T23:59:59Z'))
    })

    it('is not inverted for an empty history', () => {
      const history = new SpotifyHistory([])

      expect(history.DateFrom.valueOf()).toBe(history.DateTo.valueOf())
    })

    it('handles histories too large to spread into function arguments', () => {
      const entries = Array.from({ length: 300_000 }, (_, i) =>
        SpotifyHistoryEntry.FromJson(
          rawEntry({
            ts: new Date(Date.UTC(2020, 0, 1) + i * 60_000).toISOString(),
          }) as any,
        ),
      )

      const history = new SpotifyHistory(entries)

      expect(history.DateFrom).toEqual(new Date('2020-01-01T00:00:00Z'))
      expect(history.DateTo).toEqual(
        new Date(Date.UTC(2020, 0, 1) + 299_999 * 60_000),
      )
    })
  })

  describe('getAllDistinctTrackIds', () => {
    it('returns each track id once and skips episodes', () => {
      const history = historyOf(
        { spotify_track_uri: 'spotify:track:a' },
        { spotify_track_uri: 'spotify:track:a' },
        { spotify_track_uri: 'spotify:track:b' },
        {
          spotify_track_uri: null,
          spotify_episode_uri: 'spotify:episode:e',
        },
      )

      expect(history.getAllDistinctTrackIds().sort()).toEqual(['a', 'b'])
    })
  })

  describe('getStats', () => {
    it('only counts entries within the date range, inclusive', () => {
      const history = historyOf(
        { ts: '2024-01-01T00:00:00Z', ms_played: 1 },
        { ts: '2024-01-15T00:00:00Z', ms_played: 10 },
        { ts: '2024-01-31T00:00:00Z', ms_played: 100 },
        { ts: '2024-02-01T00:00:00Z', ms_played: 1000 },
      )

      const stats = history.getStats(
        new SpotifyHistoryFilter([
          new Date('2024-01-15T00:00:00Z'),
          new Date('2024-01-31T00:00:00Z'),
        ]),
      )

      expect(stats.global.MsPlayed).toBe(110)
      expect(stats.global.TimesPlayed).toBe(2)
    })

    it('excludes plays that did not end with "trackdone" unless skipped plays are included', () => {
      const history = historyOf(
        { reason_end: 'trackdone', ms_played: 1 },
        { reason_end: 'fwdbtn', ms_played: 10 },
        { reason_end: 'endplay', ms_played: 100 },
      )

      const withoutSkipped = history.getStats(
        new SpotifyHistoryFilter(allTime, 'duration', false),
      )
      const withSkipped = history.getStats(
        new SpotifyHistoryFilter(allTime, 'duration', true),
      )

      expect(withoutSkipped.global.MsPlayed).toBe(1)
      expect(withSkipped.global.MsPlayed).toBe(111)
    })

    it('ignores entries without track, artist or album (e.g. podcast episodes)', () => {
      const history = historyOf(
        { ms_played: 1 },
        {
          ms_played: 10,
          spotify_track_uri: null,
          master_metadata_track_name: null,
          master_metadata_album_artist_name: null,
          master_metadata_album_album_name: null,
          spotify_episode_uri: 'spotify:episode:e',
        },
      )

      const stats = history.getStats(new SpotifyHistoryFilter(allTime))

      expect(stats.global.MsPlayed).toBe(1)
      expect(stats.global.TimesPlayed).toBe(1)
    })

    it('aggregates plays per track, artist and album', () => {
      const history = historyOf(
        {
          spotify_track_uri: 'spotify:track:a1',
          master_metadata_album_artist_name: 'A',
          master_metadata_album_album_name: 'A album',
          ms_played: 100,
        },
        {
          spotify_track_uri: 'spotify:track:a1',
          master_metadata_album_artist_name: 'A',
          master_metadata_album_album_name: 'A album',
          ms_played: 50,
        },
        {
          spotify_track_uri: 'spotify:track:a2',
          master_metadata_album_artist_name: 'A',
          master_metadata_album_album_name: 'A album',
          ms_played: 30,
        },
        {
          spotify_track_uri: 'spotify:track:b1',
          master_metadata_album_artist_name: 'B',
          master_metadata_album_album_name: 'B album',
          ms_played: 20,
        },
      )

      const stats = history.getStats(new SpotifyHistoryFilter(allTime))

      expect(stats.global).toMatchObject({
        MsPlayed: 200,
        TimesPlayed: 4,
        TotalTracks: 3,
        TotalArtists: 2,
        TotalAlbums: 2,
      })

      const trackA1 = stats.tracks.find(
        (t) => t.SpotifyTrackUri === 'spotify:track:a1',
      )!
      expect(trackA1.Count).toBe(2)
      expect(trackA1.MsPlayed).toBe(150)

      const artistA = stats.artists.find((a) => a.ArtistName === 'A')!
      expect(artistA.Count).toBe(3)
      expect(artistA.MsPlayed).toBe(180)
      expect(artistA.Tracks.size).toBe(2)

      const albumA = stats.albums.find((a) => a.AlbumName === 'A album')!
      expect(albumA.ArtistName).toBe('A')
      expect(albumA.Count).toBe(3)
      expect(albumA.Tracks.size).toBe(2)
    })

    it('keeps same-named albums by different artists apart', () => {
      const history = historyOf(
        {
          spotify_track_uri: 'spotify:track:a',
          master_metadata_album_artist_name: 'Artist A',
          master_metadata_album_album_name: 'Greatest Hits',
          ms_played: 100,
        },
        {
          spotify_track_uri: 'spotify:track:b',
          master_metadata_album_artist_name: 'Artist B',
          master_metadata_album_album_name: 'Greatest Hits',
          ms_played: 10,
        },
      )

      const stats = history.getStats(new SpotifyHistoryFilter(allTime))

      expect(stats.global.TotalAlbums).toBe(2)
      expect(
        stats.albums.map((a) => [a.ArtistName, a.AlbumName, a.MsPlayed]),
      ).toEqual([
        ['Artist A', 'Greatest Hits', 100],
        ['Artist B', 'Greatest Hits', 10],
      ])
    })

    it('sorts by total duration or by play count', () => {
      // "long" is played once for a long time, "short" three times briefly
      const history = historyOf(
        {
          spotify_track_uri: 'spotify:track:long',
          master_metadata_album_artist_name: 'Long artist',
          master_metadata_album_album_name: 'Long album',
          ms_played: 1000,
        },
        ...Array.from({ length: 3 }, () => ({
          spotify_track_uri: 'spotify:track:short',
          master_metadata_album_artist_name: 'Short artist',
          master_metadata_album_album_name: 'Short album',
          ms_played: 10,
        })),
      )

      const byDuration = history.getStats(
        new SpotifyHistoryFilter(allTime, 'duration'),
      )
      const byCount = history.getStats(
        new SpotifyHistoryFilter(allTime, 'count'),
      )

      expect(byDuration.tracks.map((t) => t.SpotifyTrackUri)).toEqual([
        'spotify:track:long',
        'spotify:track:short',
      ])
      expect(byDuration.artists[0].ArtistName).toBe('Long artist')
      expect(byDuration.albums[0].AlbumName).toBe('Long album')

      expect(byCount.tracks.map((t) => t.SpotifyTrackUri)).toEqual([
        'spotify:track:short',
        'spotify:track:long',
      ])
      expect(byCount.artists[0].ArtistName).toBe('Short artist')
      expect(byCount.albums[0].AlbumName).toBe('Short album')
    })
  })
})
