import { createLanguageSidebars } from './sidebar_utils';

// Reference 侧边栏模板(使用 Python 路径)
const referenceTemplate = [
    { text: '概述', link: '/oss/python/reference/overview' },
    {
        text: '开发参考',
        items: [
            { text: 'LangChain SDK 参考', link: 'https://reference.langchain.com/python/langchain/' },
            { text: 'LangGraph SDK 参考', link: 'https://reference.langchain.com/python/langgraph/' },
            { text: '集成组件参考', link: 'https://reference.langchain.com/python/integrations/' },
            { text: 'Deep Agents 参考', link: 'https://reference.langchain.com/python/deepagents/' }
        ]
    },
    {
        text: '错误处理',
        items: [
            { text: '常见错误参考', link: '/oss/python/common-errors' }
        ]
    },
    {
        text: '版本维护',
        items: [
            { text: '版本命名策略', link: '/oss/python/versioning' },
            { text: '更新日志', link: '/oss/python/releases/changelog' },
            {
                text: '核心发布',
                collapsed: true,
                items: [
                    { text: 'LangChain v1', link: '/oss/python/releases/langchain-v1' },
                    { text: 'LangGraph v1', link: '/oss/python/releases/langgraph-v1' }
                ]
            },
            {
                text: '迁移指南',
                collapsed: true,
                items: [
                    { text: 'LangChain v1 迁移指南', link: '/oss/python/migrate/langchain-v1' },
                    { text: 'LangGraph v1 迁移指南', link: '/oss/python/migrate/langgraph-v1' }
                ]
            }
        ]
    },
    {
        text: '政策与规范',
        items: [
            { text: '发布政策', link: '/oss/python/release-policy' },
            { text: '安全政策', link: '/oss/python/security-policy' }
        ]
    }
];

// 生成 Python 和 JavaScript 两个版本
const sidebars = createLanguageSidebars(referenceTemplate);

export const sidebarPythonReference = sidebars.python;
export const sidebarJSReference = sidebars.javascript;
