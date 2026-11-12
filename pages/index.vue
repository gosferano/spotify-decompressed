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

    <div v-if="stats" class="container">
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
          <SpotifyHistoryStatsTabs :stats="stats" />
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { computed, ref, shallowRef } from 'vue'
import type SpotifyHistory from '~/utils/spotifyHistory/spotifyHistory'
import SpotifyHistoryFilter from '~/utils/spotifyHistory/SpotifyHistoryFilter'

const dates = ref<[Date, Date]>()
const sortBy = ref<'count' | 'duration'>('duration')
const includeSkipped = ref<boolean>(false)

// Shallow: the history holds every play ever, and deep reactivity would
// wrap each entry in a proxy that getStats then has to go through
const spotifyHistory = shallowRef<SpotifyHistory>()

const stats = computed(() => {
  if (!spotifyHistory.value || !dates.value) {
    return undefined
  }

  return spotifyHistory.value.getStats(
    new SpotifyHistoryFilter(dates.value, sortBy.value, includeSkipped.value),
  )
})

const receiveSpotifyHistory = (value: SpotifyHistory) => {
  spotifyHistory.value = value
  dates.value = [value.DateFrom, value.DateTo]
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
