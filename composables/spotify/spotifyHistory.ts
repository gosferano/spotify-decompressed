import SpotifyHistoryAlbumStats from './spotifyHistoryAlbumStats'
import SpotifyHistoryArtistStats from './spotifyHistoryArtistStats'
import SpotifyHistoryEntry from './spotifyHistoryEntry'
import SpotifyHistoryGlobalStats from './spotifyHistoryGlobalStats'
import SpotifyHistoryTrackStats from './spotifyHistoryTrackStats'

export default class SpotifyHistory {
  readonly Entries: SpotifyHistoryEntry[]
  readonly DateFrom: Date
  readonly DateTo: Date

  constructor(entries: Array<SpotifyHistoryEntry>) {
    this.Entries = entries
    const dates = this.getDateRange()
    this.DateFrom = dates[0]
    this.DateTo = dates[1]
  }

  getGlobalStats(from: Date, to: Date): SpotifyHistoryGlobalStats {
    let msPlayed = 0
    let timesPlayed = 0
    const tracks = new Map()
    const artists = new Map()
    const albums = new Map()
    // const musicDates = new Set<number>()

    this.Entries.forEach((entry) => {
      if (entry.Timestamp < from || entry.Timestamp > to) {
        return
      }

      msPlayed += entry.MsPlayed
      if (entry.SpotifyTrackUri) {
        tracks.set(entry.SpotifyTrackUri, 0)
        artists.set(entry.AlbumArtistName, 0)
        albums.set(entry.AlbumName, 0)
        timesPlayed += 1
      }
    })

    return new SpotifyHistoryGlobalStats(
      msPlayed,
      timesPlayed,
      tracks.size,
      artists.size,
      albums.size
    )
  }

  getTrackStats(from: Date, to: Date): Array<SpotifyHistoryTrackStats> {
    const entriesByTrack: Map<string, SpotifyHistoryTrackStats> = new Map<
      string,
      SpotifyHistoryTrackStats
    >()

    this.Entries.forEach((entry) => {
      if (entry.Timestamp < from || entry.Timestamp > to) {
        return
      }

      const trackUri: string = entry.SpotifyTrackUri
      if (!trackUri) return

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

      const existingEntry = entriesByTrack.get(trackUri)
      existingEntry!.MsPlayed += entry.MsPlayed
      existingEntry!.TimesPlayed += 1
    })

    return Array.from(entriesByTrack.values()).sort(
      (a, b) => -a.MsPlayed + b.MsPlayed
    )
  }

  getArtistStats(from: Date, to: Date): Array<SpotifyHistoryArtistStats> {
    const entriesByArtist: Map<string, SpotifyHistoryArtistStats> = new Map<
      string,
      SpotifyHistoryArtistStats
    >()

    this.Entries.forEach((entry) => {
      if (entry.Timestamp < from || entry.Timestamp > to) {
        return
      }

      const artistName: string = entry.AlbumArtistName

      if (!artistName) return

      if (!entriesByArtist.has(artistName)) {
        entriesByArtist.set(
          artistName,
          new SpotifyHistoryArtistStats(artistName, 0, 0)
        )
      }

      const existingEntry = entriesByArtist.get(artistName)!
      existingEntry.MsPlayed += entry.MsPlayed
      existingEntry.TimesPlayed += 1
      existingEntry.Tracks.set(entry.SpotifyTrackUri, entry.TrackName)
    })

    return Array.from(entriesByArtist.values()).sort(
      (a, b) => -a.MsPlayed + b.MsPlayed
    )
  }

  getAlbumStats(from: Date, to: Date): Array<SpotifyHistoryAlbumStats> {
    const entriesByAlbum: Map<string, SpotifyHistoryAlbumStats> = new Map<
      string,
      SpotifyHistoryAlbumStats
    >()

    this.Entries.forEach((entry) => {
      if (entry.Timestamp < from || entry.Timestamp > to) {
        return
      }

      const albumName: string = entry.AlbumName

      if (!albumName) return

      if (!entriesByAlbum.has(albumName)) {
        entriesByAlbum.set(
          albumName,
          new SpotifyHistoryAlbumStats(albumName, entry.AlbumArtistName, 0)
        )
      }

      const existingEntry = entriesByAlbum.get(albumName)!
      existingEntry.MsPlayed += entry.MsPlayed
      existingEntry.Tracks.set(entry.SpotifyTrackUri, entry.TrackName)
    })

    return Array.from(entriesByAlbum.values()).sort(
      (a, b) => -a.MsPlayed + b.MsPlayed
    )
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
