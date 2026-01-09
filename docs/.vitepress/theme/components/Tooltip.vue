<template>
    <span class="tooltip-wrapper" @mouseenter="show = true" @mouseleave="show = false">
        <span class="tooltip-trigger">
            <slot></slot>
        </span>
        <transition name="fade">
            <div v-if="show" class="tooltip-box">
                <div class="tooltip-content">
                    {{ tip }}
                </div>
                <div v-if="href" class="tooltip-footer">
                    <a :href="href" target="_blank" class="tooltip-link">
                        {{ cta || 'Learn more' }}
                        <font-awesome-icon :icon="['fas', 'chevron-right']" class="link-icon" />
                    </a>
                </div>
                <div class="tooltip-arrow"></div>
            </div>
        </transition>
    </span>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
    tip: String,
    href: String,
    cta: String
})

const show = ref(false)
</script>

<style scoped>
.tooltip-wrapper {
    position: relative;
    display: inline-block;
    cursor: help;
}

.tooltip-trigger {
    border-bottom: 2px dotted #94a3b8;
    color: var(--vp-c-text-1);
}

.tooltip-box {
    position: absolute;
    bottom: 125%;
    left: 50%;
    transform: translateX(-50%);
    width: 240px;
    background: white;
    border: 1px solid var(--vp-c-divider);
    border-radius: 12px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    padding: 16px;
    z-index: 100;
    text-align: left;
}

.dark .tooltip-box {
    background: #1e293b;
    border-color: #334155;
}

.tooltip-content {
    font-size: 13px;
    line-height: 1.5;
    color: #475569;
}

.dark .tooltip-content {
    color: #cbd5e1;
}

.tooltip-footer {
    margin-top: 12px;
    border-top: 1px solid #f1f5f9;
    padding-top: 8px;
}

.dark .tooltip-footer {
    border-top-color: #334155;
}

.tooltip-link {
    font-size: 12px;
    font-weight: 600;
    color: #475569;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 4px;
}

.dark .tooltip-link {
    color: #cbd5e1;
}

.tooltip-link:hover {
    color: var(--vp-c-brand);
}

.link-icon {
    font-size: 10px;
}

.tooltip-arrow {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid var(--vp-c-divider);
}

.tooltip-arrow::after {
    content: '';
    position: absolute;
    top: -9px;
    left: -8px;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid white;
}

.dark .tooltip-arrow::after {
    border-top-color: #1e293b;
}

/* 动画 */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s, transform 0.2s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateX(-50%) translateY(10px);
}
</style>
