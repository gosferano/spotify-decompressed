<template>
  <div
    ref="wrapper"
    class="calendar-wrapper"
    @pointerover="showTooltip"
    @pointerleave="tooltip = undefined"
  >
    <div ref="scroller" class="scroller" @scroll="tooltip = undefined">
      <div class="calendar" :style="{ '--weeks': weeks }">
        <span class="corner"></span>
        <span
          v-for="(label, index) in WEEKDAYS"
          :key="index"
          class="weekday"
          :style="{ gridRow: index + 2 }"
        >
          {{ label }}
        </span>
        <span
          v-for="month in months"
          :key="month.key"
          class="month"
          :style="{ gridColumn: month.week + 2 }"
        >
          {{ month.label }}
        </span>
        <!-- Out of the tab order: 365 stops. The best day and the previous
             and next day buttons reach the same days from the keyboard -->
        <button
          v-for="cell in cells"
          :key="cell.key"
          type="button"
          tabindex="-1"
          class="day"
          :class="[`is-level-${cell.level}`, { 'is-current': cell.isSelected }]"
          :data-day="cell.key"
          :disabled="cell.level === 0"
          :aria-label="cell.label"
          :style="{ gridColumn: cell.week + 2, gridRow: cell.weekday + 2 }"
          @click="emit('update:modelValue', cell.key)"
        ></button>
      </div>
    </div>

    <div
      v-if="tooltip"
      ref="tooltipElement"
      class="calendar-tooltip"
      :style="{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }"
    >
      {{ tooltip.text }}
    </div>

    <div class="legend">
      <span>
        {{ sortBy === 'count' ? 'Plays per day' : 'Minutes per day' }}
      </span>
      <span v-for="(label, level) in legend" :key="level">
        <span class="swatch" :class="`is-level-${level}`"></span>{{ label }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  getCalendarDays,
  getLevel,
  getLevelThresholds,
  type ListeningDay,
} from '~/utils/spotifyHistory/dailyListening'
import type { SortBy } from '~/utils/spotifyHistory/SpotifyHistoryFilter'
import {
  dateToText,
  getMetricValue,
  metricToText,
} from '~/utils/spotifyHistory/listeningMetric'

const WEEKDAYS = ['Mon', '', 'Wed', '', 'Fri', '', '']

const properties = defineProps<{
  // Key of the selected day
  modelValue: string | undefined
  year: number
  days: Map<string, ListeningDay>
  sortBy: SortBy
}>()

const emit = defineEmits<{ 'update:modelValue': [day: string] }>()

// Over all years, so a colour means the same whichever year is shown
const thresholds = computed(() =>
  getLevelThresholds(
    [...properties.days.values()].map((day) =>
      getMetricValue(day, properties.sortBy),
    ),
  ),
)

const cells = computed(() =>
  getCalendarDays(properties.year).map((cell) => {
    const day = properties.days.get(cell.key)
    const text = day ? metricToText(day, properties.sortBy) : 'not played'
    return {
      ...cell,
      level: day
        ? getLevel(getMetricValue(day, properties.sortBy), thresholds.value)
        : 0,
      label: `${dateToText(cell.date, true)}: ${text}`,
      isSelected: cell.key === properties.modelValue,
    }
  }),
)

const weeks = computed(() => (cells.value.at(-1)?.week ?? 0) + 1)

const months = computed(() =>
  cells.value
    .filter((cell) => cell.date.getDate() === 1)
    .map((cell) => ({
      key: cell.key,
      week: cell.week,
      label: cell.date.toLocaleDateString('en-GB', { month: 'short' }),
    })),
)

const legend = computed(() => {
  const starts = [1, ...thresholds.value]
  return [
    '0',
    ...starts.map((start, index) => {
      const next = starts[index + 1]
      if (next === undefined) return `${start}+`
      return next - 1 > start ? `${start}–${next - 1}` : `${start}`
    }),
  ]
})

const scroller = ref<HTMLElement>()

// On narrow screens the year doesn't fit. Only moves the calendar sideways;
// scrollIntoView would also scroll the page
const scrollToDay = () => {
  const target =
    cells.value.find((cell) => cell.isSelected) ??
    cells.value.findLast((cell) => cell.level > 0)
  const element = scroller.value?.querySelector<HTMLElement>(
    `[data-day="${target?.key}"]`,
  )
  if (!scroller.value || !element) return

  const view = scroller.value.getBoundingClientRect()
  const day = element.getBoundingClientRect()
  // The weekday labels cover the left edge
  if (day.left < view.left + 40 || day.right > view.right) {
    scroller.value.scrollLeft +=
      day.left - view.left - (view.width - day.width) / 2
  }
}

onMounted(scrollToDay)
watch(() => [properties.year, properties.modelValue], scrollToDay, {
  flush: 'post',
})

const wrapper = ref<HTMLElement>()
const tooltipElement = ref<HTMLElement>()
const tooltip = ref<{ text: string; x: number; y: number }>()

const showTooltip = async (event: PointerEvent) => {
  const element = (event.target as HTMLElement).closest('[data-day]')
  // A tap opens the day's details instead
  if (!element || !wrapper.value || event.pointerType !== 'mouse') {
    tooltip.value = undefined
    return
  }

  const box = wrapper.value.getBoundingClientRect()
  const day = element.getBoundingClientRect()
  const text = element.getAttribute('aria-label') ?? ''
  const center = day.left - box.left + day.width / 2
  const y = day.top - box.top - 34
  tooltip.value = { text, x: center, y }

  await nextTick()
  if (tooltip.value?.text !== text) return
  const width = tooltipElement.value?.offsetWidth ?? 0
  const x = Math.max(0, Math.min(box.width - width, center - width / 2))
  tooltip.value = { text, x, y }
}
</script>

<style scoped>
.calendar-wrapper {
  position: relative;
}

.scroller {
  overflow-x: auto;
  /* Room for the selected day's outline */
  padding: 2px 2px 6px 0;
}

.calendar {
  --day-size: 12px;
  display: grid;
  grid-template-columns: 30px repeat(
      var(--weeks),
      minmax(var(--day-size), 1fr)
    );
  grid-template-rows: 18px;
  gap: 2px;
  min-width: max-content;
}

@media screen and (max-width: 768px) {
  .calendar {
    --day-size: 18px;
  }
}

.corner,
.weekday {
  position: sticky;
  left: 0;
  z-index: 1;
  grid-column: 1;
  background-color: var(--bulma-scheme-main-bis);
}

.corner {
  grid-row: 1;
}

.weekday,
.month {
  color: var(--bulma-text-weak);
  font-size: 0.6875rem;
  line-height: 1;
  align-content: center;
}

.month {
  grid-row: 1;
  width: 0;
  white-space: nowrap;
}

.day {
  aspect-ratio: 1;
  width: 100%;
  border-radius: 2px;
  cursor: pointer;
}

.day:disabled {
  cursor: default;
}

.day.is-current {
  outline: 2px solid var(--bulma-text-strong);
}

.is-level-0 {
  background-color: var(--listening-level-0);
}

.is-level-1 {
  background-color: var(--listening-level-1);
}

.is-level-2 {
  background-color: var(--listening-level-2);
}

.is-level-3 {
  background-color: var(--listening-level-3);
}

.is-level-4 {
  background-color: var(--listening-level-4);
}

.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 0 0.75rem;
  color: var(--bulma-text-weak);
  font-size: 0.75rem;
}

.swatch {
  display: inline-block;
  width: 10px;
  height: 10px;
  margin-right: 5px;
  border-radius: 2px;
}

.calendar-tooltip {
  position: absolute;
  z-index: 2;
  padding: 4px 8px;
  border-radius: var(--bulma-radius);
  background-color: var(--bulma-text-strong);
  color: var(--bulma-scheme-main);
  font-size: 0.75rem;
  line-height: 20px;
  white-space: nowrap;
  pointer-events: none;
}
</style>
