export default class SpotifyHistoryTrackStats {
  SpotifyTrackUri: string
  TrackName: string
  AlbumArtistName: string
  TimesPlayed: number
  MsPlayed: number

  constructor(
    spotifyTrackUri: string,
    trackName: string,
    albumArtistName: string,
    timesPlayed: number,
    msPlayed: number
  ) {
    this.SpotifyTrackUri = spotifyTrackUri
    this.TrackName = trackName
    this.AlbumArtistName = albumArtistName
    this.TimesPlayed = timesPlayed
    this.MsPlayed = msPlayed
  }
}
