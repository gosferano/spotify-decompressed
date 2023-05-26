<template>
  <span>
    <section v-if="!isDataLoaded" class="section">
      <div class="columns">
        <div class="column is-half-desktop is-offset-one-quarter-desktop">
          <o-field class="file">
            <o-upload v-model="fileRef" expanded drag-drop>
              <p class="is-flex is-justify-content-center">
                <o-icon icon="archive" size="large" class="mdi-48px"> </o-icon>
              </p>
              <p class="is-flex is-justify-content-center">
                <span>{{
                  fileRef?.name || 'Click to upload Spotify data'
                }}</span>
              </p>
            </o-upload>
          </o-field>
          <span class="is-size-7">
            Spotify extended history file can be requested from your
            <NuxtLink
              to="https://www.spotify.com/lt-lt/account/privacy/"
              target="blank"
              >Spotify account page</NuxtLink
            >
          </span>
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
    </section>

    <section v-if="isDataLoaded" class="section">
      <div class="columns">
        <div class="column">
          <o-field class="is-fullwidth" label="Date range">
            <o-datepicker
              v-model="dates"
              placeholder="Select date range"
              range
              disabled
            >
            </o-datepicker>
          </o-field>
        </div>
      </div>

      <o-tabs v-model="activeTab" :expanded="true">
        <o-tab-item label="Global stats">
          <nav class="level">
            <div class="level-item has-text-centered">
              <div>
                <p class="heading">Duration played</p>
                <p class="title">{{ $msToText(globalStats.MsPlayed) }}</p>
              </div>
            </div>
            <div class="level-item has-text-centered">
              <div>
                <p class="heading">Avg. time per track</p>
                <p class="title">
                  {{
                    $msToText(globalStats.MsPlayed / globalStats.TimesPlayed)
                  }}
                </p>
              </div>
            </div>
            <div class="level-item has-text-centered">
              <div>
                <p class="heading">Times played</p>
                <p class="title">{{ globalStats.TimesPlayed }}</p>
              </div>
            </div>
          </nav>
          <nav class="level">
            <div class="level-item has-text-centered">
              <div>
                <p class="heading">Tracks discovered</p>
                <p class="title">{{ globalStats.TotalTracks }}</p>
              </div>
            </div>
            <div class="level-item has-text-centered">
              <div>
                <p class="heading">Artists discovered</p>
                <p class="title">{{ globalStats.TotalArtists }}</p>
              </div>
            </div>
            <div class="level-item has-text-centered">
              <div>
                <p class="heading">Albums discovered</p>
                <p class="title">{{ globalStats.TotalAlbums }}</p>
              </div>
            </div>
          </nav>
        </o-tab-item>

        <o-tab-item label="Top Tracks">
          <o-table
            :data="isDataLoaded ? trackStatsCurrent : []"
            :narrowed="true"
          >
            <o-table-column v-slot="props" field="index" numeric>
              {{
                (trackStatsPageNumber - 1) * entriesPerPage + props.index + 1
              }}
            </o-table-column>
            <o-table-column v-slot="props" field="TrackName" class="is-clipped">
              <NuxtLink
                :to="toTrackWebUrl(props.row.SpotifyTrackUri)"
                target="blank"
                >{{ props.row.TrackName }}</NuxtLink
              >
              <span class="has-text-grey"
                >- {{ props.row.AlbumArtistName }}</span
              >
            </o-table-column>
            <o-table-column v-slot="props" field="numbers">
              <span class="is-pulled-right">
                <span class="tag is-dark">
                  <o-icon icon="repeat" size="small"> </o-icon>
                  {{ props.row.TimesPlayed }}
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

        <o-tab-item label="Top Artists">
          <o-table
            :data="isDataLoaded ? artistStatsCurrent : []"
            :narrowed="true"
            :striped="true"
          >
            <o-table-column v-slot="props" field="index" numeric>
              {{
                (artistStatsPageNumber - 1) * entriesPerPage + props.index + 1
              }}
            </o-table-column>
            <o-table-column v-slot="props" field="name">
              {{ props.row.Name }}
            </o-table-column>
            <o-table-column v-slot="props" field="numbers">
              <span class="is-pulled-right">
                <span class="tag is-dark">
                  <o-icon icon="music" size="small"> </o-icon>
                  {{ props.row.Tracks.size }}
                </span>
                <span class="tag is-dark">
                  <o-icon icon="repeat" size="small"> </o-icon>
                  {{ props.row.TimesPlayed }}
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
            <o-table-column v-slot="props" field="index" numeric>
              {{
                (albumStatsPageNumber - 1) * entriesPerPage + props.index + 1
              }}
            </o-table-column>
            <o-table-column v-slot="props" field="name">
              {{ props.row.Name }}
              <span class="has-text-grey">- {{ props.row.ArtistName }}</span>
            </o-table-column>
            <o-table-column v-slot="props" field="numbers">
              <span class="is-pulled-right">
                <span class="tag is-dark">
                  <o-icon icon="music" size="small"> </o-icon>
                  {{ props.row.Tracks.size }}
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
    </section>
  </span>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import SpotifyHistoryAlbumStats from '~/composables/spotify/spotifyHistoryAlbumStats'
import SpotifyHistoryArtistStats from '~/composables/spotify/spotifyHistoryArtistStats'
import SpotifyHistoryGlobalStats from '~/composables/spotify/spotifyHistoryGlobalStats'
import SpotifyHistoryTrackStats from '~/composables/spotify/spotifyHistoryTrackStats'
import SpotifyHistoryZipReader from '~/composables/spotify/spotifyHistoryZipReader'

const dates = ref<[Date, Date]>()
const fileRef = ref<File>()
const globalStats = ref<SpotifyHistoryGlobalStats>(
  new SpotifyHistoryGlobalStats()
)
const artistStats = ref<Array<SpotifyHistoryArtistStats>>()
const artistStatsPageNumber = ref(1)

const trackStats = ref<Array<SpotifyHistoryTrackStats>>()
const trackStatsPageNumber = ref(1)

const albumStats = ref<Array<SpotifyHistoryAlbumStats>>()
const albumStatsPageNumber = ref(1)

const isDataLoaded = ref<boolean>(false)
const activeTab = ref(1)
const entriesPerPage = 25

const artistStatsCurrent = computed(() => {
  return getPage(artistStats.value, artistStatsPageNumber.value, entriesPerPage)
})

const trackStatsCurrent = computed(() => {
  return getPage(trackStats.value, trackStatsPageNumber.value, entriesPerPage)
})

const albumStatsCurrent = computed(() => {
  return getPage(albumStats.value, albumStatsPageNumber.value, entriesPerPage)
})

const getPage = (
  array: Array<any> | undefined,
  page: number,
  pageSize: number
) => {
  const start = pageSize * (page - 1)
  const end = start + pageSize
  return array?.slice(start, end)
}

const toTrackWebUrl = (spotifyTrackUri: string) => {
  return `https://open.spotify.com/track/${
    spotifyTrackUri.split(':').slice(-1)[0]
  }`
}

watch(fileRef, () => {
  if (fileRef.value) {
    loadFile(fileRef.value)
  }
})

const loadFile = async (file: File) => {
  const reader = new SpotifyHistoryZipReader()
  const spotifyHistory = await reader.parseExtendedHistory(file)

  dates.value = spotifyHistory.getDateRange()
  globalStats.value = spotifyHistory.getGlobalStats()
  artistStats.value = spotifyHistory.getArtistStats()
  trackStats.value = spotifyHistory.getTrackStats()
  albumStats.value = spotifyHistory.getAlbumStats()
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
</style>
