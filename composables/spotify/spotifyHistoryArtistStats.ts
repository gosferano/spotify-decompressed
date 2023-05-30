export default class SpotifyHistoryArtistStats {
  Tracks: Map<string, string>

  constructor(
    public Name: string,
    public Count: number,
    public MsPlayed: number
  ) {
    this.Tracks = new Map<string, string>()
  }
}
