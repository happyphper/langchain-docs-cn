<template>
  <div class="card-group" :style="gridStyle">
    <slot></slot>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({ cols: { type: [Number, String], default: 3 } })
const gridStyle = computed(() => ({ gridTemplateColumns: `repeat(${props.cols}, minmax(0, 1fr))` }))
</script>

<style scoped>
.card-group {
  display: grid;
  gap: 24px;
  margin: 24px 0;
}

.card-group :deep(.card-link) {
  margin-bottom: 0 !important;
}

@media (max-width: 960px) {
  .card-group {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  }
}

@media (max-width: 640px) {
  .card-group {
    grid-template-columns: 1fr !important;
  }
}
</style>