export default class SpotifyHistoryAlbumStats {
  Name: string
  ArtistName: string
  Count: number
  MsPlayed: number
  Tracks: Map<string, string>

  constructor(
    name: string,
    artistName: string,
    count: number,
    msPlayed: number
  ) {
    this.Name = name
    this.ArtistName = artistName
    this.Count = count
    this.MsPlayed = msPlayed
    this.Tracks = new Map<string, string>()
  }
}
