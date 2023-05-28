import { acceptHMRUpdate, defineStore } from 'pinia'
import SpotifyHistory from '~/composables/spotify/spotifyHistory'

export const useSpotifyHistoryStore = defineStore('spotifyHistoryStore', () => {
  const spotifyHistory = ref<SpotifyHistory | null>(null)
  const localForage = useLocalForage()
  const spotifyHistoryKey = 'spotifyHistory'

  const getHistoryFileFromLocalForage = async () => {
    const history = await localForage.getItem<SpotifyHistory>(spotifyHistoryKey)

    if (!history) {
      return null
    }

    return new SpotifyHistory(history.Entries)
  }

  const clearHistory = async () => {
    spotifyHistory.value = null
    await localForage.removeItem(spotifyHistoryKey)
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
    await localForage.setItem<SpotifyHistory>(spotifyHistoryKey, value)
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
