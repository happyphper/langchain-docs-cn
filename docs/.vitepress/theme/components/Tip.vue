<template>
  <BaseCallout color="#10b981" backgroundColor="#ecfdf5" borderColor="#d1fae5"
    darkBackgroundColor="rgba(16, 185, 129, 0.1)" darkBorderColor="rgba(16, 185, 129, 0.2)">
    <template #icon>
      <font-awesome-icon :icon="['fas', 'lightbulb']" />
    </template>
    <slot></slot>
  </BaseCallout>
</template>

<script setup>
import BaseCallout from './BaseCallout.vue'
</script>