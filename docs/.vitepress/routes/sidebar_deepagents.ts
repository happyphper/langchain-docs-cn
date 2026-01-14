import { createLanguageSidebars } from './sidebar_utils';

// DeepAgents 侧边栏模板
const template = [
    {
        "text": "概述",
        "link": "/oss/python/deepagents/overview"
    },
    {
        "text": "入门指南",
        "collapsed": false,
        "items": [
            {
                "text": "快速开始",
                "link": "/oss/python/deepagents/quickstart"
            },
            {
                "text": "自定义",
                "link": "/oss/python/deepagents/customization"
            }
        ]
    },
    {
        "text": "核心能力",
        "collapsed": false,
        "items": [
            {
                "text": "框架",
                "link": "/oss/python/deepagents/harness"
            },
            {
                "text": "后端",
                "link": "/oss/python/deepagents/backends"
            },
            {
                "text": "子智能体（Subagents）",
                "link": "/oss/python/deepagents/subagents"
            },
            {
                "text": "人在回路",
                "link": "/oss/python/deepagents/human-in-the-loop"
            },
            {
                "text": "长期记忆",
                "link": "/oss/python/deepagents/long-term-memory"
            },
            {
                "text": "中间件（Middleware）",
                "link": "/oss/python/deepagents/middleware"
            }
        ]
    },
    {
        "text": "命令行界面",
        "collapsed": false,
        "items": [
            {
                "text": "命令行界面",
                "link": "/oss/python/deepagents/cli"
            }
        ]
    }
];

// 生成 Python 和 JavaScript 两个版本
const sidebars = createLanguageSidebars(template);

export const sidebarDeepAgentsPython = sidebars.python;
export const sidebarDeepAgentsJS = sidebars.javascript;
