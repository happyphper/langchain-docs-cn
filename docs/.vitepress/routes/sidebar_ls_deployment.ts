// lsDeployment 侧边栏配置
export const lsDeployment = [
    {
        "text": "部署（Deployments）",
        "link": "/langsmith/deployments"
    },
    {
        "text": "本地服务器",
        "link": "/langsmith/local-server"
    },
    {
        "text": "应用开发",
        "link": "/langsmith/app-development"
    },
    {
        "text": "部署快速入门",
        "link": "/langsmith/deployment-quickstart"
    },
    {
        "text": "为部署配置应用",
        "collapsed": false,
        "items": [
            {
                "text": "应用结构",
                "link": "/langsmith/application-structure"
            },
            {
                "text": "设置",
                "collapsed": false,
                "items": [
                    {
                        "text": "设置应用 requirements.txt",
                        "link": "/langsmith/setup-app-requirements-txt"
                    },
                    {
                        "text": "设置 pyproject",
                        "link": "/langsmith/setup-pyproject"
                    },
                    {
                        "text": "设置 JavaScript",
                        "link": "/langsmith/setup-javascript"
                    },
                    {
                        "text": "Monorepo 支持",
                        "link": "/langsmith/monorepo-support"
                    }
                ]
            },
            {
                "text": "部署组件",
                "collapsed": false,
                "items": [
                    {
                        "text": "组件",
                        "link": "/langsmith/components"
                    },
                    {
                        "text": "智能体服务器（Agent Server）",
                        "link": "/langsmith/agent-server"
                    },
                    {
                        "text": "数据平面（Data Plane）",
                        "link": "/langsmith/data-plane"
                    },
                    {
                        "text": "控制平面（Control Plane）",
                        "link": "/langsmith/control-plane"
                    }
                ]
            },
            {
                "text": "图重建（Graph Rebuild）",
                "link": "/langsmith/graph-rebuild"
            },
            {
                "text": "使用远程图（Graph）",
                "link": "/langsmith/use-remote-graph"
            },
            {
                "text": "语义搜索（Semantic Search）",
                "link": "/langsmith/semantic-search"
            },
            {
                "text": "配置 TTL",
                "link": "/langsmith/configure-ttl"
            },
            {
                "text": "智能体服务器扩展（Agent Server Scale）",
                "link": "/langsmith/agent-server-scale"
            },
            {
                "text": "CI/CD 流水线示例",
                "link": "/langsmith/cicd-pipeline-example"
            }
        ]
    },
    {
        "text": "部署指南",
        "collapsed": false,
        "items": [
            {
                "text": "部署到云端",
                "link": "/langsmith/deploy-to-cloud"
            },
            {
                "text": "使用控制平面部署（Deploy with Control Plane）",
                "link": "/langsmith/deploy-with-control-plane"
            },
            {
                "text": "部署独立服务器",
                "link": "/langsmith/deploy-standalone-server"
            },
            {
                "text": "自托管诊断",
                "link": "/langsmith/diagnostics-self-hosted"
            }
        ]
    },
    {
        "text": "应用开发",
        "collapsed": false,
        "items": [
            {
                "text": "数据模型",
                "collapsed": false,
                "items": [
                    {
                        "text": "助手（Assistants）",
                        "collapsed": false,
                        "items": [
                            {
                                "text": "助手（Assistants）",
                                "link": "/langsmith/assistants"
                            },
                            {
                                "text": "云端配置",
                                "link": "/langsmith/configuration-cloud"
                            },
                            {
                                "text": "使用线程（Threads）",
                                "link": "/langsmith/use-threads"
                            }
                        ]
                    },
                    {
                        "text": "运行（Runs）",
                        "collapsed": false,
                        "items": [
                            {
                                "text": "后台运行（Background Run）",
                                "link": "/langsmith/background-run"
                            },
                            {
                                "text": "同一线程（Same Thread）",
                                "link": "/langsmith/same-thread"
                            },
                            {
                                "text": "Cron 作业",
                                "link": "/langsmith/cron-jobs"
                            },
                            {
                                "text": "无状态运行（Stateless Runs）",
                                "link": "/langsmith/stateless-runs"
                            }
                        ]
                    }
                ]
            },
            {
                "text": "核心能力",
                "collapsed": false,
                "items": [
                    {
                        "text": "流式传输（Streaming）",
                        "link": "/langsmith/streaming"
                    },
                    {
                        "text": "添加人在回路（Human-in-the-Loop）",
                        "link": "/langsmith/add-human-in-the-loop"
                    },
                    {
                        "text": "人在回路时间旅行（Human-in-the-Loop Time Travel）",
                        "link": "/langsmith/human-in-the-loop-time-travel"
                    },
                    {
                        "text": "服务器 MCP",
                        "link": "/langsmith/server-mcp"
                    },
                    {
                        "text": "服务器 A2A",
                        "link": "/langsmith/server-a2a"
                    },
                    {
                        "text": "智能体服务器分布式追踪（Agent Server Distributed Tracing）",
                        "link": "/langsmith/agent-server-distributed-tracing"
                    },
                    {
                        "text": "使用 Webhooks",
                        "link": "/langsmith/use-webhooks"
                    },
                    {
                        "text": "双重文本（Double-texting）",
                        "collapsed": false,
                        "items": [
                            {
                                "text": "双重文本（Double-texting）",
                                "link": "/langsmith/double-texting"
                            },
                            {
                                "text": "中断并发（Interrupt Concurrent）",
                                "link": "/langsmith/interrupt-concurrent"
                            },
                            {
                                "text": "回滚并发（Rollback Concurrent）",
                                "link": "/langsmith/rollback-concurrent"
                            },
                            {
                                "text": "拒绝并发（Reject Concurrent）",
                                "link": "/langsmith/reject-concurrent"
                            },
                            {
                                "text": "入队并发（Enqueue Concurrent）",
                                "link": "/langsmith/enqueue-concurrent"
                            }
                        ]
                    }
                ]
            },
            {
                "text": "教程（Tutorials）",
                "collapsed": false,
                "items": [
                    {
                        "text": "部署其他框架",
                        "link": "/langsmith/deploy-other-frameworks"
                    },
                    {
                        "text": "生成式 UI React",
                        "link": "/langsmith/generative-ui-react"
                    }
                ]
            }
        ]
    },
    {
        "text": "工作室（Studio）",
        "collapsed": false,
        "items": [
            {
                "text": "工作室",
                "link": "/langsmith/studio"
            },
            {
                "text": "工作室快速入门",
                "link": "/langsmith/quick-start-studio"
            },
            {
                "text": "使用工作室（Studio）",
                "link": "/langsmith/use-studio"
            },
            {
                "text": "可观测性工作室（Observability Studio）",
                "link": "/langsmith/observability-studio"
            },
            {
                "text": "工作室故障排除",
                "link": "/langsmith/troubleshooting-studio"
            }
        ]
    },
    {
        "text": "认证与访问控制",
        "collapsed": false,
        "items": [
            {
                "text": "认证",
                "link": "/langsmith/auth"
            },
            {
                "text": "自定义认证",
                "link": "/langsmith/custom-auth"
            },
            {
                "text": "设置自定义认证",
                "link": "/langsmith/set-up-custom-auth"
            },
            {
                "text": "资源认证",
                "link": "/langsmith/resource-auth"
            },
            {
                "text": "添加认证服务器",
                "link": "/langsmith/add-auth-server"
            },
            {
                "text": "OpenAPI 安全",
                "link": "/langsmith/openapi-security"
            },
            {
                "text": "智能体验证（Agent Auth）",
                "link": "/langsmith/agent-auth"
            }
        ]
    },
    {
        "text": "服务器自定义",
        "collapsed": false,
        "items": [
            {
                "text": "自定义生命周期",
                "link": "/langsmith/custom-lifespan"
            },
            {
                "text": "自定义中间件（Middleware）",
                "link": "/langsmith/custom-middleware"
            },
            {
                "text": "自定义路由",
                "link": "/langsmith/custom-routes"
            },
            {
                "text": "加密",
                "link": "/langsmith/encryption"
            },
            {
                "text": "可配置头部",
                "link": "/langsmith/configurable-headers"
            },
            {
                "text": "可配置日志",
                "link": "/langsmith/configurable-logs"
            }
        ]
    }
];
