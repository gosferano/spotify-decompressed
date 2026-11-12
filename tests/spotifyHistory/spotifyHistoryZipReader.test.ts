import { describe, expect, it } from 'vitest'
import { buildZip, rawEntry } from './fixtures'
import SpotifyHistoryZipReader from '~/utils/spotifyHistory/spotifyHistoryZipReader'

const reader = new SpotifyHistoryZipReader()

describe('SpotifyHistoryZipReader', () => {
  it('returns empty history for a null file', async () => {
    const history = await reader.parseExtendedHistory(null)

    expect(history.Entries).toEqual([])
  })

  it('reads the current "Spotify Extended Streaming History" layout', async () => {
    const zip = await buildZip({
      'Spotify Extended Streaming History/Streaming_History_Audio_2023-2024_0.json':
        [rawEntry({ spotify_track_uri: 'spotify:track:a' })],
      'Spotify Extended Streaming History/Streaming_History_Audio_2024_1.json':
        [
          rawEntry({ spotify_track_uri: 'spotify:track:b' }),
          rawEntry({ spotify_track_uri: 'spotify:track:c' }),
        ],
    })

    const history = await reader.parseExtendedHistory(zip)

    expect(history.Entries.map((e) => e.SpotifyTrackUri).sort()).toEqual([
      'spotify:track:a',
      'spotify:track:b',
      'spotify:track:c',
    ])
  })

  it('reads the older "MyData" layout', async () => {
    const zip = await buildZip({
      'MyData/endsong_0.json': [rawEntry(), rawEntry()],
    })

    const history = await reader.parseExtendedHistory(zip)

    expect(history.Entries).toHaveLength(2)
  })

  it('ignores files outside the history folders and non-JSON files', async () => {
    const zip = await buildZip({
      'Spotify Extended Streaming History/Streaming_History_Audio_2024.json': [
        rawEntry(),
      ],
      'Spotify Extended Streaming History/ReadMeFirst_ExtendedStreamingHistory.pdf':
        'not json',
      'Other/Streaming_History_Audio_2024.json': [rawEntry()],
      'Streaming_History_Audio_2024.json': [rawEntry()],
    })

    const history = await reader.parseExtendedHistory(zip)

    expect(history.Entries).toHaveLength(1)
  })

  it('maps raw JSON fields onto entries', async () => {
    const zip = await buildZip({
      'Spotify Extended Streaming History/Streaming_History_Audio_2024.json': [
        rawEntry({
          ts: '2024-03-01T08:30:00Z',
          ms_played: 1234,
          master_metadata_track_name: 'Song',
          master_metadata_album_artist_name: 'Band',
          master_metadata_album_album_name: 'Record',
          spotify_track_uri: 'spotify:track:xyz',
          reason_end: 'fwdbtn',
          skipped: true,
        }),
      ],
    })

    const { Entries } = await reader.parseExtendedHistory(zip)
    expect(Entries).toHaveLength(1)
    const entry = Entries[0]!

    expect(entry.Timestamp).toEqual(new Date('2024-03-01T08:30:00Z'))
    expect(entry.MsPlayed).toBe(1234)
    expect(entry.TrackName).toBe('Song')
    expect(entry.AlbumArtistName).toBe('Band')
    expect(entry.AlbumName).toBe('Record')
    expect(entry.SpotifyTrackUri).toBe('spotify:track:xyz')
    expect(entry.ReasonEnd).toBe('fwdbtn')
    expect(entry.IsSkipped).toBe(true)
  })

  it('rejects a file that is not a zip archive', async () => {
    const notZip = new TextEncoder().encode('hello').buffer as ArrayBuffer

    await expect(reader.parseExtendedHistory(notZip)).rejects.toThrow()
  })
})
