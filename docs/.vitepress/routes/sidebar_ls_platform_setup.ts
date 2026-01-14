// lsPlatformSetup 侧边栏配置
export const lsPlatformSetup = [
    {
        "text": "概述",
        "collapsed": false,
        "items": [
            {
                "text": "平台设置",
                "link": "/langsmith/platform-setup"
            },
            {
                "text": "云端",
                "link": "/langsmith/cloud"
            }
        ]
    },
    {
        "text": "自托管云架构",
        "collapsed": false,
        "items": [
            {
                "text": "AWS 自托管",
                "link": "/langsmith/aws-self-hosted"
            },
            {
                "text": "Azure 自托管",
                "link": "/langsmith/azure-self-hosted"
            },
            {
                "text": "GCP 自托管",
                "link": "/langsmith/gcp-self-hosted"
            }
        ]
    },
    {
        "text": "混合（Hybrid）",
        "collapsed": false,
        "items": [
            {
                "text": "混合（Hybrid）",
                "link": "/langsmith/hybrid"
            },
            {
                "text": "部署混合模式（Deploy Hybrid）",
                "link": "/langsmith/deploy-hybrid"
            }
        ]
    },
    {
        "text": "自托管（Self-hosted）",
        "collapsed": false,
        "items": [
            {
                "text": "自托管（Self-hosted）",
                "link": "/langsmith/self-hosted"
            },
            {
                "text": "设置指南",
                "collapsed": false,
                "items": [
                    {
                        "text": "LangSmith",
                        "collapsed": false,
                        "items": [
                            {
                                "text": "Kubernetes",
                                "link": "/langsmith/kubernetes"
                            },
                            {
                                "text": "Docker",
                                "link": "/langsmith/docker"
                            }
                        ]
                    },
                    {
                        "text": "部署自托管完整平台",
                        "link": "/langsmith/deploy-self-hosted-full-platform"
                    },
                    {
                        "text": "管理安装",
                        "collapsed": false,
                        "items": [
                            {
                                "text": "自托管使用情况",
                                "link": "/langsmith/self-host-usage"
                            },
                            {
                                "text": "自托管升级",
                                "link": "/langsmith/self-host-upgrades"
                            },
                            {
                                "text": "自托管出口",
                                "link": "/langsmith/self-host-egress"
                            },
                            {
                                "text": "自托管组织图表",
                                "link": "/langsmith/self-host-organization-charts"
                            },
                            {
                                "text": "LangSmith 托管的 ClickHouse",
                                "link": "/langsmith/langsmith-managed-clickhouse"
                            },
                            {
                                "text": "自托管入口",
                                "link": "/langsmith/self-host-ingress"
                            },
                            {
                                "text": "自托管镜像同步",
                                "link": "/langsmith/self-host-mirroring-images"
                            }
                        ]
                    }
                ]
            },
            {
                "text": "配置",
                "collapsed": false,
                "items": [
                    {
                        "text": "自托管扩缩容",
                        "link": "/langsmith/self-host-scale"
                    },
                    {
                        "text": "自托管TTL",
                        "link": "/langsmith/self-host-ttl"
                    },
                    {
                        "text": "自定义Docker",
                        "link": "/langsmith/custom-docker"
                    },
                    {
                        "text": "自托管Playground环境设置",
                        "link": "/langsmith/self-host-playground-environment-settings"
                    },
                    {
                        "text": "故障排除",
                        "link": "/langsmith/troubleshooting"
                    }
                ]
            },
            {
                "text": "连接外部服务",
                "collapsed": false,
                "items": [
                    {
                        "text": "自托管Blob存储",
                        "link": "/langsmith/self-host-blob-storage"
                    },
                    {
                        "text": "自托管外部ClickHouse",
                        "link": "/langsmith/self-host-external-clickhouse"
                    },
                    {
                        "text": "自托管外部Postgres",
                        "link": "/langsmith/self-host-external-postgres"
                    },
                    {
                        "text": "自托管外部Redis",
                        "link": "/langsmith/self-host-external-redis"
                    }
                ]
            },
            {
                "text": "平台认证与访问控制",
                "collapsed": false,
                "items": [
                    {
                        "text": "自托管基础认证",
                        "link": "/langsmith/self-host-basic-auth"
                    },
                    {
                        "text": "自托管单点登录（SSO）",
                        "link": "/langsmith/self-host-sso"
                    },
                    {
                        "text": "自托管用户管理",
                        "link": "/langsmith/self-host-user-management"
                    },
                    {
                        "text": "自托管自定义TLS证书",
                        "link": "/langsmith/self-host-custom-tls-certificates"
                    },
                    {
                        "text": "自托管使用现有密钥",
                        "link": "/langsmith/self-host-using-an-existing-secret"
                    }
                ]
            },
            {
                "text": "自托管可观测性（Observability）",
                "collapsed": false,
                "items": [
                    {
                        "text": "导出后端",
                        "link": "/langsmith/export-backend"
                    },
                    {
                        "text": "LangSmith收集器",
                        "link": "/langsmith/langsmith-collector"
                    },
                    {
                        "text": "可观测性（Observability）栈",
                        "link": "/langsmith/observability-stack"
                    }
                ]
            },
            {
                "text": "管理任务脚本",
                "collapsed": false,
                "items": [
                    {
                        "text": "脚本-删除工作区",
                        "link": "/langsmith/script-delete-a-workspace"
                    },
                    {
                        "text": "脚本-删除组织",
                        "link": "/langsmith/script-delete-an-organization"
                    },
                    {
                        "text": "脚本-删除追踪记录",
                        "link": "/langsmith/script-delete-traces"
                    },
                    {
                        "text": "脚本-生成ClickHouse统计",
                        "link": "/langsmith/script-generate-clickhouse-stats"
                    },
                    {
                        "text": "脚本-生成查询统计",
                        "link": "/langsmith/script-generate-query-stats"
                    },
                    {
                        "text": "脚本-运行Postgres支持查询",
                        "link": "/langsmith/script-running-pg-support-queries"
                    },
                    {
                        "text": "脚本-运行ClickHouse支持查询",
                        "link": "/langsmith/script-running-ch-support-queries"
                    }
                ]
            }
        ]
    }
];
