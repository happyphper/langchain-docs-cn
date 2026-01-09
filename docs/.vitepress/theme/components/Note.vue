<template>
    <BaseCallout color="#007aff" backgroundColor="#f0f7ff" borderColor="#cce3ff"
        darkBackgroundColor="rgba(59, 130, 246, 0.1)" darkBorderColor="rgba(59, 130, 246, 0.2)">
        <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
        </template>
        <slot></slot>
    </BaseCallout>
</template>

<script setup>
import BaseCallout from './BaseCallout.vue'
</script>
