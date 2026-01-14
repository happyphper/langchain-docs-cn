import { createLanguageSidebars } from './sidebar_utils';

// Contributing 侧边栏模板
const template = [
    {
        "text": "概述",
        "link": "/oss/python/contributing/overview"
    },
    {
        "text": "贡献",
        "collapsed": false,
        "items": [
            {
                "text": "文档",
                "link": "/oss/python/contributing/documentation"
            },
            {
                "text": "代码",
                "link": "/oss/python/contributing/code"
            },
            {
                "text": "集成（Integrations）",
                "collapsed": false,
                "items": [
                    {
                        "text": "LangChain 集成",
                        "link": "/oss/python/contributing/integrations-langchain"
                    },
                    {
                        "text": "实现 LangChain",
                        "link": "/oss/python/contributing/implement-langchain"
                    },
                    {
                        "text": "LangChain 标准测试",
                        "link": "/oss/python/contributing/standard-tests-langchain"
                    },
                    {
                        "text": "发布 LangChain",
                        "link": "/oss/python/contributing/publish-langchain"
                    },
                    {
                        "text": "联合营销",
                        "link": "/oss/python/contributing/comarketing"
                    }
                ]
            }
        ]
    }
];

// 生成 Python 和 JavaScript 两个版本
const sidebars = createLanguageSidebars(template);

export const sidebarContributingPython = sidebars.python;
export const sidebarContributingJS = sidebars.javascript;
