<template>
  <o-table :data="trackStatsCurrent" :narrowed="true" :striped="true">
    <o-table-column v-slot="props" field="index" label="#" numeric>
      {{ (pageNumber - 1) * entriesPerPage + props.index + 1 }}
    </o-table-column>
    <o-table-column
      v-slot="props"
      field="TrackName"
      label="Track"
      class="is-clipped"
    >
      <span>
        <NuxtLink :to="toTrackWebUrl(props.row.SpotifyTrackUri)" target="blank">
          <o-icon icon="spotify" size="small"> </o-icon>
        </NuxtLink>
        {{ props.row.TrackName }}
        <span class="has-text-grey"> - {{ props.row.ArtistName }} </span>
      </span>
    </o-table-column>
    <o-table-column
      v-slot="props"
      field="numbers"
      position="right"
      label="Stats"
    >
      <span class="is-pulled-right">
        <a v-if="$isDevEnvironment()">
          <o-icon
            type="a"
            icon="code-braces"
            size="small"
            @click="showDebugInfoFor = props.row"
          >
          </o-icon>
        </a>
        <span class="tag is-dark">
          <o-icon icon="repeat" size="small"> </o-icon>
          {{ props.row.Count }}
        </span>
        <span class="tag is-dark">
          <o-icon icon="timer" size="small"> </o-icon>
          {{ $msToText(props.row.MsPlayed) }}
        </span>
      </span>
    </o-table-column>
  </o-table>

  <o-pagination
    v-model:current="pageNumber"
    :total="trackStats!.length"
    :per-page="entriesPerPage"
    order="centered"
    :range-before="2"
    :range-after="2"
  >
  </o-pagination>

  <o-modal v-model:active="showDebugInfoFor">
    <EntriesDebugInfo v-model="showDebugInfoFor"></EntriesDebugInfo>
  </o-modal>
</template>

<script setup lang="ts">
import SpotifyHistoryTrackStats from '~/utils/spotifyHistory/spotifyHistoryTrackStats'

const { $getPage } = useNuxtApp()

const toTrackWebUrl = (spotifyTrackUri: string) => {
  return `https://open.spotify.com/track/${
    spotifyTrackUri.split(':').slice(-1)[0]
  }`
}

const pageNumber = ref(1)
const showDebugInfoFor = ref(null)

const properties = defineProps({
  trackStats: {
    type: Array as PropType<SpotifyHistoryTrackStats[]>,
    required: true,
  },
  entriesPerPage: {
    type: Number,
    required: true,
  },
})

const trackStatsCurrent = computed(() => {
  return $getPage(
    properties.trackStats,
    pageNumber.value,
    properties.entriesPerPage,
  )
})
</script>
