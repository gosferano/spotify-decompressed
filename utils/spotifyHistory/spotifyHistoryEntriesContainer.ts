import type SpotifyHistoryEntry from './spotifyHistoryEntry'

export type SpotifyHistoryEntriesContainer = {
  // Unique within its toplist
  Key: string
  Entries: Set<SpotifyHistoryEntry>
  Tracks: Set<string>
  AlbumName: string | undefined
  ArtistName: string | undefined
  TrackName: string | undefined

  GetFullName: () => string
}
