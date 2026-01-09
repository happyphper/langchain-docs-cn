import { createLanguageSidebars } from './sidebar_utils';

// Learn 侧边栏模板(使用 Python 路径)
const learnTemplate = [
    { text: '学习首页', link: '/oss/python/learn' },
    {
        text: '教程',
        items: [
            {
                text: 'LangChain 基础',
                collapsed: true,
                items: [
                    { text: '语义搜索', link: '/oss/python/langchain/knowledge-base' },
                    { text: 'RAG 智能体', link: '/oss/python/langchain/rag' },
                    { text: 'SQL 智能体', link: '/oss/python/langchain/sql-agent' },
                    { text: '语音智能体', link: '/oss/python/langchain/voice-agent' }
                ]
            },
            {
                text: '多智能体实战',
                collapsed: true,
                items: [
                    { text: '子智能体：个人助手', link: '/oss/python/langchain/multi-agent/subagents-personal-assistant' },
                    { text: '任务移交：客户支持', link: '/oss/python/langchain/multi-agent/handoffs-customer-support' },
                    { text: '路由选择：知识库', link: '/oss/python/langchain/multi-agent/router-knowledge-base' },
                    { text: '技能应用：SQL 助手', link: '/oss/python/langchain/multi-agent/skills-sql-assistant' }
                ]
            },
            {
                text: 'LangGraph 核心',
                collapsed: true,
                items: [
                    { text: '自定义 RAG 智能体', link: '/oss/python/langgraph/agentic-rag' },
                    { text: '自定义 SQL 智能体', link: '/oss/python/langgraph/sql-agent' }
                ]
            }
        ]
    },
    {
        text: '架构与概念',
        items: [
            { text: '组件架构', link: '/oss/python/langchain/component-architecture' },
            { text: '记忆机制 (Memory)', link: '/oss/python/concepts/memory' },
            { text: '上下文管理 (Context)', link: '/oss/python/concepts/context' },
            { text: '图 API (Graph API)', link: '/oss/python/langgraph/graph-api' },
            { text: '函数式 API (Functional API)', link: '/oss/python/langgraph/functional-api' }
        ]
    },
    {
        text: '更多资源',
        items: [
            { text: 'LangChain 学院', link: 'https://academy.langchain.com/' },
            { text: '案例研究', link: '/oss/python/langgraph/case-studies' },
            { text: '获取帮助', link: '/oss/python/langchain/get-help' }
        ]
    }
];

// 生成 Python 和 JavaScript 两个版本
const sidebars = createLanguageSidebars(learnTemplate);

export const sidebarLearnPython = sidebars.python;
export const sidebarLearnJS = sidebars.javascript;
