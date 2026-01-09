<template>
    <BaseCallout color="#64748b" backgroundColor="#f8fafc" borderColor="#e2e8f0"
        darkBackgroundColor="rgba(148, 163, 184, 0.1)" darkBorderColor="rgba(148, 163, 184, 0.2)">
        <template #icon>
            <font-awesome-icon :icon="['fas', 'circle-info']" />
        </template>
        <slot></slot>
    </BaseCallout>
</template>

<script setup>
import BaseCallout from './BaseCallout.vue'
</script>
