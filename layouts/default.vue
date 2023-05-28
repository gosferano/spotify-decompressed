<template>
  <span>
    <nav
      class="navbar is-transparent"
      role="navigation"
      aria-label="main navigation"
    >
      <div class="navbar-brand">
        <span class="navbar-item">
          <h1 class="navbar-item has-text-weight-semibold">
            Spotify Decompressed
          </h1>
          <span v-if="spotifyHistoryStore.spotifyHistory">
            {{ spotifyHistoryStore.spotifyHistory.DateFrom.getFullYear() }} -
            {{ spotifyHistoryStore.spotifyHistory.DateTo.getFullYear() }}</span
          >
        </span>
      </div>
    </nav>

    <span id="main-content">
      <slot />
    </span>

    <footer class="footer">
      <div class="content has-text-centered">
        <o-field>
          <o-switch
            v-model="colorMode.preference"
            true-value="dark"
            false-value="light"
          >
            {{ colorMode.preference }}
          </o-switch>
        </o-field>
        <p>
          <strong>Spotify Decompressed</strong> by
          <NuxtLink to="https://github.com/gosferano">gosferano</NuxtLink>
        </p>
        <p>
          <NuxtLink
            to="https://github.com/gosferano/spotify-decompressed"
            target="blank"
          >
            <o-icon icon="github"> </o-icon>
          </NuxtLink>
        </p>
      </div>
    </footer>
  </span>
</template>

<script setup lang="ts">
import { useSpotifyHistoryStore } from '~/stores/spotifyHistoryStore'

const colorMode = useColorMode()
const spotifyHistoryStore = useSpotifyHistoryStore()
</script>
