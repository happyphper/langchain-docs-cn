export const lsGetStarted = [
    {
        text: '开始使用',
        items: [
            { text: '概述', link: '/langsmith/home' },
            { text: '方案与定价', link: 'https://langchain.com/pricing' },
            { text: '创建账号与 API Key', link: '/langsmith/create-account-api-key' }
        ]
    },
    {
        text: '账号管理',
        items: [
            { text: '概述', link: '/langsmith/administration-overview' },
            { text: '设置组织架构', link: '/langsmith/set-up-hierarchy' },
            { text: '使用 API 管理组织', link: '/langsmith/manage-organization-by-api' },
            { text: '管理账单', link: '/langsmith/billing' },
            { text: '设置资源标签', link: '/langsmith/set-up-resource-tags' },
            { text: '用户管理', link: '/langsmith/user-management' }
        ]
    },
    {
        text: '更多资源',
        items: [
            { text: 'Polly (测试版)', link: '/langsmith/polly' },
            {
                text: '数据管理',
                collapsed: true,
                items: [
                    { text: '数据存储与隐私', link: '/langsmith/data-storage-and-privacy' },
                    { text: '合规性数据清除', link: '/langsmith/data-purging-compliance' }
                ]
            },
            {
                text: '访问控制与身份验证',
                collapsed: true,
                items: [
                    { text: '基于角色的访问控制 (RBAC)', link: '/langsmith/rbac' },
                    { text: '组织与工作区操作', link: '/langsmith/organization-workspace-operations' },
                    { text: '身份验证方式', link: '/langsmith/authentication-methods' }
                ]
            },
            { text: '可扩展性与弹性', link: '/langsmith/scalability-and-resilience' },
            { text: '常见问题', link: '/langsmith/faq' },
            { text: '区域常见问题', link: '/langsmith/regions-faq' },
            { text: '定价常见问题', link: '/langsmith/pricing-faq' },
            { text: 'LangSmith 运行状态', link: 'https://status.smith.langchain.com/' }
        ]
    }
];
