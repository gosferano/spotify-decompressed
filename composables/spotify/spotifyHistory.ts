import SpotifyHistoryEntry from './spotifyHistoryEntry'
import SpotifyHistoryGlobalStats from './spotifyHistoryGlobalStats'

export default class SpotifyHistory {
  Entries: SpotifyHistoryEntry[]

  constructor(entries: Array<SpotifyHistoryEntry>) {
    this.Entries = entries
  }

  getGlobalStats(): SpotifyHistoryGlobalStats {
    let msPlayed = 0
    const timesPlayed = this.Entries.length
    const tracks = new Map()
    const artists = new Map()
    const albums = new Map()

    this.Entries.forEach((entry) => {
      msPlayed += entry.MsPlayed
      if (entry.SpotifyTrackUri) {
        tracks.set(entry.SpotifyTrackUri, 0)
        artists.set(entry.AlbumArtistName, 0)
        albums.set(entry.AlbumName, 0)
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

  getTrackStats(): Array<any> {
    const entriesByTrack: Map<string, any> = new Map<string, any>()

    this.Entries.forEach((entry) => {
      const trackUri: string = entry.SpotifyTrackUri

      if (!trackUri) return

      if (!entriesByTrack.has(trackUri)) {
        entriesByTrack.set(trackUri, {
          SpotifyTrackUri: trackUri,
          TrackName: entry.TrackName,
          AlbumArtistName: entry.AlbumArtistName,
          TimesPlayed: 0,
          MsPlayed: 0,
        })
      }

      const existingEntry = entriesByTrack.get(trackUri)
      existingEntry.MsPlayed += entry.MsPlayed
      existingEntry.TimesPlayed += 1
    })

    return Array.from(entriesByTrack.values()).sort(
      (a, b) => -a.MsPlayed + b.MsPlayed
    )
  }

  getArtistStats(): Array<any> {
    const entriesByArtist: Map<string, any> = new Map<string, any>()

    this.Entries.forEach((entry) => {
      const artistName: string = entry.AlbumArtistName

      if (!artistName) return

      if (!entriesByArtist.has(artistName)) {
        entriesByArtist.set(artistName, {
          AlbumArtistName: artistName,
          TimesPlayed: 0,
          MsPlayed: 0,
        })
      }

      const existingEntry = entriesByArtist.get(artistName)
      existingEntry.MsPlayed += entry.MsPlayed
      existingEntry.TimesPlayed += 1
    })

    return Array.from(entriesByArtist.values()).sort(
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
