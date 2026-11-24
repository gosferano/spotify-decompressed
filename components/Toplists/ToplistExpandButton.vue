<template>
  <!-- No click handler: the click reaches the row, which toggles -->
  <button
    type="button"
    class="expand-button has-text-grey"
    aria-label="Daily listening"
    :aria-expanded="expanded"
  >
    <o-icon :icon="expanded ? 'chevron-up' : 'chevron-down'" size="small" />
  </button>
</template>

<script setup lang="ts">
defineProps<{ expanded: boolean }>()
</script>

<style scoped>
.expand-button {
  margin-left: 0.4em;
  cursor: pointer;
  vertical-align: middle;
}
</style>
