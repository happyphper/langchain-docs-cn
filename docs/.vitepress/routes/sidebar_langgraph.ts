import { createLanguageSidebars } from './sidebar_utils';

// LangGraph 侧边栏模板(使用 Python 路径)
const langgraphTemplate = [
    { text: '概述', link: '/oss/python/langgraph/overview' },
    {
        text: '开始使用',
        items: [
            { text: '安装', link: '/oss/python/langgraph/install' },
            { text: '快速上手', link: '/oss/python/langgraph/quickstart' },
            { text: '本地服务器', link: '/oss/python/langgraph/local-server' },
            { text: '更新日志', link: 'https://docs.langchain.com/oss/python/releases/changelog' },
            { text: 'LangGraph 设计思维', link: '/oss/python/langgraph/thinking-in-langgraph' },
            { text: '工作流与智能体', link: '/oss/python/langgraph/workflows-agents' }
        ]
    },
    {
        text: '功能特性',
        items: [
            { text: '持久化 (Persistence)', link: '/oss/python/langgraph/persistence' },
            { text: '持久执行', link: '/oss/python/langgraph/durable-execution' },
            { text: '流式输出 (Streaming)', link: '/oss/python/langgraph/streaming' },
            { text: '中断 (Interrupts)', link: '/oss/python/langgraph/interrupts' },
            { text: '时间旅行 (Time Travel)', link: '/oss/python/langgraph/use-time-travel' },
            { text: '记忆功能', link: '/oss/python/langgraph/add-memory' },
            { text: '子图 (Subgraphs)', link: '/oss/python/langgraph/use-subgraphs' }
        ]
    },
    {
        text: '生产环境',
        items: [
            { text: '应用结构', link: '/oss/python/langgraph/application-structure' },
            { text: '测试', link: '/oss/python/langgraph/test' },
            { text: 'LangSmith Studio 实验室', link: '/oss/python/langgraph/studio' },
            { text: '智能体对话 UI', link: '/oss/python/langgraph/ui' },
            { text: 'LangSmith 部署', link: '/oss/python/langgraph/deploy' },
            { text: 'LangSmith 可观测性', link: '/oss/python/langgraph/observability' }
        ]
    },
    {
        text: 'LangGraph APIs 接口',
        items: [
            {
                text: '图 API (Graph API)',
                collapsed: true,
                items: [
                    { text: '选择合适的 API', link: '/oss/python/langgraph/choosing-apis' },
                    { text: '图 API 详解', link: '/oss/python/langgraph/graph-api' },
                    { text: '使用图 API', link: '/oss/python/langgraph/use-graph-api' }
                ]
            },
            {
                text: '函数式 API (Functional API)',
                collapsed: true,
                items: [
                    { text: '函数式 API 详解', link: '/oss/python/langgraph/functional-api' },
                    { text: '使用函数式 API', link: '/oss/python/langgraph/use-functional-api' }
                ]
            },
            { text: '运行时 (Runtime)', link: '/oss/python/langgraph/pregel' }
        ]
    }
];

// 生成 Python 和 JavaScript 两个版本
const sidebars = createLanguageSidebars(langgraphTemplate);

export const sidebarLangGraphPython = sidebars.python;
export const sidebarLangGraphJS = sidebars.javascript;
