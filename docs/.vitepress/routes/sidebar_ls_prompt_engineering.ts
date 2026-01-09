export const lsPromptEngineering = [
    {
        text: '提示词工程',
        items: [
            { text: '概述', link: '/langsmith/prompt-engineering' },
            { text: '快速开始', link: '/langsmith/prompt-engineering-quickstart' },
            { text: '核心概念', link: '/langsmith/prompt-engineering-concepts' }
        ]
    },
    {
        text: '创建与更新提示词',
        items: [
            { text: '创建提示词', link: '/langsmith/create-a-prompt' },
            { text: '管理提示词', link: '/langsmith/manage-prompts' },
            { text: '编程式管理提示词', link: '/langsmith/manage-prompts-programmatically' },
            { text: '配置提示词设置', link: '/langsmith/managing-model-configurations' },
            { text: '在提示词中使用工具', link: '/langsmith/use-tools' },
            { text: '在提示词中包含多模态内容', link: '/langsmith/multimodal-content' },
            { text: '使用 AI 编写提示词', link: '/langsmith/write-prompt-with-ai' },
            {
                text: '连接模型',
                collapsed: true,
                items: [
                    { text: '兼容 OpenAI 的模型提供商/代理接口', link: '/langsmith/custom-openai-compliant-model' },
                    { text: '自定义模型端点', link: '/langsmith/custom-endpoint' }
                ]
            }
        ]
    },
    {
        text: '教程',
        items: [
            { text: '优化分类器', link: '/langsmith/optimize-classifier' },
            { text: '同步提示词至 GitHub', link: '/langsmith/prompt-commit' },
            { text: '测试多轮对话', link: '/langsmith/multiple-messages' }
        ]
    }
];
