<template>
    <div class="param-field">
        <div class="param-header">
            <code class="param-name">{{ body || path }}</code>
            <span v-if="type" class="param-type">{{ type }}</span>
            <span v-if="default" class="param-default">default:"{{ default }}"</span>
            <span v-if="required" class="param-required">required</span>
        </div>
        <div class="param-content">
            <slot></slot>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    body: String,
    path: String,
    type: String,
    default: String,
    required: Boolean
})
</script>

<style scoped>
.param-field {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--vp-c-divider);
}

/* 如果是列表中的第一个，可以去掉部分样式，视具体排版需求而定
   但设计图显示都有分割线，除了可能的第一个？ 
   通常设计是：参数列表是一个整体，内部每个参数间有分割线。
   这里简化处理：保留 top border。
*/

.param-header {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
    font-family: var(--vp-font-family-mono);
}

.param-name {
    font-size: 0.8125rem;
    font-weight: 700;
    color: #1a9655 !important;
    /* 接近设计图的深绿色 */
    background: transparent !important;
    padding: 0 !important;
}

.param-type,
.param-default {
    background-color: #f3f4f6;
    color: #4b5563;
    padding: 0.125rem 0.5rem;
    border-radius: 6px;
    font-size: 0.8125rem;
    border: none;
}

.param-default {
    color: #6b7280;
}

.param-required {
    font-size: 0.75rem;
    color: #dc2626;
    font-weight: 600;
    letter-spacing: 0.05em;
}

.param-content {
    font-size: 1rem;
    line-height: 1.7;
    color: var(--vp-c-text-1);
}

.param-content :deep(p) {
    margin: 0.5rem 0;
}

/* 暗色模式适配 */
:global(.dark) .param-field {
    border-color: var(--vp-c-divider);
}

:global(.dark) .param-name {
    color: #4ade80 !important;
    /* 暗色模式下的亮绿色 */
}

:global(.dark) .param-type,
:global(.dark) .param-default {
    background-color: rgba(255, 255, 255, 0.1);
    color: #cbd5e1;
}
</style>
