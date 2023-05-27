export default class SpotifyHistoryArtistStats {
  Name: string
  Count: number
  MsPlayed: number
  Tracks: Map<string, string>

  constructor(name: string, count: number, msPlayed: number) {
    this.Name = name
    this.Count = count
    this.MsPlayed = msPlayed
    this.Tracks = new Map<string, string>()
  }
}
