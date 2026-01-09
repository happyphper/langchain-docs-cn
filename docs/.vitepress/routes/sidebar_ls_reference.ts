export const lsReference = [
    {
        text: '参考文档',
        items: [
            { text: '概述', link: '/langsmith/reference' },
            { text: 'LangSmith Python SDK', link: 'https://reference.langchain.com/python/langsmith/observability/sdk/' },
            { text: 'LangSmith JS/TS SDK', link: 'https://reference.langchain.com/javascript/modules/langsmith.html' },
            { text: 'LangGraph Python SDK', link: 'https://reference.langchain.com/python/langgraph/' },
            { text: 'LangGraph JS/TS SDK', link: 'https://reference.langchain.com/javascript/modules/_langchain_langgraph-sdk.html' },
            { text: 'LangSmith API', link: 'https://api.smith.langchain.com/redoc' }
        ]
    },
    {
        text: 'LangSmith 部署',
        items: [
            {
                text: '智能体服务器 API (Agent Server API)',
                collapsed: true,
                items: [
                    { text: '概述', link: '/langsmith/server-api-ref' },
                    {
                        text: '助手 (Assistants)',
                        collapsed: true,
                        items: [
                            { text: '创建助手', link: '/langsmith/agent-server-api/assistants/create-assistant' },
                            { text: '搜索助手', link: '/langsmith/agent-server-api/assistants/search-assistants' },
                            { text: '统计助手数量', link: '/langsmith/agent-server-api/assistants/count-assistants' },
                            { text: '获取助手详情', link: '/langsmith/agent-server-api/assistants/get-assistant' },
                            { text: '删除助手', link: '/langsmith/agent-server-api/assistants/delete-assistant' },
                            { text: '修改助手 (Patch)', link: '/langsmith/agent-server-api/assistants/patch-assistant' },
                            { text: '获取助手逻辑图', link: '/langsmith/agent-server-api/assistants/get-assistant-graph' },
                            { text: '获取助手子图', link: '/langsmith/agent-server-api/assistants/get-assistant-subgraphs' },
                            { text: '按命名空间获取子图', link: '/langsmith/agent-server-api/assistants/get-assistant-subgraphs-by-namespace' },
                            { text: '获取助手 Schemas', link: '/langsmith/agent-server-api/assistants/get-assistant-schemas' },
                            { text: '获取助手版本记录', link: '/langsmith/agent-server-api/assistants/get-assistant-versions' },
                            { text: '设置最新助手版本', link: '/langsmith/agent-server-api/assistants/set-latest-assistant-version' }
                        ]
                    },
                    {
                        text: '对话线程 (Threads)',
                        collapsed: true,
                        items: [
                            { text: '创建线程', link: '/langsmith/agent-server-api/threads/create-thread' },
                            { text: '搜索线程', link: '/langsmith/agent-server-api/threads/search-threads' },
                            { text: '统计线程数量', link: '/langsmith/agent-server-api/threads/count-threads' },
                            { text: '修剪线程 (Prune)', link: '/langsmith/agent-server-api/threads/prune-threads' },
                            { text: '获取线程状态', link: '/langsmith/agent-server-api/threads/get-thread-state' },
                            { text: '更新线程状态', link: '/langsmith/agent-server-api/threads/update-thread-state' },
                            { text: '获取特定检查点的线程状态', link: '/langsmith/agent-server-api/threads/get-thread-state-at-checkpoint' },
                            { text: '获取特定检查点的状态 (备份)', link: '/langsmith/agent-server-api/threads/get-thread-state-at-checkpoint-1' },
                            { text: '获取线程历史记录', link: '/langsmith/agent-server-api/threads/get-thread-history' },
                            { text: '获取线程历史记录 (POST)', link: '/langsmith/agent-server-api/threads/get-thread-history-post' },
                            { text: '复制线程', link: '/langsmith/agent-server-api/threads/copy-thread' },
                            { text: '获取线程详情', link: '/langsmith/agent-server-api/threads/get-thread' },
                            { text: '删除线程', link: '/langsmith/agent-server-api/threads/delete-thread' },
                            { text: '修改线程内容 (Patch)', link: '/langsmith/agent-server-api/threads/patch-thread' },
                            { text: '加入线程流', link: '/langsmith/agent-server-api/threads/join-thread-stream' }
                        ]
                    },
                    {
                        text: '线程运行记录 (Thread Runs)',
                        collapsed: true,
                        items: [
                            { text: '列出运行记录', link: '/langsmith/agent-server-api/thread-runs/list-runs' },
                            { text: '创建后台运行任务', link: '/langsmith/agent-server-api/thread-runs/create-background-run' },
                            { text: '创建运行并流式输出', link: '/langsmith/agent-server-api/thread-runs/create-run-stream-output' },
                            { text: '创建运行并等待结果', link: '/langsmith/agent-server-api/thread-runs/create-run-wait-for-output' },
                            { text: '获取运行详情', link: '/langsmith/agent-server-api/thread-runs/get-run' },
                            { text: '删除运行记录', link: '/langsmith/agent-server-api/thread-runs/delete-run' },
                            { text: '加入运行', link: '/langsmith/agent-server-api/thread-runs/join-run' },
                            { text: '加入运行流', link: '/langsmith/agent-server-api/thread-runs/join-run-stream' },
                            { text: '取消单次运行', link: '/langsmith/agent-server-api/thread-runs/cancel-run' },
                            { text: '批量取消运行任务', link: '/langsmith/agent-server-api/thread-runs/cancel-runs' }
                        ]
                    },
                    {
                        text: '定时任务 (Crons - Plus 档位)',
                        collapsed: true,
                        items: [
                            { text: '创建线程定时任务', link: '/langsmith/agent-server-api/crons-plus-tier/create-thread-cron' },
                            { text: '创建定时任务', link: '/langsmith/agent-server-api/crons-plus-tier/create-cron' },
                            { text: '搜索定时任务', link: '/langsmith/agent-server-api/crons-plus-tier/search-crons' },
                            { text: '统计任务数量', link: '/langsmith/agent-server-api/crons-plus-tier/count-crons' },
                            { text: '删除定时任务', link: '/langsmith/agent-server-api/crons-plus-tier/delete-cron' }
                        ]
                    },
                    {
                        text: '无状态运行 (Stateless Runs)',
                        collapsed: true,
                        items: [
                            { text: '创建运行并流式输出', link: '/langsmith/agent-server-api/stateless-runs/create-run-stream-output' },
                            { text: '创建运行并等待结果', link: '/langsmith/agent-server-api/stateless-runs/create-run-wait-for-output' },
                            { text: '创建后台运行任务', link: '/langsmith/agent-server-api/stateless-runs/create-background-run' },
                            { text: '创建批量运行任务 (Batch)', link: '/langsmith/agent-server-api/stateless-runs/create-run-batch' }
                        ]
                    },
                    {
                        text: '内容存储 (Store)',
                        collapsed: true,
                        items: [
                            { text: '检索单个项目', link: '/langsmith/agent-server-api/store/retrieve-a-single-item' },
                            { text: '存储或更新项目', link: '/langsmith/agent-server-api/store/store-or-update-an-item' },
                            { text: '删除项目', link: '/langsmith/agent-server-api/store/delete-an-item' },
                            { text: '在命名空间前缀内搜索', link: '/langsmith/agent-server-api/store/search-for-items-within-a-namespace-prefix' },
                            { text: '列出命名空间并设定过滤条件', link: '/langsmith/agent-server-api/store/list-namespaces-with-optional-match-conditions' }
                        ]
                    },
                    {
                        text: 'A2A',
                        collapsed: true,
                        items: [
                            { text: 'A2A Post 请求', link: '/langsmith/agent-server-api/a2a/a2a-post' }
                        ]
                    },
                    {
                        text: 'MCP',
                        collapsed: true,
                        items: [
                            { text: 'MCP Get 请求', link: '/langsmith/agent-server-api/mcp/mcp-get' },
                            { text: 'MCP Post 请求', link: '/langsmith/agent-server-api/mcp/mcp-post' },
                            { text: '终止会话', link: '/langsmith/agent-server-api/mcp/terminate-session' }
                        ]
                    },
                    {
                        text: '系统相关',
                        collapsed: true,
                        items: [
                            { text: '服务器信息', link: '/langsmith/agent-server-api/system/server-information' },
                            { text: '系统指标', link: '/langsmith/agent-server-api/system/system-metrics' },
                            { text: '健康检查', link: '/langsmith/agent-server-api/system/health-check' }
                        ]
                    }
                ]
            },
            {
                text: '控制平面 API (Control Plane API)',
                collapsed: true,
                items: [
                    { text: '概述', link: '/langsmith/api-ref-control-plane' },
                    {
                        text: '集成 (v1)',
                        collapsed: true,
                        items: [
                            { text: '列出 GitHub 集成项', link: '/api-reference/integrations-v1/list-github-integrations' },
                            { text: '列出 GitHub 仓库', link: '/api-reference/integrations-v1/list-github-repositories' }
                        ]
                    },
                    {
                        text: '部署 (v2)',
                        collapsed: true,
                        items: [
                            { text: '列出所有部署', link: '/api-reference/deployments-v2/list-deployments' },
                            { text: '创建部署项', link: '/api-reference/deployments-v2/create-deployment' },
                            { text: '获取部署项详情', link: '/api-reference/deployments-v2/get-deployment' },
                            { text: '删除部署项', link: '/api-reference/deployments-v2/delete-deployment' },
                            { text: '修改部署项 (Patch)', link: '/api-reference/deployments-v2/patch-deployment' },
                            { text: '列出修订版本', link: '/api-reference/deployments-v2/list-revisions' },
                            { text: '获取修订版本详情', link: '/api-reference/deployments-v2/get-revision' },
                            { text: '重新部署修订版本', link: '/api-reference/deployments-v2/redeploy-revision' }
                        ]
                    },
                    {
                        text: '监听器 (v2)',
                        collapsed: true,
                        items: [
                            { text: '列出所有监听器', link: '/api-reference/listeners-v2/list-listeners' },
                            { text: '创建监听器', link: '/api-reference/listeners-v2/create-listener' },
                            { text: '获取监听器详情', link: '/api-reference/listeners-v2/get-listener' },
                            { text: '删除监听器', link: '/api-reference/listeners-v2/delete-listener' },
                            { text: '修改监听器 (Patch)', link: '/api-reference/listeners-v2/patch-listener' }
                        ]
                    },
                    {
                        text: '认证服务 (v2)',
                        collapsed: true,
                        items: [
                            { text: '列出 OAuth 提供商', link: '/api-reference/auth-service-v2/list-oauth-providers' },
                            { text: '创建 OAuth 提供商', link: '/api-reference/auth-service-v2/create-oauth-provider' },
                            { text: 'OAuth 设置回调', link: '/api-reference/auth-service-v2/oauth-setup-callback' },
                            { text: 'OAuth 回调 (GET)', link: '/api-reference/auth-service-v2/oauth-callback-get' },
                            { text: 'OAuth 回调 (POST)', link: '/api-reference/auth-service-v2/oauth-callback' },
                            { text: '执行认证', link: '/api-reference/auth-service-v2/authenticate' },
                            { text: '等待认证完成', link: '/api-reference/auth-service-v2/wait-for-auth-completion' },
                            { text: '创建 MCP OAuth 提供商', link: '/api-reference/auth-service-v2/create-mcp-oauth-provider' },
                            { text: '获取 OAuth 提供商详情', link: '/api-reference/auth-service-v2/get-oauth-provider' },
                            { text: '删除 OAuth 提供商', link: '/api-reference/auth-service-v2/delete-oauth-provider' },
                            { text: '更新 OAuth 提供商', link: '/api-reference/auth-service-v2/update-oauth-provider' },
                            { text: '检查 OAuth Token 是否存在', link: '/api-reference/auth-service-v2/check-oauth-token-exists' },
                            { text: '删除用户的 OAuth Tokens', link: '/api-reference/auth-service-v2/delete-oauth-tokens-for-user' }
                        ]
                    }
                ]
            },
            { text: 'LangGraph CLI 命令行工具', link: '/langsmith/cli' },
            { text: 'RemoteGraph 参考', link: 'https://reference.langchain.com/python/langsmith/deployment/remote_graph/' },
            { text: '智能体服务器环境变量说明', link: '/langsmith/env-var' }
        ]
    },
    {
        text: '发布记录',
        items: [
            { text: '智能体服务器更新日志', link: '/langsmith/agent-server-changelog' },
            { text: '自托管版本更新日志', link: '/langsmith/self-hosted-changelog' },
            { text: '发布版本详细说明', link: '/langsmith/release-versions' }
        ]
    }
];
