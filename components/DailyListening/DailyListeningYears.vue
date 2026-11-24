<template>
  <div ref="strip" class="years" role="group" aria-label="Year">
    <button
      v-for="item in years"
      :key="item.year"
      type="button"
      class="year"
      :class="{ 'is-current': item.year === modelValue }"
      :aria-pressed="item.year === modelValue"
      :aria-label="`${item.year}, ${metricToText(item, sortBy)}`"
      @click="emit('update:modelValue', item.year)"
    >
      <span class="plot">
        <span class="value">{{ metricToText(item, sortBy) }}</span>
        <span class="bar" :style="{ height: barHeight(item) }"></span>
      </span>
      <span class="year-label">{{ item.year }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { ListeningYear } from '~/utils/spotifyHistory/dailyListening'
import type { SortBy } from '~/utils/spotifyHistory/SpotifyHistoryFilter'
import {
  getMetricValue,
  metricToText,
} from '~/utils/spotifyHistory/listeningMetric'

const properties = defineProps<{
  modelValue: number
  years: ListeningYear[]
  sortBy: SortBy
}>()

const emit = defineEmits<{ 'update:modelValue': [year: number] }>()

const highest = computed(() =>
  Math.max(
    ...properties.years.map((y) => getMetricValue(y, properties.sortBy)),
  ),
)

const barHeight = (item: ListeningYear) =>
  `${(getMetricValue(item, properties.sortBy) / highest.value) * 44}px`

const strip = ref<HTMLElement>()

// On narrow screens the years don't fit
const scrollToYear = () => {
  const element = strip.value?.querySelector('.is-current')
  if (!strip.value || !element) return

  const view = strip.value.getBoundingClientRect()
  const year = element.getBoundingClientRect()
  if (year.left < view.left || year.right > view.right) {
    strip.value.scrollLeft +=
      year.left - view.left - (view.width - year.width) / 2
  }
}

onMounted(scrollToYear)
watch(() => properties.modelValue, scrollToYear, { flush: 'post' })
</script>

<style scoped>
.years {
  display: flex;
  overflow-x: auto;
  /* Room for the scrollbar */
  padding-bottom: 6px;
}

.year {
  flex: 1 0 64px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  color: var(--bulma-text-weak);
  font-size: 0.75rem;
}

.plot {
  height: 64px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  border-bottom: 1px solid var(--bulma-border);
}

.value {
  visibility: hidden;
  white-space: nowrap;
  line-height: 18px;
}

.bar {
  width: 24px;
  border-radius: 4px 4px 0 0;
  background-color: var(--bulma-border);
}

.year-label {
  padding-top: 2px;
}

.year:hover .value,
.year:focus-visible .value,
.is-current .value {
  visibility: visible;
}

.year:hover .bar {
  background-color: var(--bulma-text-weak);
}

.is-current {
  color: var(--bulma-text-strong);
  font-weight: var(--bulma-weight-semibold);
}

.is-current .bar,
.is-current:hover .bar {
  background-color: var(--listening-level-3);
}
</style>
