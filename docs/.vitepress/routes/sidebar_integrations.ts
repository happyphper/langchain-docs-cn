import { createLanguageSidebars } from './sidebar_utils';

// Integrations 侧边栏模板
const template = [
    {
        "text": "概述",
        "link": "/oss/python/integrations/providers/overview"
    },
    {
        "text": "所有提供商",
        "link": "/oss/python/integrations/providers/all_providers"
    },
    {
        "text": "热门提供商",
        "collapsed": false,
        "items": [
            {
                "text": "OpenAI",
                "link": "/oss/python/integrations/providers/openai"
            },
            {
                "text": "Anthropic",
                "link": "/oss/python/integrations/providers/anthropic"
            },
            {
                "text": "Google",
                "link": "/oss/python/integrations/providers/google"
            },
            {
                "text": "AWS",
                "link": "/oss/python/integrations/providers/aws"
            },
            {
                "text": "Hugging Face",
                "link": "/oss/python/integrations/providers/huggingface"
            },
            {
                "text": "Microsoft",
                "link": "/oss/python/integrations/providers/microsoft"
            },
            {
                "text": "Ollama",
                "link": "/oss/python/integrations/providers/ollama"
            },
            {
                "text": "Groq",
                "link": "/oss/python/integrations/chat/groq"
            }
        ]
    },
    {
        "text": "按组件集成（Integrations）",
        "collapsed": false,
        "items": [
            {
                "text": "索引",
                "link": "/oss/python/integrations/chat/index"
            },
            {
                "text": "索引",
                "link": "/oss/python/integrations/tools/index"
            },
            {
                "text": "索引",
                "link": "/oss/python/integrations/middleware/index"
            },
            {
                "text": "索引",
                "link": "/oss/python/integrations/retrievers/index"
            },
            {
                "text": "索引",
                "link": "/oss/python/integrations/splitters/index"
            },
            {
                "text": "索引",
                "link": "/oss/python/integrations/text_embedding/index"
            },
            {
                "text": "索引",
                "link": "/oss/python/integrations/vectorstores/index"
            },
            {
                "text": "索引",
                "link": "/oss/python/integrations/document_loaders/index"
            },
            {
                "text": "索引",
                "link": "/oss/python/integrations/stores/index"
            }
        ]
    }
];

// 生成 Python 和 JavaScript 两个版本
const sidebars = createLanguageSidebars(template);

export const sidebarIntegrationsPython = sidebars.python;
export const sidebarIntegrationsJS = sidebars.javascript;
