import SpotifyHistoryAlbumStats from './spotifyHistoryAlbumStats'
import SpotifyHistoryArtistStats from './spotifyHistoryArtistStats'
import SpotifyHistoryEntry from './spotifyHistoryEntry'
import SpotifyHistoryGlobalStats from './spotifyHistoryGlobalStats'
import SpotifyHistoryTrackStats from './spotifyHistoryTrackStats'

export default class SpotifyHistory {
  Entries: SpotifyHistoryEntry[]
  readonly DateFrom: Date
  readonly DateTo: Date

  constructor(
    entries: Array<SpotifyHistoryEntry> = new Array<SpotifyHistoryEntry>()
  ) {
    this.Entries = entries
    const dates = this.getDateRange()
    this.DateFrom = dates[0]
    this.DateTo = dates[1]
  }

  getStats(
    from: Date,
    to: Date,
    sortBy: 'count' | 'duration',
    includeSkipped: boolean
  ) {
    let totalMsStreamed = 0
    let totalCountStreamed = 0

    const entriesByTrack: Map<string, SpotifyHistoryTrackStats> = new Map<
      string,
      SpotifyHistoryTrackStats
    >()

    const entriesByArtist: Map<string, SpotifyHistoryArtistStats> = new Map<
      string,
      SpotifyHistoryArtistStats
    >()

    const entriesByAlbum: Map<string, SpotifyHistoryAlbumStats> = new Map<
      string,
      SpotifyHistoryAlbumStats
    >()

    this.Entries.forEach((entry) => {
      // Skip entries outside of the date range
      if (entry.Timestamp < from || entry.Timestamp > to) {
        return
      }

      // Skip entries that were skipped if includeSkipped is false
      if (!includeSkipped && entry.ReasonEnd !== 'trackdone') {
        return
      }

      const trackUri: string = entry.SpotifyTrackUri
      const artistName: string = entry.AlbumArtistName
      const albumName: string = entry.AlbumName
      if (!trackUri || !artistName || !albumName) return

      totalMsStreamed += entry.MsPlayed
      totalCountStreamed += 1

      // Collect track stats
      if (!entriesByTrack.has(trackUri)) {
        entriesByTrack.set(
          trackUri,
          new SpotifyHistoryTrackStats(
            trackUri,
            entry.TrackName,
            entry.AlbumArtistName,
            0,
            0
          )
        )
      }

      const existingTrackEntry = entriesByTrack.get(trackUri)!
      existingTrackEntry.MsPlayed += entry.MsPlayed
      existingTrackEntry.Count += 1

      // Collect artist stats
      if (!entriesByArtist.has(artistName)) {
        entriesByArtist.set(
          artistName,
          new SpotifyHistoryArtistStats(artistName, 0, 0)
        )
      }

      const existingArtistEntry = entriesByArtist.get(artistName)!
      existingArtistEntry.MsPlayed += entry.MsPlayed
      existingArtistEntry.Count += 1
      existingArtistEntry.Tracks.set(entry.SpotifyTrackUri, entry.TrackName)

      // Collect album stats
      if (!entriesByAlbum.has(albumName)) {
        entriesByAlbum.set(
          albumName,
          new SpotifyHistoryAlbumStats(albumName, entry.AlbumArtistName, 0, 0)
        )
      }

      const existingAlbumEntry = entriesByAlbum.get(albumName)!
      existingAlbumEntry.MsPlayed += entry.MsPlayed
      existingAlbumEntry.Count += 1
      existingAlbumEntry.Tracks.set(entry.SpotifyTrackUri, entry.TrackName)
    })

    const globalStats = new SpotifyHistoryGlobalStats(
      totalMsStreamed,
      totalCountStreamed,
      entriesByTrack.size,
      entriesByArtist.size,
      entriesByAlbum.size
    )

    return {
      global: globalStats,
      tracks:
        sortBy === 'count'
          ? Array.from(entriesByTrack.values()).sort(
              (a, b) => -a.Count + b.Count
            )
          : Array.from(entriesByTrack.values()).sort(
              (a, b) => -a.MsPlayed + b.MsPlayed
            ),
      artists:
        sortBy === 'count'
          ? Array.from(entriesByArtist.values()).sort(
              (a, b) => -a.Count + b.Count
            )
          : Array.from(entriesByArtist.values()).sort(
              (a, b) => -a.MsPlayed + b.MsPlayed
            ),
      albums:
        sortBy === 'count'
          ? Array.from(entriesByAlbum.values()).sort(
              (a, b) => -a.Count + b.Count
            )
          : Array.from(entriesByAlbum.values()).sort(
              (a, b) => -a.MsPlayed + b.MsPlayed
            ),
    }
  }

  getDateRange(): [Date, Date] {
    let minDate = new Date()
    let maxDate = new Date('1900-01-01')
    this.Entries.forEach((entry) => {
      const entryDate = new Date(entry.Timestamp)
      minDate = minDate < entryDate ? minDate : entryDate
      maxDate = maxDate > entryDate ? maxDate : entryDate
    })

    return [minDate, maxDate]
  }
}
