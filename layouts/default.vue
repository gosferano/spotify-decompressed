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

        <a
          role="button"
          class="navbar-burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarButtons"
          :class="{ 'is-active': showNav }"
          @click="showNav = !showNav"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div
        v-if="$isDevEnvironment()"
        id="navbarButtons"
        class="navbar-menu"
        :class="{ 'is-active': showNav }"
      >
        <div class="navbar-start">
          <div class="navbar-item">
            <NuxtLink to="/" class="is-primary">Home</NuxtLink>
          </div>
          <div class="navbar-item">
            <NuxtLink to="/enhance" class="is-primary">Enhance</NuxtLink>
          </div>
        </div>
        <div class="navbar-end">
          <div class="navbar-item">
            <div class="buttons">
              <SpotifyLogInButton
                v-if="
                  spotifyHistoryStore.spotifyHistory &&
                  !spotifyUserStore.isAuthorized
                "
              />
              <SpotifyLogOutButton v-if="spotifyUserStore.isAuthorized" />
            </div>
          </div>
        </div>
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
import { useSpotifyUserStore } from '~/stores/spotifyUserStore'

const showNav = ref<Boolean>(false)
const colorMode = useColorMode()
const spotifyHistoryStore = useSpotifyHistoryStore()
const spotifyUserStore = useSpotifyUserStore()
</script>
