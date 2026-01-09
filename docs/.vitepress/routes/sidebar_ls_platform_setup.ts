export const lsPlatformSetup = [
    {
        text: '概述',
        items: [
            { text: '设置 LangSmith', link: '/langsmith/platform-setup' },
            { text: '云端 (SaaS)', link: '/langsmith/cloud' }
        ]
    },
    {
        text: '私有云架构',
        items: [
            { text: 'AWS', link: '/langsmith/aws-self-hosted' },
            { text: 'Azure', link: '/langsmith/azure-self-hosted' },
            { text: 'GCP', link: '/langsmith/gcp-self-hosted' }
        ]
    },
    {
        text: '混合部署 (Hybrid)',
        items: [
            { text: '概述', link: '/langsmith/hybrid' },
            { text: '安装指南', link: '/langsmith/deploy-hybrid' }
        ]
    },
    {
        text: '自托管部署 (Self-hosted)',
        items: [
            { text: '概述', link: '/langsmith/self-hosted' },
            {
                text: '安装指南',
                collapsed: true,
                items: [
                    {
                        text: 'LangSmith',
                        collapsed: true,
                        items: [
                            { text: '在 Kubernetes 上安装', link: '/langsmith/kubernetes' },
                            { text: '在 Docker 上安装', link: '/langsmith/docker' }
                        ]
                    },
                    { text: '启用部署功能', link: '/langsmith/deploy-self-hosted-full-platform' },
                    {
                        text: '管理安装实例',
                        collapsed: true,
                        items: [
                            { text: '与安装实例进行交互', link: '/langsmith/self-host-usage' },
                            { text: '升级安装实例', link: '/langsmith/self-host-upgrades' },
                            { text: '为订阅指标配置出站流量 (Egress)', link: '/langsmith/self-host-egress' },
                            { text: '查看全组织的追踪统计图表', link: '/langsmith/self-host-organization-charts' },
                            { text: 'LangSmith 托管的 ClickHouse', link: '/langsmith/langsmith-managed-clickhouse' },
                            { text: '为安装实例创建 Ingress (Kubernetes)', link: '/langsmith/self-host-ingress' },
                            { text: '为安装实例配置镜像站', link: '/langsmith/self-host-mirroring-images' }
                        ]
                    }
                ]
            },
            {
                text: '配置项',
                collapsed: true,
                items: [
                    { text: '配置扩容方案', link: '/langsmith/self-host-scale' },
                    { text: '启用 TTL 与数据保留', link: '/langsmith/self-host-ttl' },
                    { text: '自定义 Dockerfile', link: '/langsmith/custom-docker' },
                    { text: '为模型提供商配置环境变量', link: '/langsmith/self-host-playground-environment-settings' },
                    { text: '故障排查', link: '/langsmith/troubleshooting' }
                ]
            },
            {
                text: '连接外部服务',
                collapsed: true,
                items: [
                    { text: '启用对象存储 (Blob Storage)', link: '/langsmith/self-host-blob-storage' },
                    { text: '连接外部 ClickHouse 数据库', link: '/langsmith/self-host-external-clickhouse' },
                    { text: '连接外部 PostgreSQL 数据库', link: '/langsmith/self-host-external-postgres' },
                    { text: '连接外部 Redis 数据库', link: '/langsmith/self-host-external-redis' }
                ]
            },
            {
                text: '平台认证与访问控制',
                collapsed: true,
                items: [
                    { text: '设置基础身份验证', link: '/langsmith/self-host-basic-auth' },
                    { text: '设置 SSO (使用 OAuth2.0 & OIDC)', link: '/langsmith/self-host-sso' },
                    { text: '自定义用户管理', link: '/langsmith/self-host-user-management' },
                    { text: '配置自定义 TLS 证书', link: '/langsmith/self-host-custom-tls-certificates' },
                    { text: '使用已有的 Secret (Kubernetes)', link: '/langsmith/self-host-using-an-existing-secret' }
                ]
            },
            {
                text: '自托管可观测性',
                collapsed: true,
                items: [
                    { text: '将遥测数据导出至观测后端', link: '/langsmith/export-backend' },
                    { text: '配置遥测指标收集器', link: '/langsmith/langsmith-collector' },
                    { text: '部署内建观测技术栈', link: '/langsmith/observability-stack' }
                ]
            },
            {
                text: '管理任务脚本',
                collapsed: true,
                items: [
                    { text: '删除工作区', link: '/langsmith/script-delete-a-workspace' },
                    { text: '删除组织账户', link: '/langsmith/script-delete-an-organization' },
                    { text: '删除追踪记录', link: '/langsmith/script-delete-traces' },
                    { text: '生成 ClickHouse 统计数据', link: '/langsmith/script-generate-clickhouse-stats' },
                    { text: '生成查询统计数据', link: '/langsmith/script-generate-query-stats' },
                    { text: '针对 PostgreSQL 运行支持性查询', link: '/langsmith/script-running-pg-support-queries' },
                    { text: '针对 ClickHouse 运行支持性查询', link: '/langsmith/script-running-ch-support-queries' }
                ]
            }
        ]
    }
];
