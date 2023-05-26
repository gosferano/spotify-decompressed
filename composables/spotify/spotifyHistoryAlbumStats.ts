export default class SpotifyHistoryAlbumStats {
  Name: string
  ArtistName: string
  MsPlayed: number
  Tracks: Map<string, string>

  constructor(name: string, artistName: string, msPlayed: number) {
    this.Name = name
    this.ArtistName = artistName
    this.MsPlayed = msPlayed
    this.Tracks = new Map<string, string>()
  }
}
