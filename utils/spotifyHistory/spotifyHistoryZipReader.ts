import jszip from 'jszip'
import SpotifyHistoryEntry from './spotifyHistoryEntry'
import SpotifyHistory from '~/utils/spotifyHistory/spotifyHistory'

export default class SpotifyHistoryZipReader {
  async parseExtendedHistory(
    file: ArrayBuffer | File | null,
  ): Promise<SpotifyHistory> {
    if (file == null) return new SpotifyHistory([])
    const archive = await jszip.loadAsync(file)
    const historyEntries = await this.getEntries(archive)
    return new SpotifyHistory(historyEntries)
  }

  async getEntries(archive: jszip): Promise<SpotifyHistoryEntry[]> {
    const historyEntryListPromises = Object.values(archive.files)
      .filter(
        (file) =>
          (file.name.startsWith('MyData/') ||
            file.name.startsWith('Spotify Extended Streaming History')) &&
          file.name.endsWith('.json'),
      )
      .map(async function (file) {
        const contentAsText = await file.async('string')
        return JSON.parse(contentAsText)
      })
    const historyEntryLists = await Promise.all(historyEntryListPromises)
    return historyEntryLists
      .flat()
      .map((entry) => SpotifyHistoryEntry.FromJson(entry))
  }
}
