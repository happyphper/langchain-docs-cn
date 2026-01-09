<template>
    <div class="steps-container">
        <slot></slot>
    </div>
</template>

<script setup>
</script>

<style scoped>
.steps-container {
    margin: 32px 0;
    position: relative;
    /* 重置计数器，确保本组步骤从 1 开始 */
    counter-reset: step-counter;
}
</style>
