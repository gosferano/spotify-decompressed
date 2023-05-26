export default class SpotifyHistoryArtistStats {
  Name: string
  TimesPlayed: number
  MsPlayed: number
  Tracks: Map<string, string>

  constructor(name: string, timesPlayed: number, msPlayed: number) {
    this.Name = name
    this.TimesPlayed = timesPlayed
    this.MsPlayed = msPlayed
    this.Tracks = new Map<string, string>()
  }
}
