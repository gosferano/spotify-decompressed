import { useSpotifyUserStore } from '~/stores/spotifyUserStore'; import {
useSpotifyUserStore } from '~/stores/spotifyUserStore';

<template>
  <o-button class="is-secondary" @click="useSpotifyUserStore().clearToken">
    Log out
  </o-button>
</template>

<script setup lang="ts">
import { useSpotifyUserStore } from '~/stores/spotifyUserStore'
</script>
