<template>
    <BaseCallout color="#e11d48" backgroundColor="#fff1f2" borderColor="#fecdd3"
        darkBackgroundColor="rgba(225, 29, 72, 0.1)" darkBorderColor="rgba(225, 29, 72, 0.2)">
        <template #icon>
            <font-awesome-icon :icon="['fas', 'triangle-exclamation']" />
        </template>
        <slot></slot>
    </BaseCallout>
</template>

<script setup>
import BaseCallout from './BaseCallout.vue'
</script>
