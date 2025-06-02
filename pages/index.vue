<template>
  <section class="section">
    <div v-if="!dates" class="container has-text-centered">
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

    <div v-if="dates" class="container">
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
                          globalStats!.MsPlayed / globalStats!.TimesPlayed,
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
              <ToplistsTracksToplist
                :entries-per-page="25"
                :track-stats="trackStats ?? []"
              />
            </o-tab-item>

            <o-tab-item label="Top Artists" class="toplist">
              <ToplistsArtistsToplist
                :entries-per-page="25"
                :artist-stats="artistStats ?? []"
              />
            </o-tab-item>

            <o-tab-item label="Top Albums" class="toplist">
              <ToplistsAlbumsToplist
                :entries-per-page="25"
                :album-stats="albumStats ?? []"
              />
            </o-tab-item>
          </o-tabs>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import SpotifyHistory from '~/utils/spotify/spotifyHistory'
import SpotifyHistoryAlbumStats from '~/utils/spotify/spotifyHistoryAlbumStats'
import SpotifyHistoryArtistStats from '~/utils/spotify/spotifyHistoryArtistStats'
import SpotifyHistoryFilter from '~/utils/spotify/SpotifyHistoryFilter'
import SpotifyHistoryGlobalStats from '~/utils/spotify/spotifyHistoryGlobalStats'
import SpotifyHistoryTrackStats from '~/utils/spotify/spotifyHistoryTrackStats'

const suppressWatcher = ref(false)

const dates = ref<[Date, Date]>()
const sortBy = ref<'count' | 'duration'>('duration')
const includeSkipped = ref<boolean>(false)

const spotifyHistory = ref<SpotifyHistory>()

const globalStats = ref<SpotifyHistoryGlobalStats>()
const artistStats = ref<Array<SpotifyHistoryArtistStats>>()
const trackStats = ref<Array<SpotifyHistoryTrackStats>>()
const albumStats = ref<Array<SpotifyHistoryAlbumStats>>()

const activeTab = ref(1)

watch(dates, () => {
  loadStats()
})

watch(sortBy, () => {
  loadStats()
})

watch(includeSkipped, () => {
  loadStats()
})

const receiveSpotifyHistory = (value: SpotifyHistory) => {
  spotifyHistory.value = value
  suppressWatcher.value = true
  dates.value = [spotifyHistory.value.DateFrom, spotifyHistory.value.DateTo]
  loadStats()
  suppressWatcher.value = false
}

const loadStats = () => {
  if (!dates.value || suppressWatcher.value) {
    return
  }

  const filter = new SpotifyHistoryFilter(
    dates.value,
    sortBy.value,
    includeSkipped.value,
  )

  const filteredStats = spotifyHistory.value!.getStats(filter)

  globalStats.value = filteredStats.global
  trackStats.value = filteredStats.tracks
  artistStats.value = filteredStats.artists
  albumStats.value = filteredStats.albums
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
