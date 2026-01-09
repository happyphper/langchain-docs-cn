<template>
    <div class="expandable-container" :class="{ 'is-open': isOpen }">
        <div class="expandable-header" @click="isOpen = !isOpen">
            <div class="expandable-icon" :class="{ rotated: isOpen }">
                <font-awesome-icon :icon="['fas', 'chevron-right']" />
            </div>
            <span class="expandable-title">
                {{ isOpen ? 'Hide' : 'Show' }} {{ title }}
            </span>
        </div>
        <div v-show="isOpen" class="expandable-content">
            <slot></slot>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
    title: {
        type: String,
        default: 'Code'
    }
})

const isOpen = ref(false)
</script>

<style scoped>
.expandable-container {
    margin: 24px 0;
    border: 1px solid var(--vp-c-divider);
    border-radius: 12px;
    overflow: hidden;
    background: var(--vp-c-bg-soft);
    transition: all 0.3s ease;
}

.expandable-header {
    padding: 12px 16px;
    background: var(--vp-c-bg-mute);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 12px;
    user-select: none;
    transition: background 0.2s;
}

.expandable-header:hover {
    background: var(--vp-c-bg-soft);
}

.expandable-icon {
    font-size: 12px;
    color: var(--vp-c-text-3);
    transition: transform 0.2s ease;
    width: 12px;
    display: flex;
    justify-content: center;
}

.expandable-icon.rotated {
    transform: rotate(90deg);
}

.expandable-title {
    font-size: 14px;
    font-weight: 500;
    color: var(--vp-c-text-2);
}

.expandable-container.is-open .expandable-title {
    color: var(--vp-c-text-1);
}

.expandable-content {
    padding: 16px;
    background: var(--vp-c-bg);
    border-top: 1px solid var(--vp-c-divider);
    animation: slide-down 0.2s ease-out;
}

@keyframes slide-down {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

:deep(pre) {
    margin: 0 !important;
    background: transparent !important;
}

:deep(div[class*="language-"]) {
    margin: 0 !important;
    background: transparent !important;
}
</style>
