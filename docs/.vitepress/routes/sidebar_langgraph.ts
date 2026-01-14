import { createLanguageSidebars } from './sidebar_utils';

// LangGraph 侧边栏模板
const template = [
    {
        "text": "概述",
        "link": "/oss/python/langgraph/overview"
    },
    {
        "text": "入门指南",
        "collapsed": false,
        "items": [
            {
                "text": "安装",
                "link": "/oss/python/langgraph/install"
            },
            {
                "text": "快速开始",
                "link": "/oss/python/langgraph/quickstart"
            },
            {
                "text": "本地服务器",
                "link": "/oss/python/langgraph/local-server"
            },
            {
                "text": "更新日志（Python）",
                "link": "/oss/python/langgraph/changelog-py"
            },
            {
                "text": "LangGraph 设计思想",
                "link": "/oss/python/langgraph/thinking-in-langgraph"
            },
            {
                "text": "工作流与智能体",
                "link": "/oss/python/langgraph/workflows-agents"
            }
        ]
    },
    {
        "text": "能力",
        "collapsed": false,
        "items": [
            {
                "text": "持久化",
                "link": "/oss/python/langgraph/persistence"
            },
            {
                "text": "持久化执行",
                "link": "/oss/python/langgraph/durable-execution"
            },
            {
                "text": "流式传输（Streaming）",
                "link": "/oss/python/langgraph/streaming"
            },
            {
                "text": "中断",
                "link": "/oss/python/langgraph/interrupts"
            },
            {
                "text": "使用时间旅行",
                "link": "/oss/python/langgraph/use-time-travel"
            },
            {
                "text": "添加记忆",
                "link": "/oss/python/langgraph/add-memory"
            },
            {
                "text": "使用子图",
                "link": "/oss/python/langgraph/use-subgraphs"
            }
        ]
    },
    {
        "text": "生产环境",
        "collapsed": false,
        "items": [
            {
                "text": "应用结构",
                "link": "/oss/python/langgraph/application-structure"
            },
            {
                "text": "测试",
                "link": "/oss/python/langgraph/test"
            },
            {
                "text": "工作室",
                "link": "/oss/python/langgraph/studio"
            },
            {
                "text": "用户界面",
                "link": "/oss/python/langgraph/ui"
            },
            {
                "text": "部署（Deployment）",
                "link": "/oss/python/langgraph/deploy"
            },
            {
                "text": "可观测性（Observability）",
                "link": "/oss/python/langgraph/observability"
            }
        ]
    },
    {
        "text": "LangGraph API",
        "collapsed": false,
        "items": [
            {
                "text": "图 API（Graph API）",
                "collapsed": false,
                "items": [
                    {
                        "text": "选择 API",
                        "link": "/oss/python/langgraph/choosing-apis"
                    },
                    {
                        "text": "图 API（Graph API）",
                        "link": "/oss/python/langgraph/graph-api"
                    },
                    {
                        "text": "使用图 API",
                        "link": "/oss/python/langgraph/use-graph-api"
                    }
                ]
            },
            {
                "text": "函数式 API（Functional API）",
                "collapsed": false,
                "items": [
                    {
                        "text": "函数式 API（Functional API）",
                        "link": "/oss/python/langgraph/functional-api"
                    },
                    {
                        "text": "使用函数式 API",
                        "link": "/oss/python/langgraph/use-functional-api"
                    }
                ]
            },
            {
                "text": "Pregel",
                "link": "/oss/python/langgraph/pregel"
            }
        ]
    }
];

// 生成 Python 和 JavaScript 两个版本
const sidebars = createLanguageSidebars(template);

export const sidebarLangGraphPython = sidebars.python;
export const sidebarLangGraphJS = sidebars.javascript;
