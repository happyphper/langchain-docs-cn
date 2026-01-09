export const lsObservability = [
    {
        text: '可观测性',
        items: [
            { text: '概述', link: '/langsmith/observability' },
            { text: '快速开始', link: '/langsmith/observability-quickstart' },
            { text: '核心概念', link: '/langsmith/observability-concepts' },
            { text: '追踪 RAG 应用', link: '/langsmith/observability-llm-tutorial' }
        ]
    },
    {
        text: '追踪设置',
        items: [
            {
                text: '集成',
                collapsed: true,
                items: [
                    { text: '概述', link: '/langsmith/integrations' },
                    { text: 'LangChain', link: '/langsmith/trace-with-langchain' },
                    { text: 'LangGraph', link: '/langsmith/trace-with-langgraph' },
                    { text: 'Anthropic (仅限 Python)', link: '/langsmith/trace-anthropic' },
                    { text: 'OpenAI', link: '/langsmith/trace-openai' },
                    { text: 'AutoGen', link: '/langsmith/trace-with-autogen' },
                    { text: 'Claude Agent SDK', link: '/langsmith/trace-claude-agent-sdk' },
                    { text: 'Claude Code', link: '/langsmith/trace-claude-code' },
                    { text: 'CrewAI', link: '/langsmith/trace-with-crewai' },
                    { text: 'Google ADK', link: '/langsmith/trace-with-google-adk' },
                    { text: 'Instructor (仅限 Python)', link: '/langsmith/trace-with-instructor' },
                    { text: 'OpenAI Agents SDK', link: '/langsmith/trace-with-openai-agents-sdk' },
                    { text: 'OpenTelemetry', link: '/langsmith/trace-with-opentelemetry' },
                    { text: 'PydanticAI', link: '/langsmith/trace-with-pydantic-ai' },
                    { text: 'Semantic Kernel', link: '/langsmith/trace-with-semantic-kernel' },
                    { text: 'Vercel AI SDK', link: '/langsmith/trace-with-vercel-ai-sdk' },
                    { text: 'LiveKit', link: '/langsmith/trace-with-livekit' },
                    { text: 'Pipecat', link: '/langsmith/trace-with-pipecat' }
                ]
            },
            {
                text: '手动埋点',
                collapsed: true,
                items: [
                    { text: '自定义埋点', link: '/langsmith/annotate-code' },
                    { text: '使用 API 进行追踪', link: '/langsmith/trace-with-api' },
                    { text: '记录 LLM 调用', link: '/langsmith/log-llm-trace' },
                    { text: '记录检索器追踪', link: '/langsmith/log-retriever-trace' },
                    { text: '元数据参数', link: '/langsmith/ls-metadata-parameters' },
                    { text: '随追踪上传文件', link: '/langsmith/upload-files-with-traces' }
                ]
            },
            { text: '对话线程 (Threads)', link: '/langsmith/threads' }
        ]
    },
    {
        text: '配置与故障排查',
        items: [
            {
                text: '项目与环境设置',
                collapsed: true,
                items: [
                    { text: '将追踪记录到特定项目', link: '/langsmith/log-traces-to-project' },
                    { text: '无需环境变量进行追踪', link: '/langsmith/trace-without-env-vars' },
                    { text: '设置追踪采样率', link: '/langsmith/sample-traces' }
                ]
            },
            { text: '成本追踪', link: '/langsmith/cost-tracking' },
            {
                text: '高级追踪技术',
                collapsed: true,
                items: [
                    { text: '实现分布式追踪', link: '/langsmith/distributed-tracing' },
                    { text: '在 Serverless 环境中追踪 JS 函数', link: '/langsmith/serverless-environments' },
                    { text: '记录多模态追踪', link: '/langsmith/log-multimodal-traces' },
                    { text: '追踪生成器函数', link: '/langsmith/trace-generator-functions' }
                ]
            },
            {
                text: '数据与隐私',
                collapsed: true,
                items: [
                    { text: '为追踪添加元数据和标签', link: '/langsmith/add-metadata-tags' },
                    { text: '防止在追踪中记录敏感数据', link: '/langsmith/mask-inputs-outputs' }
                ]
            },
            {
                text: '故障排查指南',
                collapsed: true,
                items: [
                    { text: '排查追踪嵌套问题', link: '/langsmith/nest-traces' },
                    { text: '排查变量缓存问题', link: '/langsmith/troubleshooting-variable-caching' },
                    { text: 'LangSmith Collector-Proxy (测试版)', link: '/langsmith/collector-proxy' }
                ]
            }
        ]
    },
    {
        text: '查看与管理追踪',
        items: [
            { text: '过滤追踪', link: '/langsmith/filter-traces-in-application' },
            { text: '查询追踪 (SDK)', link: '/langsmith/export-traces' },
            { text: '对比追踪', link: '/langsmith/compare-traces' },
            { text: '公开分享或取消分享追踪', link: '/langsmith/share-trace' },
            { text: '通过 CLI 获取追踪', link: '/langsmith/langsmith-fetch' },
            { text: '查看追踪的服务端日志', link: '/langsmith/platform-logs' },
            { text: '批量导出追踪数据', link: '/langsmith/data-export' }
        ]
    },
    {
        text: '自动化',
        items: [
            { text: '设置自动化规则', link: '/langsmith/rules' },
            { text: '为规则配置 Webhook 通知', link: '/langsmith/webhooks' }
        ]
    },
    {
        text: '反馈与评估',
        items: [
            { text: '使用 SDK 记录用户反馈', link: '/langsmith/attach-user-feedback' },
            { text: '设置在线评估器', link: '/langsmith/online-evaluations' }
        ]
    },
    {
        text: '监控与告警',
        items: [
            { text: '使用仪表盘监控项目', link: '/langsmith/dashboards' },
            { text: '告警', link: '/langsmith/alerts' },
            { text: '为告警配置 Webhook 通知', link: '/langsmith/alerts-webhook' },
            { text: '洞察 (Insights)', link: '/langsmith/insights' }
        ]
    },
    {
        text: '数据类型参考',
        items: [
            { text: '运行 (Span) 数据格式', link: '/langsmith/run-data-format' },
            { text: '反馈数据格式', link: '/langsmith/feedback-data-format' },
            { text: '追踪查询语法', link: '/langsmith/trace-query-syntax' }
        ]
    }
];
