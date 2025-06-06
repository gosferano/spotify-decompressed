<template>
  <section>
    <div class="container is-max-desktop">
      <div class="tile is-ancestor">
        <div class="tile is-parent">
          <div class="tile is-child box">
            <p class="title">
              {{ modelValue?.GetFullName() }}
            </p>
            <p
              v-for="entry in getTrackIds(
                modelValue?.Entries ?? new Set<SpotifyHistoryEntry>(),
              )"
              :key="entry.Id"
            >
              {{ entry }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { SpotifyHistoryEntriesContainer } from '~/utils/spotifyHistory/spotifyHistoryEntriesContainer'
import SpotifyHistoryEntry from '~/utils/spotifyHistory/spotifyHistoryEntry'

const getTrackIds = (entries: Set<SpotifyHistoryEntry>) => {
  const trackUris = new Map<string, string>()
  entries.forEach((element) => {
    trackUris.set(element.SpotifyTrackUri, element.TrackName)
  })
  return trackUris
}

defineProps({
  modelValue: {
    type: Object as PropType<SpotifyHistoryEntriesContainer | undefined>,
    required: true,
  },
})
</script>
