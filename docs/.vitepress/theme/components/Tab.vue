<template><div class="tab-pane"><slot></slot></div></template>
<script setup>defineProps({ title: String, icon: String })</script>
<style scoped>
.tab-pane { animation: fade-in 0.3s ease; }
@keyframes fade-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
</style>