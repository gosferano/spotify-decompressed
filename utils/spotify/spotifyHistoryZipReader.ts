import jszip from 'jszip'
import SpotifyHistoryEntry from './spotifyHistoryEntry'
import SpotifyHistory from '~/utils/spotify/spotifyHistory'

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
    const historyEntryListPromises = Object.keys(archive.files)
      .filter(
        (fileName: string) =>
          fileName.startsWith('MyData/') && fileName.endsWith('.json'),
      )
      .map(async function (filename) {
        const contentAsText = await archive.files[filename].async('string')
        return JSON.parse(contentAsText)
      })
    const historyEntryLists = await Promise.all(historyEntryListPromises)
    return historyEntryLists
      .flat()
      .map((entry) => SpotifyHistoryEntry.FromJson(entry))
  }
}
