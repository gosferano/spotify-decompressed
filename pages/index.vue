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
          <div class="is-size-7">
            Spotify extended history file can be requested from your
            <a href="https://www.spotify.com/lt-lt/account/privacy/"
              >Spotify account page</a
            >
          </div>
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
          <table class="table is-striped is-narrow is-fullwidth">
            <tbody>
              <tr
                v-for="(entry, index) in trackStatsCurrent"
                :key="entry.SpotifyTrackUri"
              >
                <td>
                  {{ 1 + index + (trackStatsPageNumber - 1) * entriesPerPage }}
                </td>
                <td>
                  <a
                    :href="toTrackWebUrl(entry.SpotifyTrackUri)"
                    target="_blank"
                    >{{ entry.TrackName }}</a
                  >
                  -
                  <span class="has-text-grey">
                    {{ entry.AlbumArtistName }}</span
                  >
                </td>
                <td>
                  <div class="is-pulled-right">
                    <span class="tag is-dark">
                      <o-icon icon="repeat" size="small"> </o-icon>
                      {{ entry.TimesPlayed }}
                    </span>
                    <span class="tag is-dark">
                      <o-icon icon="timer" size="small"> </o-icon>
                      {{ $msToText(entry.MsPlayed) }}
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <o-pagination
            v-model:current="trackStatsPageNumber"
            :total="trackStats!.length"
            :per-page="entriesPerPage"
            order="centered"
            range-before="2"
            range-after="2"
          >
          </o-pagination>
        </o-tab-item>

        <o-tab-item label="Top Artists">
          <table class="table is-striped is-narrow is-fullwidth">
            <tbody>
              <tr
                v-for="(entry, index) in artistStatsCurrent"
                :key="entry.AlbumArtistName"
              >
                <td>
                  {{ 1 + index + (artistStatsPageNumber - 1) * entriesPerPage }}
                </td>
                <td>{{ entry.AlbumArtistName }}</td>
                <td>
                  <span class="is-pulled-right">
                    <span class="tag is-dark">
                      <o-icon icon="repeat" size="small"> </o-icon>
                      {{ entry.TimesPlayed }}
                    </span>
                    <span class="tag is-dark">
                      <o-icon icon="timer" size="small"> </o-icon>
                      {{ $msToText(entry.MsPlayed) }}
                    </span>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
          <o-pagination
            v-model:current="artistStatsPageNumber"
            :total="artistStats!.length"
            :per-page="entriesPerPage"
            order="centered"
            range-before="2"
            range-after="2"
          >
          </o-pagination>
        </o-tab-item>

        <o-tab-item label="Top Albums">
          <div id="top-albums-list" class="ordered list">
            <!-- Top artists list loaded here -->
          </div>
        </o-tab-item>
      </o-tabs>
    </section>
  </span>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import SpotifyHistoryGlobalStats from '~/composables/spotify/spotifyHistoryGlobalStats'
import SpotifyHistoryZipReader from '~/composables/spotify/spotifyHistoryZipReader'

const dates = ref<[Date, Date]>()
const fileRef = ref<File>()
const globalStats = ref<SpotifyHistoryGlobalStats>(
  new SpotifyHistoryGlobalStats()
)
const artistStats = ref<Array<any>>()
const trackStats = ref<Array<any>>()
const isDataLoaded = ref<boolean>(false)
const activeTab = ref(1)
const artistStatsPageNumber = ref(1)
const trackStatsPageNumber = ref(1)
const entriesPerPage = 25

const artistStatsCurrent = computed(() => {
  const start = entriesPerPage * (artistStatsPageNumber.value - 1)
  const end = start + entriesPerPage
  const currentEntries = artistStats.value?.slice(start, end)
  return currentEntries
})

const trackStatsCurrent = computed(() => {
  const start = entriesPerPage * (trackStatsPageNumber.value - 1)
  const end = start + entriesPerPage
  const currentEntries = trackStats.value?.slice(start, end)
  return currentEntries
})

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
