<template>
  <span>

    <section class="section" v-if="!isProcessingDone">
      <div class="columns">
        <div class="column is-half-desktop is-offset-one-quarter-desktop">
          <b-field class="file">
            <b-upload v-model="file" expanded>
              <a class="button is-primary is-fullwidth">
                <b-icon icon="archive"></b-icon>
                <span>{{ file?.name || "Click to upload Spotify data" }}</span>
              </a>
            </b-upload>
          </b-field>
        </div>
        <div class="column" v-if="false">
          <b-button type="is-primary" icon-left="spotify" expanded outlined disabled>Sign in with Spotify</b-button>
        </div>
      </div>
    </section>

    <section class="section" v-if="isProcessingDone">
      <div class="columns">
        <div class="column">
          <b-field class="is-fullwidth" label="Date range">
            <b-datepicker placeholder="Select date range" v-model="dates" range disabled>
            </b-datepicker>
          </b-field>
        </div>
      </div>

      <b-tabs v-model="activeTab" expanded>
        <b-tab-item label="Global stats">
          <nav class="level">
            <div class="level-item has-text-centered">
              <div>
                <p class="heading">Duration played</p>
                <p class="title"> {{ msToText(globalStats.MsPlayed) }} </p>
              </div>
            </div>
            <div class="level-item has-text-centered">
              <div>
                <p class="heading">Avg. time per track</p>
                <p class="title"> {{ msToText(globalStats.MsPlayed / globalStats.TimesPlayed) }} </p>
              </div>
            </div>
            <div class="level-item has-text-centered">
              <div>
                <p class="heading">Times played</p>
                <p class="title"> {{ globalStats.TimesPlayed }} </p>
              </div>
            </div>
          </nav>
          <nav class="level">
            <div class="level-item has-text-centered">
              <div>
                <p class="heading">Tracks</p>
                <p class="title"> {{ globalStats.TotalTracks }} </p>
              </div>
            </div>
            <div class="level-item has-text-centered">
              <div>
                <p class="heading">Artists</p>
                <p class="title"> {{ globalStats.TotalArtists }} </p>
              </div>
            </div>
            <div class="level-item has-text-centered">
              <div>
                <p class="heading">Albums</p>
                <p class="title"> {{ globalStats.TotalAlbums }} </p>
              </div>
            </div>
          </nav>
        </b-tab-item>

        <b-tab-item label="Top Tracks">
          <table class="table is-striped is-narrow is-fullwidth">
            <tbody>
              <tr v-for="entry, index in trackStatsCurrent">
                <td> {{ 1 + index + trackStatsPageNumber * entriesPerPage }}</td>
                <td> <a :href=toTrackWebUrl(entry.SpotifyTrackUri) target="_blank">{{ entry.TrackName }}</a> - <span
                    class="has-text-grey"> {{ entry.AlbumArtistName }}</span>
                </td>
                <td>
                  <span class="is-pulled-right">
                    <b-tag type="is-dark" size="is-small" icon="repeat">{{ entry.TimesPlayed }}</b-tag>
                    <b-tag type="is-dark" size="is-small" icon="timer-outline">{{ msToText(entry.MsPlayed) }}</b-tag>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
          <b-pagination :total="trackStats.length" v-model="trackStatsPageNumber" :per-page="entriesPerPage">
          </b-pagination>
        </b-tab-item>

        <b-tab-item label="Top Artists">
          <table class="table is-striped is-narrow is-fullwidth">
            <tbody>
              <tr v-for="entry, index in artistStatsCurrent">
                <td> {{ 1 + index + artistStatsPageNumber * entriesPerPage }}</td>
                <td> {{ entry.AlbumArtistName }} </td>
                <td>
                  <span class="is-pulled-right">
                    <b-tag type="is-dark" size="is-small" icon="repeat">{{ entry.TimesPlayed }}</b-tag>
                    <b-tag type="is-dark" size="is-small" icon="timer-outline">{{ msToText(entry.MsPlayed) }}</b-tag>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
          <b-pagination :total="artistStats.length" v-model="artistStatsPageNumber" :per-page="entriesPerPage">
          </b-pagination>
        </b-tab-item>

        <b-tab-item label="Top Albums">
          <div id="top-albums-list" class="ordered list">
            <!-- Top artists list loaded here -->
          </div>
        </b-tab-item>
      </b-tabs>
    </section>

  </span>
</template>

<script>
import { SpotifyHistoryZipReader } from '~/plugins/spotifyHistoryZipReader';
import { msToText as msToTextImpl } from '~/plugins/utils';


export default {
  data() {
    return {
      activeTab: 0,
      dates: null,
      file: null,
      globalStats: {},
      artistStats: [],
      artistStatsCount: 0,
      artistStatsPageNumber: 0,
      trackStats: [],
      trackStatsCount: 0,
      trackStatsPageNumber: 0,
      entriesPerPage: 25,
      today: Date.now,
      isProcessingDone: false,
    }
  },
  computed: {
    artistStatsCurrent() {
      const start = this.entriesPerPage * this.artistStatsPageNumber;
      const end = this.entriesPerPage * (this.artistStatsPageNumber + 1);
      const currentEntries = this.artistStats.slice(start, end);
      console.log(currentEntries);
      return currentEntries;
    },
    trackStatsCurrent() {
      const start = this.entriesPerPage * this.trackStatsPageNumber;
      const end = this.entriesPerPage * (this.trackStatsPageNumber + 1);
      const currentEntries = this.trackStats.slice(start, end);
      console.log(currentEntries);
      return currentEntries;
    },
  },
  methods: {
    msToText(ms) {
      return msToTextImpl(ms);
    },
    toTrackWebUrl(spotifyTrackUri) {
      return `https://open.spotify.com/track/${spotifyTrackUri.split(":").slice(-1)[0]}`
    }
  },
  watch: {
    activeTab: function (current, previous) {
      console.log("current tab:", current)
      console.log("previous tab:", previous)
    },
    dates: function (selectedDates) {
      console.log("from date", selectedDates[0])
      console.log("to date", selectedDates[1])
    },
    file: async function (uploadedFile) {
      var reader = new SpotifyHistoryZipReader();
      var spotifyHistory = await reader.parseExtendedHistory(uploadedFile);

      this.dates = spotifyHistory.getDateRange();
      this.globalStats = spotifyHistory.getGlobalStats();
      this.artistStats = spotifyHistory.getArtistStats();
      this.trackStats = spotifyHistory.getTrackStats();

      this.isProcessingDone = true;
    },
  }
}
</script>