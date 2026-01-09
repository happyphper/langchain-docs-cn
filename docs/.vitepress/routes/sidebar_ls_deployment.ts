export const lsDeployment = [
    {
        text: '部署',
        items: [
            { text: '概述', link: '/langsmith/deployments' },
            { text: '本地测试', link: '/langsmith/local-server' },
            { text: '应用开发', link: '/langsmith/app-development' },
            { text: '云端快速上手', link: '/langsmith/deployment-quickstart' }
        ]
    },
    {
        text: '配置待部署应用',
        items: [
            { text: '应用结构', link: '/langsmith/application-structure' },
            {
                text: '安装与设置',
                collapsed: true,
                items: [
                    { text: '使用 requirements.txt', link: '/langsmith/setup-app-requirements-txt' },
                    { text: '使用 pyproject.toml', link: '/langsmith/setup-pyproject' },
                    { text: '设置 JavaScript 应用', link: '/langsmith/setup-javascript' },
                    { text: 'Monorepo 支持', link: '/langsmith/monorepo-support' }
                ]
            },
            {
                text: '部署组件',
                collapsed: true,
                items: [
                    { text: '概述', link: '/langsmith/components' },
                    { text: '智能体服务器 (Agent Server)', link: '/langsmith/agent-server' },
                    { text: '数据平面 (Data plane)', link: '/langsmith/data-plane' },
                    { text: '控制平面 (Control plane)', link: '/langsmith/control-plane' }
                ]
            },
            { text: '运行时重构图', link: '/langsmith/graph-rebuild' },
            { text: '使用 RemoteGraph 交互', link: '/langsmith/use-remote-graph' },
            { text: '为智能体部署添加语义搜索', link: '/langsmith/semantic-search' },
            { text: '为应用添加生存时间 (TTLs)', link: '/langsmith/configure-ttl' },
            { text: '配置智能体服务器扩容', link: '/langsmith/agent-server-scale' },
            { text: '实现 CI/CD 流水线', link: '/langsmith/cicd-pipeline-example' }
        ]
    },
    {
        text: '部署指南',
        items: [
            { text: '云端部署', link: '/langsmith/deploy-to-cloud' },
            { text: '带控制平面部署', link: '/langsmith/deploy-with-control-plane' },
            { text: '独立服务器部署', link: '/langsmith/deploy-standalone-server' },
            { text: '故障排查', link: '/langsmith/diagnostics-self-hosted' }
        ]
    },
    {
        text: '应用开发',
        items: [
            {
                text: '数据模型',
                collapsed: true,
                items: [
                    {
                        text: '助手 (Assistants)',
                        collapsed: true,
                        items: [
                            { text: '概述', link: '/langsmith/assistants' },
                            { text: '管理助手', link: '/langsmith/configuration-cloud' },
                            { text: '使用线程', link: '/langsmith/use-threads' }
                        ]
                    },
                    {
                        text: '运行记录 (Runs)',
                        collapsed: true,
                        items: [
                            { text: '启动后台运行', link: '/langsmith/background-run' },
                            { text: '在同一线程运行多个智能体', link: '/langsmith/same-thread' },
                            { text: '使用定时任务 (Cron Jobs)', link: '/langsmith/cron-jobs' },
                            { text: '无状态运行', link: '/langsmith/stateless-runs' }
                        ]
                    }
                ]
            },
            {
                text: '核心能力',
                collapsed: true,
                items: [
                    { text: '流式 API', link: '/langsmith/streaming' },
                    { text: '使用服务器 API 实现人机交互', link: '/langsmith/add-human-in-the-loop' },
                    { text: '使用服务器 API 实现时间旅行', link: '/langsmith/human-in-the-loop-time-travel' },
                    { text: '智能体服务器中的 MCP 端点', link: '/langsmith/server-mcp' },
                    { text: '智能体服务器中的 A2A 端点', link: '/langsmith/server-a2a' },
                    { text: '分布式追踪', link: '/langsmith/agent-server-distributed-tracing' },
                    { text: 'Webhooks 通知', link: '/langsmith/use-webhooks' },
                    {
                        text: '双重消息并发处理 (Double-texting)',
                        collapsed: true,
                        items: [
                            { text: '概述', link: '/langsmith/double-texting' },
                            { text: '中断 (Interrupt)', link: '/langsmith/interrupt-concurrent' },
                            { text: '回滚 (Rollback)', link: '/langsmith/rollback-concurrent' },
                            { text: '拒绝 (Reject)', link: '/langsmith/reject-concurrent' },
                            { text: '排队 (Enqueue)', link: '/langsmith/enqueue-concurrent' }
                        ]
                    }
                ]
            },
            {
                text: '教程',
                collapsed: true,
                items: [
                    { text: '部署其他框架 (如 Strands, CrewAI)', link: '/langsmith/deploy-other-frameworks' },
                    { text: '将 LangGraph 集成至 React 应用', link: '/langsmith/use-stream-react' },
                    { text: '使用 LangGraph 实现生成式 UI', link: '/langsmith/generative-ui-react' }
                ]
            }
        ]
    },
    {
        text: 'Studio 实验室',
        items: [
            { text: '概述', link: '/langsmith/studio' },
            { text: '快速开始', link: '/langsmith/quick-start-studio' },
            { text: '运行记录、助手与线程', link: '/langsmith/use-studio' },
            { text: '追踪、数据集与提示词', link: '/langsmith/observability-studio' },
            { text: '故障排查', link: '/langsmith/troubleshooting-studio' }
        ]
    },
    {
        text: '认证与访问控制',
        items: [
            { text: '概述', link: '/langsmith/auth' },
            { text: '添加自定义认证', link: '/langsmith/custom-auth' },
            { text: '设置自定义认证系统', link: '/langsmith/set-up-custom-auth' },
            { text: '设置对话内容私有化', link: '/langsmith/resource-auth' },
            { text: '连接身份验证提供商', link: '/langsmith/add-auth-server' },
            { text: '在 OpenAPI 文档中记录 API 认证', link: '/langsmith/openapi-security' },
            { text: '设置 Agent Auth (测试版)', link: '/langsmith/agent-auth' }
        ]
    },
    {
        text: '服务器自定义',
        items: [
            { text: '添加自定义生命周期事件', link: '/langsmith/custom-lifespan' },
            { text: '添加自定义中间件', link: '/langsmith/custom-middleware' },
            { text: '添加自定义逻辑路由', link: '/langsmith/custom-routes' },
            { text: '可配置请求头 (Headers)', link: '/langsmith/configurable-headers' },
            { text: '日志请求头记录记录', link: '/langsmith/configurable-logs' }
        ]
    }
];
