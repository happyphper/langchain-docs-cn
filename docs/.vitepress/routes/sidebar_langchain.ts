import { createLanguageSidebars } from './sidebar_utils';

// LangChain 侧边栏模板(使用 Python 路径)
const langchainTemplate = [
    { text: '概述', link: '/oss/python/langchain/overview' },
    {
        text: '开始使用',
        items: [
            { text: '安装', link: '/oss/python/langchain/install' },
            { text: '快速上手', link: '/oss/python/langchain/quickstart' },
            { text: '更新日志', link: 'https://docs.langchain.com/oss/python/releases/changelog' },
            { text: '设计理念', link: '/oss/python/langchain/philosophy' }
        ]
    },
    {
        text: '核心组件',
        items: [
            { text: '智能体 (Agents)', link: '/oss/python/langchain/agents' },
            { text: '模型 (Models)', link: '/oss/python/langchain/models' },
            { text: '消息 (Messages)', link: '/oss/python/langchain/messages' },
            { text: '工具 (Tools)', link: '/oss/python/langchain/tools' },
            { text: '短期记忆', link: '/oss/python/langchain/short-term-memory' },
            { text: '流式处理', link: '/oss/python/langchain/streaming' },
            { text: '结构化输出', link: '/oss/python/langchain/structured-output' }
        ]
    },
    {
        text: '中间件 (Middleware)',
        items: [
            { text: '概述', link: '/oss/python/langchain/middleware/overview' },
            { text: '内置中间件', link: '/oss/python/langchain/middleware/built-in' },
            { text: '自定义中间件', link: '/oss/python/langchain/middleware/custom' }
        ]
    },
    {
        text: '进阶用法',
        items: [
            { text: '护栏 (Guardrails)', link: '/oss/python/langchain/guardrails' },
            { text: '运行时', link: '/oss/python/langchain/runtime' },
            { text: '上下文工程', link: '/oss/python/langchain/context-engineering' },
            { text: '模型上下文协议 (MCP)', link: '/oss/python/langchain/mcp' },
            { text: '人机交互 (Human-in-the-loop)', link: '/oss/python/langchain/human-in-the-loop' },
            {
                text: '多智能体',
                collapsed: true,
                items: [
                    { text: '概述', link: '/oss/python/langchain/multi-agent' },
                    { text: '子智能体 (Subagents)', link: '/oss/python/langchain/multi-agent/subagents' },
                    { text: '任务移交 (Handoffs)', link: '/oss/python/langchain/multi-agent/handoffs' },
                    { text: '技能 (Skills)', link: '/oss/python/langchain/multi-agent/skills' },
                    { text: '路由器 (Router)', link: '/oss/python/langchain/multi-agent/router' },
                    { text: '自定义工作流', link: '/oss/python/langchain/multi-agent/custom-workflow' }
                ]
            },
            { text: '检索 (Retrieval)', link: '/oss/python/langchain/retrieval' },
            { text: '长期记忆', link: '/oss/python/langchain/long-term-memory' }
        ]
    },
    {
        text: '智能体开发',
        items: [
            { text: 'LangSmith Studio 实验室', link: '/oss/python/langchain/studio' },
            { text: '测试', link: '/oss/python/langchain/test' },
            { text: '智能体对话 UI', link: '/oss/python/langchain/ui' }
        ]
    },
    {
        text: '使用 LangSmith 部署',
        items: [
            { text: '部署 (Deployment)', link: '/oss/python/langchain/deploy' },
            { text: '可观测性 (Observability)', link: '/oss/python/langchain/observability' }
        ]
    }
];

// 生成 Python 和 JavaScript 两个版本
const sidebars = createLanguageSidebars(langchainTemplate);

export const sidebarLangChainPython = sidebars.python;
export const sidebarLangChainJS = sidebars.javascript;
