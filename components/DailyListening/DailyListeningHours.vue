<template>
  <p class="caption">Plays by hour</p>
  <div class="hours" role="list">
    <div
      v-for="(count, hour) in hours"
      :key="hour"
      class="hour"
      :role="count ? 'listitem' : 'presentation'"
      :aria-label="
        count ? `${hourToText(hour)}: ${playsToText(count)}` : undefined
      "
    >
      <span class="plot" aria-hidden="true">
        <template v-if="count">
          <span class="value">{{ count }}</span>
          <span class="bar" :style="{ height: barHeight(count) }"></span>
        </template>
      </span>
      <span class="hour-label" aria-hidden="true">
        {{ hour % 6 === 0 ? hourToText(hour) : '' }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { playsToText } from '~/utils/spotifyHistory/listeningMetric'

const properties = defineProps<{
  // Plays in each of the day's 24 hours
  hours: number[]
}>()

const highest = computed(() => Math.max(...properties.hours))

const barHeight = (count: number) => `${(count / highest.value) * 44}px`

const hourToText = (hour: number) => `${String(hour).padStart(2, '0')}:00`
</script>

<style scoped>
.caption {
  color: var(--bulma-text-weak);
  font-size: 0.75rem;
}

.hours {
  display: grid;
  grid-template-columns: repeat(24, minmax(0, 1fr));
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
  font-size: 0.6875rem;
  line-height: 18px;
}

.bar {
  /* 2px between neighbouring hours on narrow screens */
  width: min(24px, 100% - 2px);
  border-radius: 4px 4px 0 0;
  background-color: var(--listening-level-3);
}

.hour-label {
  display: block;
  height: 18px;
  padding-top: 2px;
  color: var(--bulma-text-weak);
  font-size: 0.6875rem;
  line-height: 16px;
  white-space: nowrap;
}

/* Centered under the bar, past the column's own narrow width */
.hour {
  display: flex;
  flex-direction: column;
}

.hour-label {
  align-self: center;
}

.hour:first-child .hour-label {
  align-self: flex-start;
}
</style>
