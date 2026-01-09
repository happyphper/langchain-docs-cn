import { createLanguageSidebars } from './sidebar_utils';

// Contributing 侧边栏模板(使用 Python 路径)
const contributingTemplate = [
    { text: '概述', link: '/oss/python/contributing/overview' },
    {
        text: '参与贡献',
        items: [
            { text: '编写文档', link: '/oss/python/contributing/documentation' },
            { text: '编写代码', link: '/oss/python/contributing/code' },
            {
                text: '集成组件贡献',
                collapsed: true,
                items: [
                    { text: '贡献指南', link: '/oss/python/contributing/integrations-langchain' },
                    { text: '功能实现', link: '/oss/python/contributing/implement-langchain' },
                    { text: '标准测试', link: '/oss/python/contributing/standard-tests-langchain' },
                    { text: '发布流程', link: '/oss/python/contributing/publish-langchain' },
                    { text: '联合营销', link: '/oss/python/contributing/comarketing' }
                ]
            }
        ]
    }
];

// 生成 Python 和 JavaScript 两个版本
const sidebars = createLanguageSidebars(contributingTemplate);

export const sidebarContributingPython = sidebars.python;
export const sidebarContributingJS = sidebars.javascript;
