<template>
    <div class="frame-container">
        <slot />
    </div>
</template>

<script setup lang="ts">
// Frame 组件用于包裹 iframe 等嵌入内容
// 提供统一的样式和间距
</script>

<style scoped>
.frame-container {
    margin: 1.5rem 0;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.frame-container :deep(iframe) {
    width: 100%;
    border: none;
    display: block;
}

/* 确保 iframe 有合适的宽高比 */
.frame-container :deep(iframe.aspect-video) {
    aspect-ratio: 16 / 9;
}

/* 暗色模式适配 */
.dark .frame-container {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
}
</style>
