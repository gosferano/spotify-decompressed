export default class SpotifyHistoryTrackStats {
  SpotifyTrackUri: string
  TrackName: string
  AlbumArtistName: string
  Count: number
  MsPlayed: number

  constructor(
    spotifyTrackUri: string,
    trackName: string,
    albumArtistName: string,
    count: number,
    msPlayed: number
  ) {
    this.SpotifyTrackUri = spotifyTrackUri
    this.TrackName = trackName
    this.AlbumArtistName = albumArtistName
    this.Count = count
    this.MsPlayed = msPlayed
  }
}
