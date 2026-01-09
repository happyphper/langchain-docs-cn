<template>
    <div class="update-item">
        <div class="update-sidebar">
            <div v-if="label" class="update-label">
                {{ label }}
            </div>
            <div v-if="description" class="update-description">
                {{ description }}
            </div>
        </div>
        <div class="update-content">
            <slot></slot>
        </div>
    </div>
</template>

<script setup>
defineProps({
    label: String,
    description: String
})
</script>

<style scoped>
.update-item {
    display: flex;
    gap: 32px;
    margin-bottom: 48px;
}

.update-sidebar {
    width: 100px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-top: 4px;
}

.update-label {
    background: #f1f5f9;
    color: #475569;
    font-size: 12px;
    font-weight: 600;
    padding: 4px 8px;
    border-radius: 6px;
    text-align: center;
    white-space: nowrap;
}

.update-description {
    color: #94a3b8;
    font-size: 12px;
    text-align: left;
    padding-left: 4px;
}

.update-content {
    flex-grow: 1;
    font-size: 15px;
    line-height: 1.6;
    color: var(--vp-c-text-1);
}

.update-content :deep(p) {
    margin: 0 0 16px 0;
}

.update-content :deep(p:last-child) {
    margin-bottom: 0;
}

.update-content :deep(ul) {
    margin: 12px 0;
    padding-left: 20px;
}

.update-content :deep(li) {
    margin-bottom: 8px;
    color: var(--vp-c-text-2);
}

.update-content :deep(a) {
    color: var(--vp-c-brand);
    text-decoration: underline;
    text-underline-offset: 4px;
    font-weight: 500;
}

/* 响应式适配 */
@media (max-width: 640px) {
    .update-item {
        flex-direction: column;
        gap: 12px;
    }

    .update-sidebar {
        width: auto;
        flex-direction: row;
        align-items: center;
    }
}
</style>
