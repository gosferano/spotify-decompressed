import type { SpotifyHistoryEntriesContainer } from './spotifyHistoryEntriesContainer'
import type SpotifyHistoryEntry from './spotifyHistoryEntry'

export default class SpotifyHistoryAlbumStats implements SpotifyHistoryEntriesContainer {
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

  get Key() {
    return JSON.stringify([this.ArtistName, this.AlbumName])
  }

  GetFullName = () => {
    return `${this.AlbumName} by ${this.ArtistName}`
  }
}
