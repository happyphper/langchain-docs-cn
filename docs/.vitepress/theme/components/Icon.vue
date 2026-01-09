<template>
  <span class="inline-icon" :style="{ fontSize: size + 'px' }">
    <font-awesome-icon :icon="resolveIcon(icon)" />
  </span>
</template>

<script setup>
import { resolveIcon } from '../icons'
defineProps({ icon: String, size: { type: [Number, String], default: 16 } })
</script>

<style scoped>
.inline-icon { display: inline-flex; align-items: center; vertical-align: middle; line-height: 1; color: inherit; }
</style>