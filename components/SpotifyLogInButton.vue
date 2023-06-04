<template>
  <o-button
    tag="a"
    :href="useSpotifyUserStore().authorizeUrl"
    target="blank"
    icon-right="spotify"
    class="is-primary"
    :disabled="!$isDevEnvironment()"
  >
    Log in with
  </o-button>
</template>

<script setup lang="ts">
import { useSpotifyUserStore } from '~/stores/spotifyUserStore'
</script>
