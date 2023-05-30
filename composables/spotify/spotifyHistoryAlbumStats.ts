export default class SpotifyHistoryAlbumStats {
  Tracks: Map<string, string>

  constructor(
    public Name: string,
    public ArtistName: string,
    public Count: number,
    public MsPlayed: number
  ) {
    this.Tracks = new Map<string, string>()
  }
}
