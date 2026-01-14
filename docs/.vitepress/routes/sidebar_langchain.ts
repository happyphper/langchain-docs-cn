import { createLanguageSidebars } from './sidebar_utils';

// LangChain 侧边栏模板
const template = [
    {
        "text": "概述",
        "link": "/oss/python/langchain/overview"
    },
    {
        "text": "入门指南",
        "collapsed": false,
        "items": [
            {
                "text": "安装",
                "link": "/oss/python/langchain/install"
            },
            {
                "text": "快速开始",
                "link": "/oss/python/langchain/quickstart"
            },
            {
                "text": "更新日志（Python）",
                "link": "/oss/python/langchain/changelog-py"
            },
            {
                "text": "设计理念",
                "link": "/oss/python/langchain/philosophy"
            }
        ]
    },
    {
        "text": "核心组件",
        "collapsed": false,
        "items": [
            {
                "text": "智能体（Agents）",
                "link": "/oss/python/langchain/agents"
            },
            {
                "text": "模型",
                "link": "/oss/python/langchain/models"
            },
            {
                "text": "消息",
                "link": "/oss/python/langchain/messages"
            },
            {
                "text": "工具",
                "link": "/oss/python/langchain/tools"
            },
            {
                "text": "短期记忆",
                "link": "/oss/python/langchain/short-term-memory"
            },
            {
                "text": "流式传输（Streaming）",
                "collapsed": false,
                "items": [
                    {
                        "text": "概述",
                        "link": "/oss/python/langchain/streaming/overview"
                    },
                    {
                        "text": "前端",
                        "link": "/oss/python/langchain/streaming/frontend"
                    }
                ]
            },
            {
                "text": "结构化输出",
                "link": "/oss/python/langchain/structured-output"
            }
        ]
    },
    {
        "text": "中间件（Middleware）",
        "collapsed": false,
        "items": [
            {
                "text": "概述",
                "link": "/oss/python/langchain/middleware/overview"
            },
            {
                "text": "内置",
                "link": "/oss/python/langchain/middleware/built-in"
            },
            {
                "text": "自定义",
                "link": "/oss/python/langchain/middleware/custom"
            }
        ]
    },
    {
        "text": "高级用法",
        "collapsed": false,
        "items": [
            {
                "text": "护栏（Guardrails）",
                "link": "/oss/python/langchain/guardrails"
            },
            {
                "text": "运行时",
                "link": "/oss/python/langchain/runtime"
            },
            {
                "text": "上下文工程",
                "link": "/oss/python/langchain/context-engineering"
            },
            {
                "text": "模型上下文协议（MCP）",
                "link": "/oss/python/langchain/mcp"
            },
            {
                "text": "人在回路",
                "link": "/oss/python/langchain/human-in-the-loop"
            },
            {
                "text": "多智能体（Multi-agent）",
                "collapsed": false,
                "items": [
                    {
                        "text": "索引",
                        "link": "/oss/python/langchain/multi-agent/index"
                    },
                    {
                        "text": "子智能体（Subagents）",
                        "link": "/oss/python/langchain/multi-agent/subagents"
                    },
                    {
                        "text": "交接（Handoffs）",
                        "link": "/oss/python/langchain/multi-agent/handoffs"
                    },
                    {
                        "text": "技能",
                        "link": "/oss/python/langchain/multi-agent/skills"
                    },
                    {
                        "text": "路由器（Router）",
                        "link": "/oss/python/langchain/multi-agent/router"
                    },
                    {
                        "text": "自定义工作流",
                        "link": "/oss/python/langchain/multi-agent/custom-workflow"
                    }
                ]
            },
            {
                "text": "检索（Retrieval）",
                "link": "/oss/python/langchain/retrieval"
            },
            {
                "text": "长期记忆",
                "link": "/oss/python/langchain/long-term-memory"
            }
        ]
    },
    {
        "text": "智能体开发",
        "collapsed": false,
        "items": [
            {
                "text": "工作室",
                "link": "/oss/python/langchain/studio"
            },
            {
                "text": "测试",
                "link": "/oss/python/langchain/test"
            },
            {
                "text": "用户界面",
                "link": "/oss/python/langchain/ui"
            }
        ]
    },
    {
        "text": "使用 LangSmith 部署",
        "collapsed": false,
        "items": [
            {
                "text": "部署（Deployment）",
                "link": "/oss/python/langchain/deploy"
            },
            {
                "text": "可观测性（Observability）",
                "link": "/oss/python/langchain/observability"
            }
        ]
    }
];

// 生成 Python 和 JavaScript 两个版本
const sidebars = createLanguageSidebars(template);

export const sidebarLangChainPython = sidebars.python;
export const sidebarLangChainJS = sidebars.javascript;
