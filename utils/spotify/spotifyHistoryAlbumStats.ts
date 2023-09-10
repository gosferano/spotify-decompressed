import SpotifyHistoryEntriesContainer from './spotifyHistoryEntriesContainer'
import SpotifyHistoryEntry from './spotifyHistoryEntry'

export default class SpotifyHistoryAlbumStats
  implements SpotifyHistoryEntriesContainer
{
  Tracks: Set<string>
  Entries: Set<SpotifyHistoryEntry>
  TrackName = undefined

  constructor(
    public AlbumName: string,
    public ArtistName: string,
    public Count: number,
    public MsPlayed: number,
  ) {
    this.Tracks = new Set<string>()
    this.Entries = new Set<SpotifyHistoryEntry>()
  }

  GetFullName = () => {
    return `${this.AlbumName} by ${this.ArtistName}`
  }
}
