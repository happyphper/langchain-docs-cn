import { createLanguageSidebars } from './sidebar_utils';

// Integrations 侧边栏模板(使用 Python 路径)
const integrationsTemplate = [
    { text: '集成总览', link: '/oss/python/integrations/providers/overview' },
    { text: '所有服务提供商', link: '/oss/python/integrations/providers/all_providers' },
    {
        text: '热门提供商',
        items: [
            { text: 'OpenAI', link: '/oss/python/integrations/providers/openai' },
            { text: 'Anthropic (Claude)', link: '/oss/python/integrations/providers/anthropic' },
            { text: 'Google', link: '/oss/python/integrations/providers/google' },
            { text: 'AWS (Amazon)', link: '/oss/python/integrations/providers/aws' },
            { text: 'Hugging Face', link: '/oss/python/integrations/providers/huggingface' },
            { text: 'Microsoft', link: '/oss/python/integrations/providers/microsoft' },
            { text: 'Ollama', link: '/oss/python/integrations/providers/ollama' },
            { text: 'Groq', link: '/oss/python/integrations/chat/groq' }
        ]
    },
    {
        text: '按组件类型集成',
        items: [
            { text: '聊天模型 (Chat models)', link: '/oss/python/integrations/chat' },
            { text: '工具与工具包', link: '/oss/python/integrations/tools' },
            { text: '中间件 (Middleware)', link: '/oss/python/integrations/middleware' },
            { text: '检索器 (Retrievers)', link: '/oss/python/integrations/retrievers' },
            { text: '文本分割器 (Text splitters)', link: '/oss/python/integrations/splitters' },
            { text: '嵌入模型 (Embedding models)', link: '/oss/python/integrations/text_embedding' },
            { text: '向量数据库 (Vector stores)', link: '/oss/python/integrations/vectorstores' },
            { text: '文档加载器 (Document loaders)', link: '/oss/python/integrations/document_loaders' },
            { text: '键值存储 (Key-value stores)', link: '/oss/python/integrations/stores' }
        ]
    }
];

// 生成 Python 和 JavaScript 两个版本
const sidebars = createLanguageSidebars(integrationsTemplate);

export const sidebarIntegrationsPython = sidebars.python;
export const sidebarIntegrationsJS = sidebars.javascript;
