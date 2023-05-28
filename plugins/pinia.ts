import { useSpotifyHistoryStore } from '~/stores/spotifyHistoryStore'
export default defineNuxtPlugin(({ $pinia }) => {
  return {
    provide: {
      store: useSpotifyHistoryStore($pinia),
    },
  }
})
