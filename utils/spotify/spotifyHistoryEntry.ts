export default class SpotifyHistoryEntry {
  public readonly Id: string
  constructor(
    public readonly ConnectionCountry: string = '',
    public readonly EpisodeName: string = '',
    public readonly EpisodeShowName: string = '',
    public readonly IsIncognitoMode: boolean = false,
    public readonly IpAddress: string = '',
    public readonly AlbumName: string = '',
    public readonly AlbumArtistName: string = '',
    public readonly TrackName: string = '',
    public readonly MsPlayed: number = 0,
    public readonly IsOffline: any = false,
    public readonly OfflineTimestamp: number = 0,
    public readonly Platform: any = '',
    public readonly ReasonEnd: any = '',
    public readonly ReasonStart: string = '',
    public readonly IsShuffle: boolean = false,
    public readonly IsSkipped: boolean = false,
    public readonly SpotifyEpisodeUri: string = '',
    public readonly SpotifyTrackUri: string = '',
    public readonly Timestamp: Date = new Date(),
    public readonly UserAgent: string = '',
    public readonly Username: string = ''
  ) {
    this.Id =
      this.SpotifyTrackUri +
      this.SpotifyEpisodeUri +
      '_' +
      this.Timestamp.valueOf()
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
