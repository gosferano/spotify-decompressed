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

  constructor(
    connectionCountry = '',
    episodeName = '',
    episodeShowName = '',
    isIncognitoMode = false,
    ipAddress = '',
    albumName = '',
    albumArtistName = '',
    trackName = '',
    msPlayed = 0,
    isOffline = false,
    offlineTimestamp = 0,
    platform = '',
    reasonEnd = '',
    reasonStart = '',
    isShuffle = false,
    isSkipped = false,
    spotifyEpisodeUri = '',
    spotifyTrackUri = '',
    timestamp: Date = new Date(),
    userAgent = '',
    username: string
  ) {
    this.ConnectionCountry = connectionCountry
    this.EpisodeName = episodeName
    this.EpisodeShowName = episodeShowName
    this.IsIncognitoMode = isIncognitoMode
    this.IpAddress = ipAddress
    this.AlbumName = albumName
    this.AlbumArtistName = albumArtistName
    this.TrackName = trackName
    this.MsPlayed = msPlayed
    this.IsOffline = isOffline
    this.OfflineTimestamp = offlineTimestamp
    this.Platform = platform
    this.ReasonEnd = reasonEnd
    this.ReasonStart = reasonStart
    this.IsShuffle = isShuffle
    this.IsSkipped = isSkipped
    this.SpotifyEpisodeUri = spotifyEpisodeUri
    this.SpotifyTrackUri = spotifyTrackUri
    this.Timestamp = timestamp
    this.UserAgent = userAgent
    this.Username = username
  }

  public static FromJson(value: {
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
    return new SpotifyHistoryEntry(
      value.conn_country,
      value.episode_name,
      value.episode_show_name,
      value.incognito_mode,
      value.ip_addr_decrypted,
      value.master_metadata_album_album_name,
      value.master_metadata_album_artist_name,
      value.master_metadata_track_name,
      value.ms_played,
      value.offline,
      value.offline_timestamp,
      value.platform,
      value.reason_end,
      value.reason_start,
      value.shuffle,
      value.skipped,
      value.spotify_episode_uri,
      value.spotify_track_uri,
      new Date(value.ts),
      value.user_agent_decrypted,
      value.username
    )
  }
}
