<template>
  <o-tabs v-model="activeTab" :expanded="true">
    <o-tab-item label="Global stats">
      <nav class="level">
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Duration played</p>
            <p class="title">{{ msToText(stats.global.MsPlayed) }}</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Avg. time per track</p>
            <p class="title">
              {{
                msToText(
                  stats.global.TimesPlayed
                    ? stats.global.MsPlayed / stats.global.TimesPlayed
                    : 0,
                )
              }}
            </p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Times played</p>
            <p class="title">{{ stats.global.TimesPlayed }}</p>
          </div>
        </div>
      </nav>
      <nav class="level">
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Tracks discovered</p>
            <p class="title">{{ stats.global.TotalTracks }}</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Artists discovered</p>
            <p class="title">{{ stats.global.TotalArtists }}</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Albums discovered</p>
            <p class="title">{{ stats.global.TotalAlbums }}</p>
          </div>
        </div>
      </nav>
    </o-tab-item>

    <o-tab-item label="Top Tracks" class="toplist">
      <ToplistsTracksToplist
        :entries-per-page="25"
        :track-stats="stats.tracks"
      />
    </o-tab-item>

    <o-tab-item label="Top Artists" class="toplist">
      <ToplistsArtistsToplist
        :entries-per-page="25"
        :artist-stats="stats.artists"
      />
    </o-tab-item>

    <o-tab-item label="Top Albums" class="toplist">
      <ToplistsAlbumsToplist
        :entries-per-page="25"
        :album-stats="stats.albums"
      />
    </o-tab-item>
  </o-tabs>
</template>

<script setup lang="ts">
import type { SpotifyHistoryStats } from '~/utils/spotifyHistory/spotifyHistory'

import { msToText } from '~/utils/helpers'
defineProps({
  stats: {
    type: Object as PropType<SpotifyHistoryStats>,
    required: true,
  },
})

const activeTab = ref(1)
</script>
