<template>
    <div class="language-selector">
        <div class="selector-wrapper" @click="toggleDropdown">
            <div class="selector-display" :class="{ 'is-active': isOpen }">
                <div class="language-icon-box">
                    <Icon v-if="currentLanguage === 'python'" icon="python" size="14" />
                    <Icon v-else icon="js" size="14" />
                </div>
                <span class="language-name">{{ currentLanguage === 'python' ? 'Python' : 'TypeScript' }}</span>
                <svg class="dropdown-arrow" :class="{ 'is-open': isOpen }" width="10" height="10" viewBox="0 0 12 12"
                    fill="none">
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                        stroke-linejoin="round" />
                </svg>
            </div>
        </div>

        <Transition name="dropdown">
            <div v-if="isOpen" class="dropdown-menu">
                <div class="dropdown-item" :class="{ 'is-active': currentLanguage === 'python' }"
                    @click="selectLanguage('python')">
                    <div class="language-icon-box small">
                        <Icon icon="python" size="12" />
                    </div>
                    <span>Python</span>
                </div>
                <div class="dropdown-item" :class="{ 'is-active': currentLanguage === 'javascript' }"
                    @click="selectLanguage('javascript')">
                    <div class="language-icon-box small">
                        <Icon icon="js" size="12" />
                    </div>
                    <span>TypeScript</span>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vitepress'
import Icon from './Icon.vue'

const router = useRouter()
const route = useRoute()
const isOpen = ref(false)

const currentLanguage = computed(() => {
    if (route.path.includes('/python/')) {
        return 'python'
    } else if (route.path.includes('/javascript/')) {
        return 'javascript'
    }
    return 'python'
})

const toggleDropdown = () => {
    isOpen.value = !isOpen.value
}

const selectLanguage = (lang: 'python' | 'javascript') => {
    isOpen.value = false
    const currentPath = route.path
    let newPath = ''

    if (lang === 'python') {
        newPath = currentPath.replace('/javascript/', '/python/')
    } else {
        newPath = currentPath.replace('/python/', '/javascript/')
    }

    if (newPath !== currentPath) {
        router.go(newPath)
    }
}

const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (!target.closest('.language-selector')) {
        isOpen.value = false
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.language-selector {
    position: relative;
    margin: 16px 0;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--vp-c-divider);
}

.selector-wrapper {
    cursor: pointer;
    user-select: none;
}

.selector-display {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 8px;
    background: var(--vp-c-bg-soft);
    border: 1px solid var(--vp-c-divider);
    border-radius: 12px;
    transition: all 0.2s ease;
}

.selector-display:hover,
.selector-display.is-active {
    background: var(--vp-c-bg-mute);
    border-color: var(--vp-c-brand-1);
}

.language-icon-box {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--vp-c-bg-elv);
    border: 1px solid var(--vp-c-divider);
    border-radius: 8px;
    color: var(--vp-c-text-1);
    flex-shrink: 0;
}

.language-icon-box.small {
    width: 22px;
    height: 22px;
    border-radius: 4px;
}

.language-name {
    flex: 1;
    font-size: 13px;
    font-weight: 600;
    color: var(--vp-c-text-1);
}

.dropdown-arrow {
    flex-shrink: 0;
    color: var(--vp-c-text-3);
    transition: transform 0.2s ease;
    margin-right: 2px;
}

.dropdown-arrow.is-open {
    transform: rotate(180deg);
}

.dropdown-menu {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    background: var(--vp-c-bg-elv);
    border: 1px solid var(--vp-c-divider);
    border-radius: 10px;
    box-shadow: var(--vp-shadow-3);
    overflow: hidden;
    z-index: 100;
    padding: 4px;
}

.dropdown-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 8px;
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.2s ease;
    color: var(--vp-c-text-2);
}

.dropdown-item:hover {
    background: var(--vp-c-bg-soft);
    color: var(--vp-c-text-1);
}

.dropdown-item.is-active {
    background: var(--vp-c-brand-soft);
    color: var(--vp-c-brand-1);
}

.dropdown-item span {
    font-size: 12px;
    font-weight: 500;
}

.dropdown-enter-active,
.dropdown-leave-active {
    transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
    opacity: 0;
    transform: translateY(-4px);
}
</style>
