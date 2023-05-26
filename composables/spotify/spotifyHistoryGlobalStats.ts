export default class SpotifyHistoryGlobalStats {
  MsPlayed: number
  TimesPlayed: number
  TotalTracks: number
  TotalArtists: number
  TotalAlbums: number
  constructor(
    msPlayed = 0,
    timesPlayed = 0,
    totalTracks = 0,
    totalArtists = 0,
    totalAlbums = 0
  ) {
    this.MsPlayed = msPlayed
    this.TimesPlayed = timesPlayed
    this.TotalTracks = totalTracks
    this.TotalArtists = totalArtists
    this.TotalAlbums = totalAlbums
  }
}
