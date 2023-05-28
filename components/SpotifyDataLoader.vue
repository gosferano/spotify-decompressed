<template>
  <o-field class="file">
    <o-upload v-model="fileRef" expanded drag-drop>
      <p class="is-flex is-justify-content-center">
        <o-icon icon="archive" size="large" class="mdi-48px"> </o-icon>
      </p>
      <p class="is-flex is-justify-content-center">
        <span v-if="fileRef && !isDataValid" class="has-text-danger">
          Data file {{ fileRef.name }} is invalid</span
        >
        <span v-if="fileRef && isDataValid">
          Loading data from {{ fileRef.name }}</span
        >
        <span v-if="!fileRef">Click to explore your Spotify data</span>
      </p>
    </o-upload>
  </o-field>
  <span class="is-size-7">
    Spotify extended history file can be requested from your
    <NuxtLink to="https://www.spotify.com/lt-lt/account/privacy/" target="blank"
      >Spotify account page</NuxtLink
    >
  </span>
</template>

<script setup lang="ts">
import SpotifyHistoryZipReader from '~/composables/spotify/spotifyHistoryZipReader'

let isDataValid = true
const fileRef = ref<File | null>(null)
const spotifyHistoryZipKey = 'spotifyHistoryZip'

const emit = defineEmits(['update:isDataValid', 'update:spotifyHistory'])

watch(fileRef, async () => {
  if (fileRef.value) {
    await loadSpotifyHistory(fileRef.value)
  }
})

async function loadSpotifyHistory(value: File) {
  isDataValid = true
  try {
    const reader = new SpotifyHistoryZipReader()
    const spotifyHistory = await reader.parseExtendedHistory(value)
    emit('update:spotifyHistory', spotifyHistory)
  } catch {
    isDataValid = false
    emit('update:isDataValid', false)
    return
  }
  await localForage.setItem(spotifyHistoryZipKey, value)
  isDataValid = true
  emit('update:isDataValid', true)
}

const localForage = useLocalForage()
const spotifyHistoryZip = await localForage.getItem(spotifyHistoryZipKey)

if (spotifyHistoryZip) {
  fileRef.value = spotifyHistoryZip as File
}
</script>
