import SpotifyHistoryEntry from './spotifyHistoryEntry'

export type SpotifyHistoryEntriesContainer = {
  Entries: Set<SpotifyHistoryEntry>
  Tracks: Set<string>
  AlbumName: string | undefined
  ArtistName: string | undefined
  TrackName: string | undefined

  GetFullName: () => string
}
