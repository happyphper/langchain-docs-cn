<template>
    <div class="callout-container" :style="containerStyle">
        <div class="callout-icon" :style="{ color: color }">
            <slot name="icon"></slot>
        </div>
        <div class="callout-content">
            <slot></slot>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    color: { type: String, default: '#007aff' },
    backgroundColor: { type: String, default: '#f0f7ff' },
    borderColor: { type: String, default: '#cce3ff' },
    darkBackgroundColor: { type: String, default: 'rgba(0, 122, 255, 0.1)' },
    darkBorderColor: { type: String, default: 'rgba(0, 122, 255, 0.2)' }
})

const containerStyle = computed(() => ({
    '--callout-bg': props.backgroundColor,
    '--callout-border': props.borderColor,
    '--callout-dark-bg': props.darkBackgroundColor,
    '--callout-dark-border': props.darkBorderColor
}))
</script>

<style scoped>
.callout-container {
    margin: 24px 0;
    padding: 16px 24px;
    background-color: var(--callout-bg);
    border: 1px solid var(--callout-border);
    border-radius: 16px;
    display: flex;
    align-items: center;
    gap: 16px;
    transition: all 0.3s ease;
}

:global(.dark) .callout-container {
    background-color: var(--callout-dark-bg);
    border-color: var(--callout-dark-border);
}

.callout-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 15px;
    line-height: 1.6;
}

.callout-content {
    font-size: 15px;
    line-height: 1.6;
    color: #1e293b;
    flex: 1;
}

:global(.dark) .callout-content {
    color: var(--vp-c-text-1);
}

.callout-content :deep(p) {
    margin: 0;
}

.callout-content :deep(code) {
    background-color: rgba(0, 0, 0, 0.05);
    padding: 2px 4px;
    border-radius: 4px;
}

:global(.dark) .callout-content :deep(code) {
    background-color: rgba(255, 255, 255, 0.1);
}
</style>
