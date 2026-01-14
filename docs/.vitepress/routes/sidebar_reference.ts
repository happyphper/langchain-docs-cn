import { createLanguageSidebars } from './sidebar_utils';

// Reference 侧边栏模板
const template = [
    {
        "text": "概述",
        "link": "/oss/python/reference/overview"
    },
    {
        "text": "参考",
        "collapsed": false,
        "items": [
            {
                "text": "LangChain Python",
                "link": "/oss/python/reference/langchain-python"
            },
            {
                "text": "LangGraph Python",
                "link": "/oss/python/reference/langgraph-python"
            },
            {
                "text": "Python 集成",
                "link": "/oss/python/reference/integrations-python"
            },
            {
                "text": "DeepAgents Python",
                "link": "/oss/python/reference/deepagents-python"
            }
        ]
    },
    {
        "text": "错误",
        "collapsed": false,
        "items": [
            {
                "text": "常见错误",
                "link": "/oss/python/common-errors"
            }
        ]
    },
    {
        "text": "发布",
        "collapsed": false,
        "items": [
            {
                "text": "版本控制",
                "link": "/oss/python/versioning"
            },
            {
                "text": "更新日志",
                "link": "/oss/python/releases/changelog"
            },
            {
                "text": "发布",
                "collapsed": false,
                "items": [
                    {
                        "text": "LangChain v1",
                        "link": "/oss/python/releases/langchain-v1"
                    },
                    {
                        "text": "LangGraph v1",
                        "link": "/oss/python/releases/langgraph-v1"
                    }
                ]
            },
            {
                "text": "迁移指南",
                "collapsed": false,
                "items": [
                    {
                        "text": "LangChain v1",
                        "link": "/oss/python/migrate/langchain-v1"
                    },
                    {
                        "text": "LangGraph v1",
                        "link": "/oss/python/migrate/langgraph-v1"
                    }
                ]
            }
        ]
    },
    {
        "text": "策略（Policies）",
        "collapsed": false,
        "items": [
            {
                "text": "发布策略",
                "link": "/oss/python/release-policy"
            },
            {
                "text": "安全策略",
                "link": "/oss/python/security-policy"
            }
        ]
    }
];

// 生成 Python 和 JavaScript 两个版本
const sidebars = createLanguageSidebars(template);

export const sidebarReferencePython = sidebars.python;
export const sidebarReferenceJS = sidebars.javascript;
