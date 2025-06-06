<template>
  <o-field class="file">
    <o-upload v-model="fileRef" expanded drag-drop>
      <p class="is-flex is-justify-content-center">
        <o-icon icon="archive" size="large" class="mdi-48px"> </o-icon>
      </p>
      <p
        v-if="isCheckingLocalStorage"
        class="is-flex is-justify-content-center"
      >
        Checking local storage for Spotify data
      </p>
      <p v-else-if="fileRef && !isDataValid" class="has-text-danger">
        {{ invalidDataMessage }}
      </p>
      <p v-else-if="fileRef && isDataValid">
        Loading data from {{ fileRef.name }}
      </p>
      <p v-else>Click to explore your Spotify data</p>
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
import SpotifyHistory from '~/utils/spotifyHistory/spotifyHistory'
import SpotifyHistoryZipReader from '~/utils/spotifyHistory/spotifyHistoryZipReader'
import { useSpotifyHistoryStore } from '~/stores/spotifyHistoryStore'

const isDataValid = ref(true)
const invalidDataMessage = ref('')
const fileRef = ref<File | null>(null)
const isCheckingLocalStorage = ref<Boolean>(true)

const emit = defineEmits(['update:isDataValid', 'update:spotifyHistory'])

watch(fileRef, async () => {
  if (fileRef.value) {
    await loadSpotifyHistory(fileRef.value)
  }
})

async function loadSpotifyHistory(value: File) {
  isDataValid.value = true
  try {
    const reader = new SpotifyHistoryZipReader()
    const spotifyHistory = await reader.parseExtendedHistory(value)

    if (spotifyHistory.Entries.length === 0) {
      isDataValid.value = false
      invalidDataMessage.value = 'File contains no Spotify listening history'
      emit('update:isDataValid', false)
      return
    }

    spotifyHistoryStore.setHistory(spotifyHistory)
    emit('update:spotifyHistory', spotifyHistory)
  } catch {
    isDataValid.value = false
    invalidDataMessage.value = `File ${value.name} is not a valid`
    emit('update:isDataValid', false)
    return
  }
  isDataValid.value = true
  emit('update:isDataValid', true)
}

const spotifyHistoryStore = useSpotifyHistoryStore()

onMounted(() => {
  spotifyHistoryStore
    .getHistory()
    .then((spotifyHistory: SpotifyHistory | null) => {
      if (spotifyHistory) {
        emit('update:spotifyHistory', spotifyHistory)
      }
    })
    .finally(() => {
      isCheckingLocalStorage.value = false
    })
})
</script>
