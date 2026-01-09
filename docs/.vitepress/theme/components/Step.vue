<template>
    <div class="step-item">
        <div class="step-sidebar">
            <div class="step-node"></div>
            <div class="step-line"></div>
        </div>
        <div class="step-main">
            <h3 v-if="$slots.title || title" class="step-title">
                <slot name="title">
                    <span v-html="title"></span>
                </slot>
            </h3>
            <div class="step-content">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    title: String
})
</script>

<style scoped>
.step-item {
    display: flex;
    gap: 20px;
    position: relative;
    counter-increment: step-counter;
}

.step-sidebar {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
}

.step-node {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #f1f5f9;
    color: #64748b;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 700;
    z-index: 2;
    border: 1px solid var(--vp-c-divider);
}

.step-node::before {
    content: counter(step-counter);
}

.step-line {
    flex-grow: 1;
    width: 1px;
    background: var(--vp-c-divider);
    margin: 8px 0;
}

/* 移除 last-child 隐藏逻辑，确保最后一步也有引导线向下延伸 */
/* 如果想要在步骤完全结束时消失，通常是由父容器 Steps 决定的，或者保留最后一段线以增强视觉连贯感 */

.step-main {
    padding-bottom: 32px;
    min-width: 0;
    flex-grow: 1;
    overflow: hidden;
}

.step-title {
    margin: 0 0 12px 0 !important;
    font-size: 16px;
    font-weight: 600;
    color: var(--vp-c-text-1);
    line-height: 28px;
    border-top: none !important;
    padding-top: 0 !important;
}

.step-content {
    font-size: 14px;
    color: var(--vp-c-text-2);
    line-height: 1.6;
}

.step-content :deep(div[class*="language-"]) {
    max-width: 100%;
    overflow-x: auto;
}
</style>
