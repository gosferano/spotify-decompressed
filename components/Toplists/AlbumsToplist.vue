<template>
  <o-table :data="albumStatsCurrent" :narrowed="true" :striped="true">
    <o-table-column v-slot="props" field="index" numeric label="#">
      {{ (pageNumber - 1) * entriesPerPage + props.index + 1 }}
    </o-table-column>
    <o-table-column v-slot="props" field="name" label="Album">
      <span>
        {{ props.row.AlbumName }}
        <span class="has-text-grey">- {{ props.row.ArtistName }}</span>
      </span>
    </o-table-column>
    <o-table-column
      v-slot="props"
      field="numbers"
      label="Stats"
      position="right"
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
          <o-icon icon="music" size="small"> </o-icon>
          {{ props.row.Tracks.size }}
        </span>
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
    :total="albumStats!.length"
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
import SpotifyHistoryAlbumStats from '~/utils/spotify/spotifyHistoryAlbumStats'

const { $getPage } = useNuxtApp()

const pageNumber = ref(1)
const showDebugInfoFor = ref(null)

const properties = defineProps({
  albumStats: {
    type: Array as PropType<SpotifyHistoryAlbumStats[]>,
    required: true,
  },
  entriesPerPage: {
    type: Number,
    required: true,
  },
})

const albumStatsCurrent = computed(() => {
  return $getPage(
    properties.albumStats,
    pageNumber.value,
    properties.entriesPerPage,
  )
})
</script>
