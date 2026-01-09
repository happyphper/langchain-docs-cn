<script setup lang="ts">
import { useData, useRoute } from 'vitepress'
import { computed, ref } from 'vue'

const { page, frontmatter, theme } = useData()
const route = useRoute()

// 计算分类（从侧边栏配置中获取所属的分组名称）
const category = computed(() => {
    if (frontmatter.value.category) return frontmatter.value.category

    const sidebar = theme.value.sidebar
    if (!sidebar) return null

    // 1. 寻找最匹配的侧边栏路径键
    const path = route.path
    const sidebarKeys = Object.keys(sidebar)
    const matchingKey = sidebarKeys
        .filter(key => path.startsWith(key))
        .sort((a, b) => b.length - a.length)[0]

    if (!matchingKey) return null

    const items = sidebar[matchingKey]

    // 2. 在该侧边栏中查找包含当前页面的分组
    // 注意：VitePress 路径可能带 .html 或不带，这里做兼容处理
    const currentPath = path.replace(/\.html$/, '')
    const currentPathWithHtml = currentPath + '.html'

    for (const group of items) {
        if (group.items) {
            const found = group.items.find(item =>
                item.link === currentPath || item.link === currentPathWithHtml
            )
            if (found) {
                // 如果分组标题与页面标题一致，通常说明不需要分类展示
                if (group.text === page.value.title) return null
                return group.text
            }
        }
    }

    return null
})

// 复制原始 Markdown 内容逻辑
const showCopied = ref(false)
const copyRawContent = async () => {
    try {
        // 构建原始 md 文件的请求路径
        // VitePress 环境下，当前页面的源路径可通过 page.relativeSection 类似方式推断
        // 最稳妥的方式是基于 route.path，VitePress 默认会将 .md 映射为同名地址
        const rawPath = route.path.replace(/\.html$/, '') + '.md'

        const response = await fetch(rawPath)
        if (!response.ok) throw new Error('Failed to fetch source')

        const content = await response.text()

        await navigator.clipboard.writeText(content)

        showCopied.value = true
        setTimeout(() => {
            showCopied.value = false
        }, 2000)
    } catch (err) {
        console.error('Failed to copy raw content:', err)
        // 退化方案：如果 fetch 失败，至少复制 URL
        navigator.clipboard.writeText(window.location.href)
    }
}
</script>

<template>
    <div class="page-header" v-if="!frontmatter.home && frontmatter.mode !== 'custom' && frontmatter.sidebar !== false">
        <div class="breadcrumb" v-if="category">{{ category }}</div>
        <div class="header-content">
            <h1 class="page-title">{{ page.title }}</h1>

            <div class="actions">
                <button class="copy-button" @click="copyRawContent">
                    <font-awesome-icon :icon="['fas', 'copy']" class="icon" />
                    <span>{{ showCopied ? 'Copied!' : 'Copy page' }}</span>
                </button>
                <div class="action-dropdown">
                    <font-awesome-icon :icon="['fas', 'chevron-down']" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.page-header {
    margin-bottom: 2rem;
}

.breadcrumb {
    font-size: 0.875rem;
    color: var(--vp-c-text-2);
    margin-bottom: 0.5rem;
    font-weight: 500;
}

.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
}

.page-title {
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    font-size: 2.25rem !important;
    font-weight: 700 !important;
    line-height: 1.2 !important;
    letter-spacing: -0.02em !important;
}

.actions {
    display: flex;
    align-items: center;
    background: var(--vp-c-bg-soft);
    border: 1px solid var(--vp-c-divider);
    border-radius: 8px;
    overflow: hidden;
    height: 36px;
}

.copy-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 12px;
    height: 100%;
    font-size: 0.875rem;
    color: var(--vp-c-text-1);
    transition: background 0.2s;
    border-right: 1px solid var(--vp-c-divider);
}

.copy-button:hover {
    background: var(--vp-c-default-soft);
}

.copy-button .icon {
    font-size: 14px;
}

.action-dropdown {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 10px;
    height: 100%;
    color: var(--vp-c-text-2);
    cursor: pointer;
}

.action-dropdown:hover {
    background: var(--vp-c-default-soft);
}

@media (max-width: 768px) {
    .header-content {
        flex-direction: column;
        align-items: flex-start;
    }

    .actions {
        align-self: flex-start;
        margin-top: 1rem;
    }
}
</style>
