export default class SpotifyHistoryEntry {
  ConnectionCountry: string
  EpisodeName: string
  EpisodeShowName: string
  IsIncognitoMode: boolean
  IpAddress: string
  AlbumName: string
  AlbumArtistName: string
  TrackName: string
  MsPlayed: number
  IsOffline: any
  OfflineTimestamp: number
  Platform: any
  ReasonEnd: any
  ReasonStart: string
  IsShuffle: boolean
  IsSkipped: boolean
  SpotifyEpisodeUri: string
  SpotifyTrackUri: string
  Timestamp: Date
  UserAgent: string
  Username: string

  constructor(value: {
    conn_country: string
    episode_name: string
    episode_show_name: string
    incognito_mode: boolean
    ip_addr_decrypted: string
    master_metadata_album_album_name: string
    master_metadata_album_artist_name: string
    master_metadata_track_name: string
    ms_played: number
    offline: boolean
    offline_timestamp: number
    platform: string
    reason_end: string
    reason_start: string
    shuffle: boolean
    skipped: boolean
    spotify_episode_uri: string
    spotify_track_uri: string
    ts: number
    user_agent_decrypted: string
    username: string
  }) {
    this.ConnectionCountry = value.conn_country
    this.EpisodeName = value.episode_name
    this.EpisodeShowName = value.episode_show_name
    this.IsIncognitoMode = value.incognito_mode
    this.IpAddress = value.ip_addr_decrypted
    this.AlbumName = value.master_metadata_album_album_name
    this.AlbumArtistName = value.master_metadata_album_artist_name
    this.TrackName = value.master_metadata_track_name
    this.MsPlayed = value.ms_played
    this.IsOffline = value.offline
    this.OfflineTimestamp = value.offline_timestamp
    this.Platform = value.platform
    this.ReasonEnd = value.reason_end
    this.ReasonStart = value.reason_start
    this.IsShuffle = value.shuffle
    this.IsSkipped = value.skipped
    this.SpotifyEpisodeUri = value.spotify_episode_uri
    this.SpotifyTrackUri = value.spotify_track_uri
    this.Timestamp = new Date(value.ts)
    this.UserAgent = value.user_agent_decrypted
    this.Username = value.username
  }
}
