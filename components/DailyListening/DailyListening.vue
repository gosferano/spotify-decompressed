<template>
  <div class="daily-listening">
    <dl class="facts">
      <div>
        <dt>First played</dt>
        <dd>{{ firstDay ? dateToText(firstDay.date) : '' }}</dd>
      </div>
      <div>
        <dt>Last played</dt>
        <dd>{{ lastDay ? dateToText(lastDay.date) : '' }}</dd>
      </div>
      <div>
        <dt>Days listened</dt>
        <dd>{{ days.size }}</dd>
      </div>
      <div v-if="bestDay">
        <dt>Best day</dt>
        <dd>
          <button
            type="button"
            class="best-day has-text-link"
            @click="selectDay(bestDay[0])"
          >
            {{ dateToText(bestDay[1].date) }}
          </button>
          <span class="has-text-grey">
            {{ metricToText(bestDay[1], sortBy) }}
          </span>
        </dd>
      </div>
    </dl>

    <DailyListeningYears
      v-if="years.length > 1"
      :model-value="year"
      :years="years"
      :sort-by="sortBy"
      class="block"
      @update:model-value="selectYear"
    />

    <DailyListeningCalendar
      :model-value="selectedDay"
      :year="year"
      :days="days"
      :sort-by="sortBy"
      @update:model-value="toggleDay"
    />

    <div v-if="selected" class="day-details" aria-live="polite">
      <div class="day-header">
        <button
          type="button"
          class="button is-small"
          aria-label="Previous day listened"
          :disabled="!previousDay"
          @click="selectDay(previousDay)"
        >
          <o-icon icon="chevron-left" size="small" />
        </button>
        <button
          type="button"
          class="button is-small"
          aria-label="Next day listened"
          :disabled="!nextDay"
          @click="selectDay(nextDay)"
        >
          <o-icon icon="chevron-right" size="small" />
        </button>
        <span class="has-text-weight-semibold">
          {{ dateToText(selected.date, true) }}
        </span>
        <span class="day-totals has-text-grey">
          {{ playsToText(selected.count) }}, {{ msToText(selected.msPlayed) }}
        </span>
      </div>

      <template v-if="showTracks">
        <div
          v-for="track in getDayTracks(selected)"
          :key="track.uri"
          class="day-track"
        >
          <span>{{ track.name }}</span>
          <span class="day-totals has-text-grey">
            {{ playsToText(track.count) }}, {{ msToText(track.msPlayed) }}
          </span>
        </div>
      </template>
      <DailyListeningHours v-else :hours="getDayHours(selected)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type SpotifyHistoryEntry from '~/utils/spotifyHistory/spotifyHistoryEntry'
import type { SortBy } from '~/utils/spotifyHistory/SpotifyHistoryFilter'
import {
  getDayHours,
  getDayTracks,
  getListeningDays,
  getListeningYears,
} from '~/utils/spotifyHistory/dailyListening'
import {
  dateToText,
  getMetricValue,
  metricToText,
  playsToText,
} from '~/utils/spotifyHistory/listeningMetric'

const properties = defineProps<{
  entries: Set<SpotifyHistoryEntry>
  sortBy: SortBy
  // List the tracks played on a day, rather than the hours
  showTracks?: boolean
}>()

const highest = <T,>(items: T[], valueOf: (item: T) => number) =>
  items.reduce<T | undefined>(
    (best, item) =>
      best === undefined || valueOf(item) > valueOf(best) ? item : best,
    undefined,
  )

const days = computed(() => getListeningDays(properties.entries))
const dayKeys = computed(() => [...days.value.keys()])
const years = computed(() => getListeningYears(days.value))

const firstDay = computed(() => days.value.get(dayKeys.value[0] ?? ''))
const lastDay = computed(() => days.value.get(dayKeys.value.at(-1) ?? ''))
const bestDay = computed(() =>
  highest([...days.value], ([, day]) =>
    properties.sortBy === 'count' ? day.count : day.msPlayed,
  ),
)

const chosenYear = ref<number>()
const chosenDay = ref<string>()

// The filters can take away the chosen year or day, so fall back
const year = computed(() => {
  const chosen = years.value.find((y) => y.year === chosenYear.value)
  const most = highest(years.value, (y) => getMetricValue(y, properties.sortBy))
  return (chosen ?? most)?.year ?? new Date().getFullYear()
})
const selectedDay = computed(() =>
  chosenDay.value !== undefined && days.value.has(chosenDay.value)
    ? chosenDay.value
    : undefined,
)
const selected = computed(() => days.value.get(selectedDay.value ?? ''))

const selectedIndex = computed(() =>
  selectedDay.value === undefined
    ? -1
    : dayKeys.value.indexOf(selectedDay.value),
)
const previousDay = computed(() => dayKeys.value[selectedIndex.value - 1])
const nextDay = computed(() => dayKeys.value[selectedIndex.value + 1])

const selectYear = (value: number) => {
  chosenYear.value = value
  chosenDay.value = undefined
}

const selectDay = (key: string | undefined) => {
  const day = days.value.get(key ?? '')
  if (!day) return
  chosenDay.value = key
  chosenYear.value = day.date.getFullYear()
}

const toggleDay = (key: string) => {
  if (key === selectedDay.value) chosenDay.value = undefined
  else selectDay(key)
}
</script>

<style scoped>
.daily-listening {
  /* Validated for lightness steps and contrast on the detail row's background */
  --listening-level-0: var(--bulma-border-weak);
  --listening-level-1: #5cc183;
  --listening-level-2: #2fa25c;
  --listening-level-3: #14803c;
  --listening-level-4: #07512a;
  /* Keeps the calendar's width from stretching the table */
  contain: inline-size;
  padding: 0.75rem 0.25rem;
  text-align: left;
}

.theme-dark .daily-listening {
  --listening-level-1: #1c6b38;
  --listening-level-2: #1d9149;
  --listening-level-3: #1db954;
  --listening-level-4: #7fe6a3;
}

.facts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.facts dt {
  color: var(--bulma-text-weak);
  font-size: 0.75rem;
}

.best-day {
  margin-right: 0.4em;
  cursor: pointer;
}

.day-details {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--bulma-border-weak);
}

.day-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem 0.5rem;
  margin-bottom: 0.5rem;
}

.day-track {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
}

.day-totals {
  margin-left: auto;
  white-space: nowrap;
}
</style>
