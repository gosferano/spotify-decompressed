import JSZip from 'jszip'

// Shape of one entry in Spotify's extended streaming history JSON files
export type RawHistoryEntry = {
  ts: string
  platform: string
  ms_played: number
  conn_country: string
  ip_addr_decrypted: string
  user_agent_decrypted: string
  username: string
  master_metadata_track_name: string | null
  master_metadata_album_artist_name: string | null
  master_metadata_album_album_name: string | null
  spotify_track_uri: string | null
  episode_name: string | null
  episode_show_name: string | null
  spotify_episode_uri: string | null
  reason_start: string
  reason_end: string
  shuffle: boolean
  skipped: boolean | null
  offline: boolean
  offline_timestamp: number
  incognito_mode: boolean
}

export const rawEntry = (
  overrides: Partial<RawHistoryEntry> = {},
): RawHistoryEntry => ({
  ts: '2024-01-15T12:00:00Z',
  platform: 'linux',
  ms_played: 180000,
  conn_country: 'LT',
  ip_addr_decrypted: '',
  user_agent_decrypted: '',
  username: 'user',
  master_metadata_track_name: 'Track',
  master_metadata_album_artist_name: 'Artist',
  master_metadata_album_album_name: 'Album',
  spotify_track_uri: 'spotify:track:track1',
  episode_name: null,
  episode_show_name: null,
  spotify_episode_uri: null,
  reason_start: 'trackdone',
  reason_end: 'trackdone',
  shuffle: false,
  skipped: false,
  offline: false,
  offline_timestamp: 0,
  incognito_mode: false,
  ...overrides,
})

export const buildZip = async (
  files: Record<string, unknown>,
): Promise<ArrayBuffer> => {
  const zip = new JSZip()
  for (const [path, content] of Object.entries(files)) {
    zip.file(
      path,
      typeof content === 'string' ? content : JSON.stringify(content),
    )
  }
  return await zip.generateAsync({ type: 'arraybuffer' })
}
