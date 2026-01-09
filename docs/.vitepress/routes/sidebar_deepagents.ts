import { createLanguageSidebars } from './sidebar_utils';

// DeepAgents 侧边栏模板(使用 Python 路径)
const deepagentsTemplate = [
    { text: '概述', link: '/oss/python/deepagents/overview' },
    {
        text: '开始使用',
        items: [
            { text: '快速上手', link: '/oss/python/deepagents/quickstart' },
            { text: '自定义设置', link: '/oss/python/deepagents/customization' }
        ]
    },
    {
        text: '核心能力',
        items: [
            { text: '智能体控制台 (Harness)', link: '/oss/python/deepagents/harness' },
            { text: '后端服务 (Backends)', link: '/oss/python/deepagents/backends' },
            { text: '子智能体 (Subagents)', link: '/oss/python/deepagents/subagents' },
            { text: '人机交互 (Human-in-the-loop)', link: '/oss/python/deepagents/human-in-the-loop' },
            { text: '长期记忆', link: '/oss/python/deepagents/long-term-memory' },
            { text: '中间件 (Middleware)', link: '/oss/python/deepagents/middleware' }
        ]
    },
    {
        text: '命令行界面 (CLI)',
        items: [
            { text: '使用 CLI 工具', link: '/oss/python/deepagents/cli' }
        ]
    }
];

// 生成 Python 和 JavaScript 两个版本
const sidebars = createLanguageSidebars(deepagentsTemplate);

export const sidebarDeepAgentsPython = sidebars.python;
export const sidebarDeepAgentsJS = sidebars.javascript;
