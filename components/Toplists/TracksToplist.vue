<template>
  <o-table
    :data="trackStatsCurrent"
    :narrowed="true"
    row-key="Key"
    :row-class="toplistRowClass"
    tr-detailed-class="detail"
    detailed
    :show-detail-icon="false"
    :detailed-rows="expandedRows"
    @click="toggleRow"
  >
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
        <NuxtLink
          :to="toTrackWebUrl(props.row.SpotifyTrackUri)"
          target="blank"
          @click.stop
        >
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
        <a v-if="isDevEnvironment()" @click.stop="showDebugInfoFor = props.row">
          <o-icon icon="code-braces" size="small" />
        </a>
        <span class="tag is-dark">
          <o-icon icon="repeat" size="small"> </o-icon>
          {{ props.row.Count }}
        </span>
        <span class="tag is-dark">
          <o-icon icon="timer" size="small"> </o-icon>
          {{ msToText(props.row.MsPlayed) }}
        </span>
        <ToplistsToplistExpandButton :expanded="isExpanded(props.row)" />
      </span>
    </o-table-column>
    <template #detail="{ row }">
      <DailyListening :entries="row.Entries" :sort-by="sortBy" />
    </template>
  </o-table>

  <o-pagination
    v-model="pageNumber"
    :total="trackStats!.length"
    :per-page="entriesPerPage"
    position="centered"
    :range-before="2"
    :range-after="2"
  >
  </o-pagination>

  <o-modal
    :active="showDebugInfoFor !== undefined"
    @update:active="showDebugInfoFor = undefined"
  >
    <EntriesDebugInfo v-model="showDebugInfoFor"></EntriesDebugInfo>
  </o-modal>
</template>

<script setup lang="ts">
import type { SortBy } from '~/utils/spotifyHistory/SpotifyHistoryFilter'
import type { SpotifyHistoryEntriesContainer } from '~/utils/spotifyHistory/spotifyHistoryEntriesContainer'
import type SpotifyHistoryTrackStats from '~/utils/spotifyHistory/spotifyHistoryTrackStats'

const toTrackWebUrl = (spotifyTrackUri: string) => {
  return `https://open.spotify.com/track/${
    spotifyTrackUri.split(':').slice(-1)[0]
  }`
}

const pageNumber = ref(1)
const showDebugInfoFor = ref<SpotifyHistoryEntriesContainer>()

const properties = defineProps({
  trackStats: {
    type: Array as PropType<SpotifyHistoryTrackStats[]>,
    required: true,
  },
  entriesPerPage: {
    type: Number,
    required: true,
  },
  sortBy: {
    type: String as PropType<SortBy>,
    required: true,
  },
})

const trackStatsCurrent = computed(() => {
  return getPage(
    properties.trackStats,
    pageNumber.value,
    properties.entriesPerPage,
  )
})

const { expandedRows, isExpanded, toggleRow } = useExpandedRow(
  () => trackStatsCurrent.value,
)
</script>
