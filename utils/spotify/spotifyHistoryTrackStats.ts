import SpotifyHistoryEntry from './spotifyHistoryEntry'
import SpotifyHistoryEntriesContainer from './spotifyHistoryEntriesContainer'

export default class SpotifyHistoryTrackStats
  implements SpotifyHistoryEntriesContainer
{
  Tracks: Set<string>
  Entries: Set<SpotifyHistoryEntry>

  constructor(
    public readonly SpotifyTrackUri: string,
    public readonly TrackName: string,
    public readonly AlbumName: string,
    public readonly ArtistName: string,
    public Count: number,
    public MsPlayed: number,
  ) {
    this.Tracks = new Set<string>()
    this.Entries = new Set<SpotifyHistoryEntry>()
  }

  GetFullName = () => {
    return `${this.TrackName} by ${this.ArtistName} on ${this.AlbumName}`
  }
}
