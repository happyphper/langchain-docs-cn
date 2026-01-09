<template>
  <BaseCallout :color="props.color || 'var(--vp-c-brand)'" :backgroundColor="dynamicBg" :borderColor="dynamicBorder"
    :darkBackgroundColor="darkBg" :darkBorderColor="darkBorder">
    <template v-if="icon" #icon>
      <font-awesome-icon :icon="resolveIcon(icon)" />
    </template>
    <slot></slot>
  </BaseCallout>
</template>

<script setup>
import { computed } from 'vue'
import BaseCallout from './BaseCallout.vue'
import { resolveIcon } from '../icons'

const props = defineProps({
  icon: String,
  color: String,
  iconType: String
})

// 根据主色调动态生成极浅背景 (10% 不透明度)
const dynamicBg = computed(() => {
  if (!props.color) return '#f0f7ff'
  if (props.color.startsWith('var')) return 'var(--vp-c-bg-soft)'
  return `${props.color}1a`
})

// 根据主色调动态生成边框 (30% 不透明度)
const dynamicBorder = computed(() => {
  if (!props.color) return '#cce3ff'
  if (props.color.startsWith('var')) return 'var(--vp-c-divider)'
  return `${props.color}4d`
})

const darkBg = computed(() => {
  return 'rgba(255, 255, 255, 0.05)'
})

const darkBorder = computed(() => {
  if (!props.color) return 'rgba(255, 255, 255, 0.1)'
  if (props.color.startsWith('var')) return 'rgba(255, 255, 255, 0.1)'
  return `${props.color}66`
})
</script>