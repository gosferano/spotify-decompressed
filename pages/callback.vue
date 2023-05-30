<template>
  <section v-if="!isLoggingIn" class="section">
    <div class="container has-text-centered">
      <p>Login not successful</p>
      <p>
        <NuxtLink to="/">Go back to home page</NuxtLink>
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useSpotifyUserStore } from '~/stores/spotifyUserStore'

const spotifyHistoryStore = useSpotifyUserStore()
const isLoggingIn = ref<Boolean>(true)

onMounted(() => {
  // Get the access token and token type from the URL hash
  const hash = window.location.hash.substring(1)
  const params = new URLSearchParams(hash)
  const token = params.get('access_token')
  const tokenType = params.get('token_type')

  if (token && tokenType) {
    spotifyHistoryStore.setToken(token, tokenType)
    window.location.href = '/'
  } else {
    isLoggingIn.value = false
  }
})
</script>
