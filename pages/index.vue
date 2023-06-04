<template>
  <section class="section">
    <div v-if="!isDataLoaded" class="container has-text-centered">
      <div class="columns">
        <div class="column is-half-desktop is-offset-one-quarter-desktop">
          <SpotifyDataLoader
            @update:spotify-history="receiveSpotifyHistory"
          ></SpotifyDataLoader>
        </div>
        <div v-if="false" class="column">
          <o-button
            type="is-primary"
            icon-left="spotify"
            expanded
            outlined
            disabled
            >Sign in with Spotify</o-button
          >
        </div>
      </div>
    </div>

    <div v-if="isDataLoaded" class="container">
      <div class="columns">
        <div
          class="column is-8-fullhd is-offset-2-fullhd is-10-widescreen is-offset-1-widescreen"
        >
          <div class="columns is-desktop">
            <div class="column is-12-tablet is-6-desktop">
              <o-field label="Date range">
                <o-datepicker
                  v-model="dates"
                  expanded
                  placeholder="Select date range"
                  range
                  :disabled="!dates"
                  :min-date="spotifyHistory?.DateFrom"
                  :max-date="spotifyHistory?.DateTo"
                >
                </o-datepicker>
              </o-field>
            </div>
            <div class="column is-12-tablet is-6-desktop">
              <div class="columns is-mobile">
                <div class="column is-6-tablet">
                  <o-field label="Sort by">
                    <o-select v-model="sortBy" expanded>
                      <option value="count">Count</option>
                      <option value="duration">Duration</option>
                    </o-select>
                  </o-field>
                </div>

                <div class="column is-6-tablet">
                  <o-field label="Include skipped">
                    <o-select v-model="includeSkipped" expanded>
                      <option :value="true">Yes</option>
                      <option :value="false">No</option>
                    </o-select>
                  </o-field>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="columns">
        <div
          class="column is-8-fullhd is-offset-2-fullhd is-10-widescreen is-offset-1-widescreen"
        >
          <o-tabs v-model="activeTab" :expanded="true">
            <o-tab-item label="Global stats">
              <nav class="level">
                <div class="level-item has-text-centered">
                  <div>
                    <p class="heading">Duration played</p>
                    <p class="title">{{ $msToText(globalStats!.MsPlayed) }}</p>
                  </div>
                </div>
                <div class="level-item has-text-centered">
                  <div>
                    <p class="heading">Avg. time per track</p>
                    <p class="title">
                      {{
                        $msToText(
                          globalStats!.MsPlayed / globalStats!.TimesPlayed
                        )
                      }}
                    </p>
                  </div>
                </div>
                <div class="level-item has-text-centered">
                  <div>
                    <p class="heading">Times played</p>
                    <p class="title">{{ globalStats!.TimesPlayed }}</p>
                  </div>
                </div>
              </nav>
              <nav class="level">
                <div class="level-item has-text-centered">
                  <div>
                    <p class="heading">Tracks discovered</p>
                    <p class="title">{{ globalStats!.TotalTracks }}</p>
                  </div>
                </div>
                <div class="level-item has-text-centered">
                  <div>
                    <p class="heading">Artists discovered</p>
                    <p class="title">{{ globalStats!.TotalArtists }}</p>
                  </div>
                </div>
                <div class="level-item has-text-centered">
                  <div>
                    <p class="heading">Albums discovered</p>
                    <p class="title">{{ globalStats!.TotalAlbums }}</p>
                  </div>
                </div>
              </nav>
            </o-tab-item>

            <o-tab-item label="Top Tracks" class="toplist">
              <o-table
                :data="isDataLoaded ? trackStatsCurrent : []"
                :narrowed="true"
                :striped="true"
              >
                <o-table-column v-slot="props" field="index" label="#" numeric>
                  {{
                    (trackStatsPageNumber - 1) * entriesPerPage +
                    props.index +
                    1
                  }}
                </o-table-column>
                <o-table-column
                  v-slot="props"
                  field="TrackName"
                  label="Track"
                  class="is-clipped"
                >
                  <NuxtLink
                    :to="toTrackWebUrl(props.row.SpotifyTrackUri)"
                    target="blank"
                  >
                    <o-icon icon="spotify" size="small"> </o-icon>
                  </NuxtLink>
                  {{ props.row.TrackName }}
                  <span class="has-text-grey">
                    - {{ props.row.ArtistName }}
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
                        @click="setActiveEntry(props.row)"
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
                v-model:current="trackStatsPageNumber"
                :total="trackStats!.length"
                :per-page="entriesPerPage"
                order="centered"
                :range-before="2"
                :range-after="2"
              >
              </o-pagination>
            </o-tab-item>

            <o-tab-item label="Top Artists" class="toplist">
              <o-table
                :data="isDataLoaded ? artistStatsCurrent : []"
                :narrowed="true"
                :striped="true"
              >
                <o-table-column v-slot="props" field="index" label="#" numeric>
                  {{
                    (artistStatsPageNumber - 1) * entriesPerPage +
                    props.index +
                    1
                  }}
                </o-table-column>
                <o-table-column v-slot="props" field="name" label="Artist">
                  {{ props.row.ArtistName }}
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
                        @click="setActiveEntry(props.row)"
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
                v-model:current="artistStatsPageNumber"
                :total="artistStats!.length"
                :per-page="entriesPerPage"
                order="centered"
                :range-before="2"
                :range-after="2"
              >
              </o-pagination>
            </o-tab-item>

            <o-tab-item label="Top Albums">
              <o-table
                :data="isDataLoaded ? albumStatsCurrent : []"
                :narrowed="true"
                :striped="true"
              >
                <o-table-column v-slot="props" field="index" numeric label="#">
                  {{
                    (albumStatsPageNumber - 1) * entriesPerPage +
                    props.index +
                    1
                  }}
                </o-table-column>
                <o-table-column v-slot="props" field="name" label="Album">
                  <span>
                    {{ props.row.AlbumName }}
                    <span class="has-text-grey"
                      >- {{ props.row.ArtistName }}</span
                    >
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
                        @click="setActiveEntry(props.row)"
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
                v-model:current="albumStatsPageNumber"
                :total="albumStats!.length"
                :per-page="entriesPerPage"
                order="centered"
                :range-before="2"
                :range-after="2"
              >
              </o-pagination>
            </o-tab-item>
          </o-tabs>
        </div>
      </div>
    </div>

    <o-modal v-model:active="activeEntry">
      <EntriesDebugInfo v-model="activeEntry"></EntriesDebugInfo>
    </o-modal>
  </section>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import SpotifyHistory from '~/composables/spotify/spotifyHistory'
import SpotifyHistoryAlbumStats from '~/composables/spotify/spotifyHistoryAlbumStats'
import SpotifyHistoryArtistStats from '~/composables/spotify/spotifyHistoryArtistStats'
import SpotifyHistoryEntriesContainer from '~/composables/spotify/spotifyHistoryEntriesContainer'
import SpotifyHistoryGlobalStats from '~/composables/spotify/spotifyHistoryGlobalStats'
import SpotifyHistoryTrackStats from '~/composables/spotify/spotifyHistoryTrackStats'

const dates = ref<[Date, Date]>()
const sortBy = ref<'count' | 'duration'>('duration')
const includeSkipped = ref<boolean>(false)

const spotifyHistory = ref<SpotifyHistory>()

const globalStats = ref<SpotifyHistoryGlobalStats>()

const artistStats = ref<Array<SpotifyHistoryArtistStats>>()
const artistStatsPageNumber = ref(1)

const trackStats = ref<Array<SpotifyHistoryTrackStats>>()
const trackStatsPageNumber = ref(1)

const albumStats = ref<Array<SpotifyHistoryAlbumStats>>()
const albumStatsPageNumber = ref(1)

const isDataLoaded = ref<boolean>(false)
const activeTab = ref(1)
const entriesPerPage = 25

const activeEntry = ref<SpotifyHistoryEntriesContainer>()

const artistStatsCurrent = computed(() => {
  if (!artistStats.value) {
    return []
  }
  return getPage(artistStats.value, artistStatsPageNumber.value, entriesPerPage)
})

const trackStatsCurrent = computed(() => {
  if (!trackStats.value) {
    return []
  }

  return getPage(trackStats.value, trackStatsPageNumber.value, entriesPerPage)
})

const albumStatsCurrent = computed(() => {
  if (!albumStats.value) {
    return []
  }
  return getPage(albumStats.value, albumStatsPageNumber.value, entriesPerPage)
})

const getPage = (array: Array<any>, page: number, pageSize: number) => {
  const start = pageSize * (page - 1)
  const end = start + pageSize
  return array?.slice(start, end)
}

const toTrackWebUrl = (spotifyTrackUri: string) => {
  return `https://open.spotify.com/track/${
    spotifyTrackUri.split(':').slice(-1)[0]
  }`
}

const setActiveEntry = (entry: SpotifyHistoryEntriesContainer) => {
  activeEntry.value = entry
}

watch(dates, () => {
  loadStats(false)
})

watch(includeSkipped, () => {
  loadStats(false)
})

watch(sortBy, () => {
  loadStats(false)
})

const receiveSpotifyHistory = (value: SpotifyHistory) => {
  spotifyHistory.value = value
  dates.value = spotifyHistory.value.getDateRange()
  loadStats(true)
}

const loadStats = (isFirstRun: Boolean) => {
  if (!isFirstRun && !isDataLoaded.value) {
    return
  }

  const filteredStats = spotifyHistory.value!.getStats(
    dates.value![0],
    dates.value![1],
    sortBy.value,
    includeSkipped.value
  )

  globalStats.value = filteredStats.global
  trackStats.value = filteredStats.tracks
  artistStats.value = filteredStats.artists
  albumStats.value = filteredStats.albums
  isDataLoaded.value = true
}
</script>

<style>
.tag {
  margin-left: 0.2em;
}

.field.file {
  margin-bottom: 0.2em;
}

.tag:not(body) .icon:first-child:last-child {
  margin-right: 0.1em;
}

.tab-content:has(> .tab-item) {
  padding-left: 0px;
  padding-right: 0px;
}
</style>
