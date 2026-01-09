<template>
  <div class="columns-container" :style="gridStyle">
    <slot></slot>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({ cols: { type: [Number, String], default: 2 } })
const gridStyle = computed(() => ({ 
  gridTemplateColumns: `repeat(${props.cols}, minmax(0, 1fr))` 
}))
</script>

<style scoped>
.columns-container { display: grid; gap: 24px; margin: 24px 0; }
@media (max-width: 768px) { .columns-container { grid-template-columns: 1fr !important; } }
</style>