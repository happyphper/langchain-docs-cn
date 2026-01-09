<template>
  <a :href="href" class="card-link">
    <div class="card">
      <div v-if="arrow" class="card-arrow-top">
        <font-awesome-icon :icon="['fas', 'arrow-up-right-from-square']" class="arrow-icon-small" />
      </div>
      <div v-if="icon" class="card-icon">
        <font-awesome-icon :icon="resolveIcon(icon)" />
      </div>
      <div class="card-content">
        <h3 class="card-title">{{ title }}</h3>
        <div class="card-description">
          <slot></slot>
        </div>
        <div v-if="cta" class="card-cta">
          {{ cta }} <span class="arrow">→</span>
        </div>
      </div>
    </div>
  </a>
</template>

<script setup>
import { resolveIcon } from '../icons'
defineProps({ title: String, href: String, icon: String, cta: String, arrow: Boolean })
</script>

<style scoped>
.card-link {
  text-decoration: none;
  color: inherit;
  display: block;
  height: 100%;
  margin-bottom: 8px;
}

.card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 24px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 16px;
  position: relative;
  height: 100%;
  box-sizing: border-box;
}

.card-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  height: 100%;
}

.card-description :deep(p) {
  margin: 0 !important;
  padding: 0 !important;
}

/* 额外保险：针对可能的嵌套情况 */
.card-description :deep(p:first-child) {
  margin-top: 0 !important;
}

.card-description :deep(p:last-child) {
  margin-bottom: 0 !important;
}

.card:hover {
  border-color: var(--vp-c-brand);
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.card-arrow-top {
  position: absolute;
  top: 16px;
  right: 16px;
  font-size: 12px;
  color: var(--vp-c-text-3);
  opacity: 0.5;
}

.card-icon {
  font-size: 24px;
  color: #40787a;
  height: 24px;
  display: flex;
  align-items: center;
  margin-top: 2px;
  /* 与标题行对齐 */
}

.card-title {
  margin: 0 0 8px 0 !important;
  padding: 0 !important;
  font-size: 18px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  line-height: 1.4;
}

.card-description {
  margin: 0;
  padding: 0;
  font-size: 14px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  flex-grow: 1;
}

.card-cta {
  margin-top: auto;
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-brand);
  display: flex;
  align-items: center;
  gap: 4px;
}

.arrow {
  transition: transform 0.2s;
}

.card:hover .arrow {
  transform: translateX(4px);
}

.arrow-icon-small {
  font-size: 14px;
}
</style>