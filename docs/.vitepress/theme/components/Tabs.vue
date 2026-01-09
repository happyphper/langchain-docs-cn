<template>
  <div class="tabs-container">
    <div class="tabs-header">
      <div v-for="(tab, index) in tabs" :key="index" :class="['tab-item', { active: activeIndex === index }]" @click="activeIndex = index">
        <div v-if="tab.props.icon" class="tab-icon">
          <font-awesome-icon :icon="resolveIcon(tab.props.icon)" />
        </div>
        {{ tab.props.title }}
      </div>
    </div>
    <div class="tabs-content">
      <component :is="activeTab"></component>
    </div>
  </div>
</template>

<script setup>
import { ref, useSlots, computed } from 'vue'
import { resolveIcon } from '../icons'

const slots = useSlots()
const activeIndex = ref(0)
const tabs = computed(() => slots.default ? slots.default().filter(v => v.type.__name === 'Tab') : [])
const activeTab = computed(() => tabs.value[activeIndex.value] || null)
</script>

<style scoped>
.tabs-container { margin: 24px 0; }
.tabs-header { display: flex; gap: 24px; border-bottom: 1px solid var(--vp-c-divider); margin-bottom: 16px; }
.tab-item { padding: 12px 0; cursor: pointer; font-size: 14px; font-weight: 600; color: var(--vp-c-text-2); border-bottom: 2px solid transparent; transition: all 0.2s; display: flex; align-items: center; gap: 8px; }
.tab-item:hover { color: var(--vp-c-text-1); }
.tab-item.active { color: var(--vp-c-brand); border-bottom-color: var(--vp-c-brand); }
.tab-icon { display: flex; align-items: center; font-size: 16px; height: 16px; }
</style>