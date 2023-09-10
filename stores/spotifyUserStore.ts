import { acceptHMRUpdate, defineStore } from 'pinia'

export const useSpotifyUserStore = defineStore('spotifyUserStore', () => {
  const clientId = 'a7d68a1f12b747f3a130824343439411'
  const redirectUri =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/callback'
      : 'https://gosferano.github.io/spotify-decompressed/callback'
  const scopes = ['user-top-read']

  const authorizeUrl = ref<string>(
    'https://accounts.spotify.com/authorize' +
      '?response_type=token' +
      '&client_id=' +
      encodeURIComponent(clientId) +
      '&scope=' +
      encodeURIComponent(scopes.join(' ')) +
      '&redirect_uri=' +
      encodeURIComponent(redirectUri),
  )

  const clearToken = () => {
    localStorage.removeItem('spotifyToken')
    localStorage.removeItem('spotifyTokenType')
    isAuthorized.value = false
  }

  const getToken = () => {
    const token = localStorage.getItem('spotifyToken')
    const tokenType = localStorage.getItem('spotifyTokenType')
    if (token && tokenType) {
      return tokenType + ' ' + token
    }
    return null
  }

  const setToken = (token: string, tokenType: string) => {
    localStorage.setItem('spotifyToken', token)
    localStorage.setItem('spotifyTokenType', tokenType)
    isAuthorized.value = true
  }

  const isAuthorized = ref<boolean>(getToken() != null)

  return {
    authorizeUrl,
    isAuthorized,
    clearToken,
    getToken,
    setToken,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useSpotifyUserStore, import.meta.hot))
