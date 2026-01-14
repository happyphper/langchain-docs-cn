import { createLanguageSidebars } from './sidebar_utils';

// Learn 侧边栏模板
const template = [
    {
        "text": "学习",
        "link": "/oss/python/learn"
    },
    {
        "text": "教程（Tutorials）",
        "collapsed": false,
        "items": [
            {
                "text": "LangChain",
                "collapsed": false,
                "items": [
                    {
                        "text": "知识库",
                        "link": "/oss/python/langchain/knowledge-base"
                    },
                    {
                        "text": "检索增强生成（RAG）",
                        "link": "/oss/python/langchain/rag"
                    },
                    {
                        "text": "SQL 智能体",
                        "link": "/oss/python/langchain/sql-agent"
                    },
                    {
                        "text": "语音智能体",
                        "link": "/oss/python/langchain/voice-agent"
                    }
                ]
            },
            {
                "text": "多智能体（Multi-agent）",
                "collapsed": false,
                "items": [
                    {
                        "text": "子智能体 - 个人助理",
                        "link": "/oss/python/langchain/multi-agent/subagents-personal-assistant"
                    },
                    {
                        "text": "交接 - 客户支持",
                        "link": "/oss/python/langchain/multi-agent/handoffs-customer-support"
                    },
                    {
                        "text": "路由器 - 知识库",
                        "link": "/oss/python/langchain/multi-agent/router-knowledge-base"
                    },
                    {
                        "text": "技能 - SQL 助手",
                        "link": "/oss/python/langchain/multi-agent/skills-sql-assistant"
                    }
                ]
            },
            {
                "text": "LangGraph",
                "collapsed": false,
                "items": [
                    {
                        "text": "智能体化 RAG",
                        "link": "/oss/python/langgraph/agentic-rag"
                    },
                    {
                        "text": "SQL 智能体",
                        "link": "/oss/python/langgraph/sql-agent"
                    }
                ]
            }
        ]
    },
    {
        "text": "概念概述",
        "collapsed": false,
        "items": [
            {
                "text": "组件架构",
                "link": "/oss/python/langchain/component-architecture"
            },
            {
                "text": "记忆（Memory）",
                "link": "/oss/python/concepts/memory"
            },
            {
                "text": "上下文",
                "link": "/oss/python/concepts/context"
            },
            {
                "text": "图 API（Graph API）",
                "link": "/oss/python/langgraph/graph-api"
            },
            {
                "text": "函数式 API（Functional API）",
                "link": "/oss/python/langgraph/functional-api"
            }
        ]
    },
    {
        "text": "其他资源",
        "collapsed": false,
        "items": [
            {
                "text": "学院",
                "link": "/oss/python/langchain/academy"
            },
            {
                "text": "案例研究",
                "link": "/oss/python/langgraph/case-studies"
            },
            {
                "text": "获取帮助",
                "link": "/oss/python/langchain/get-help"
            }
        ]
    }
];

// 生成 Python 和 JavaScript 两个版本
const sidebars = createLanguageSidebars(template);

export const sidebarLearnPython = sidebars.python;
export const sidebarLearnJS = sidebars.javascript;
