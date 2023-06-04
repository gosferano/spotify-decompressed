import SpotifyHistoryEntriesContainer from './spotifyHistoryEntriesContainer'
import SpotifyHistoryEntry from './spotifyHistoryEntry'

export default class SpotifyHistoryArtistStats
  implements SpotifyHistoryEntriesContainer
{
  Tracks: Set<string>
  Entries: Set<SpotifyHistoryEntry>
  AlbumName = undefined
  TrackName = undefined

  constructor(
    public ArtistName: string,
    public Count: number,
    public MsPlayed: number
  ) {
    this.Tracks = new Set<string>()
    this.Entries = new Set<SpotifyHistoryEntry>()
  }

  GetFullName = () => {
    return `${this.ArtistName}`
  }
}
