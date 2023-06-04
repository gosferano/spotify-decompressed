import { acceptHMRUpdate, defineStore } from 'pinia'
import SpotifyHistory from '~/utils/spotify/spotifyHistory'
import SpotifyHistoryEntry from '~/utils/spotify/spotifyHistoryEntry'

export const useSpotifyHistoryStore = defineStore('spotifyHistoryStore', () => {
  const spotifyHistory = ref<SpotifyHistory | null>(null)
  const localForage = useLocalForage().createInstance({
    name: 'spotify-decompressed',
    storeName: 'spotifyExtendedHistory',
  })
  const spotifyHistoryEntriesKey = 'spotifyHistoryEntries'

  const getHistoryFileFromLocalForage = async () => {
    const historyEntries = await localForage.getItem<SpotifyHistoryEntry[]>(
      spotifyHistoryEntriesKey
    )

    if (!historyEntries) {
      return null
    }

    return new SpotifyHistory(historyEntries)
  }

  const clearHistory = async () => {
    spotifyHistory.value = null
    await localForage.removeItem(spotifyHistoryEntriesKey)
  }

  const getHistory = async () => {
    if (spotifyHistory.value) {
      return spotifyHistory.value
    }

    const storedSpotifyHistory = await getHistoryFileFromLocalForage()
    if (storedSpotifyHistory) {
      spotifyHistory.value = storedSpotifyHistory as SpotifyHistory
      return storedSpotifyHistory
    }

    return null
  }

  const setHistory = async (value: SpotifyHistory) => {
    spotifyHistory.value = value
    await localForage.setItem<SpotifyHistoryEntry[]>(
      spotifyHistoryEntriesKey,
      value.Entries
    )
  }

  return {
    spotifyHistory,
    clearHistory,
    setHistory,
    getHistory,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(
    acceptHMRUpdate(useSpotifyHistoryStore, import.meta.hot)
  )
