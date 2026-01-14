// lsEvaluation 侧边栏配置
export const lsEvaluation = [
    {
        "text": "评估（Evaluation）",
        "link": "/langsmith/evaluation"
    },
    {
        "text": "评估快速入门",
        "link": "/langsmith/evaluation-quickstart"
    },
    {
        "text": "评估概念",
        "link": "/langsmith/evaluation-concepts"
    },
    {
        "text": "评估方法",
        "link": "/langsmith/evaluation-approaches"
    },
    {
        "text": "数据集",
        "collapsed": false,
        "items": [
            {
                "text": "创建数据集",
                "collapsed": false,
                "items": [
                    {
                        "text": "在应用中管理数据集",
                        "link": "/langsmith/manage-datasets-in-application"
                    },
                    {
                        "text": "以编程方式管理数据集",
                        "link": "/langsmith/manage-datasets-programmatically"
                    }
                ]
            },
            {
                "text": "管理数据集",
                "link": "/langsmith/manage-datasets"
            },
            {
                "text": "自定义输出渲染",
                "link": "/langsmith/custom-output-rendering"
            }
        ]
    },
    {
        "text": "设置评估",
        "collapsed": false,
        "items": [
            {
                "text": "运行评估",
                "collapsed": false,
                "items": [
                    {
                        "text": "评估 LLM 应用",
                        "link": "/langsmith/evaluate-llm-application"
                    },
                    {
                        "text": "从提示词游乐场运行评估",
                        "link": "/langsmith/run-evaluation-from-prompt-playground"
                    },
                    {
                        "text": "预构建评估器",
                        "link": "/langsmith/prebuilt-evaluators"
                    }
                ]
            },
            {
                "text": "评估类型",
                "collapsed": false,
                "items": [
                    {
                        "text": "评估类型",
                        "link": "/langsmith/evaluation-types"
                    },
                    {
                        "text": "代码评估器",
                        "link": "/langsmith/code-evaluator"
                    },
                    {
                        "text": "LLM 作为评判者",
                        "link": "/langsmith/llm-as-judge"
                    },
                    {
                        "text": "复合评估器",
                        "link": "/langsmith/composite-evaluators"
                    },
                    {
                        "text": "摘要",
                        "link": "/langsmith/summary"
                    },
                    {
                        "text": "成对评估",
                        "link": "/langsmith/evaluate-pairwise"
                    }
                ]
            },
            {
                "text": "框架与集成（Integrations）",
                "collapsed": false,
                "items": [
                    {
                        "text": "异步评估",
                        "link": "/langsmith/evaluation-async"
                    },
                    {
                        "text": "Pytest",
                        "link": "/langsmith/pytest"
                    },
                    {
                        "text": "Vitest/Jest",
                        "link": "/langsmith/vitest-jest"
                    },
                    {
                        "text": "仅通过 API 运行评估",
                        "link": "/langsmith/run-evals-api-only"
                    }
                ]
            },
            {
                "text": "评估技术",
                "collapsed": false,
                "items": [
                    {
                        "text": "实验配置",
                        "link": "/langsmith/experiment-configuration"
                    },
                    {
                        "text": "定义目标函数",
                        "link": "/langsmith/define-target-function"
                    },
                    {
                        "text": "评估中间步骤",
                        "link": "/langsmith/evaluate-on-intermediate-steps"
                    },
                    {
                        "text": "多分数",
                        "link": "/langsmith/multiple-scores"
                    },
                    {
                        "text": "指标类型",
                        "link": "/langsmith/metric-type"
                    },
                    {
                        "text": "将评估器绑定到数据集",
                        "link": "/langsmith/bind-evaluator-to-dataset"
                    },
                    {
                        "text": "重复",
                        "link": "/langsmith/repetition"
                    },
                    {
                        "text": "速率限制",
                        "link": "/langsmith/rate-limiting"
                    },
                    {
                        "text": "本地",
                        "link": "/langsmith/local"
                    },
                    {
                        "text": "读取本地实验结果",
                        "link": "/langsmith/read-local-experiment-results"
                    },
                    {
                        "text": "LangChain Runnable",
                        "link": "/langsmith/langchain-runnable"
                    },
                    {
                        "text": "评估图（Graph）",
                        "link": "/langsmith/evaluate-graph"
                    },
                    {
                        "text": "评估现有实验",
                        "link": "/langsmith/evaluate-existing-experiment"
                    },
                    {
                        "text": "使用附件评估",
                        "link": "/langsmith/evaluate-with-attachments"
                    },
                    {
                        "text": "多轮模拟",
                        "link": "/langsmith/multi-turn-simulation"
                    },
                    {
                        "text": "轨迹评估",
                        "link": "/langsmith/trajectory-evals"
                    }
                ]
            },
            {
                "text": "改进评估器",
                "collapsed": false,
                "items": [
                    {
                        "text": "改进评判评估器反馈",
                        "link": "/langsmith/improve-judge-evaluator-feedback"
                    },
                    {
                        "text": "创建少样本评估器",
                        "link": "/langsmith/create-few-shot-evaluators"
                    },
                    {
                        "text": "为动态少样本示例选择索引数据集",
                        "link": "/langsmith/index-datasets-for-dynamic-few-shot-example-selection"
                    }
                ]
            },
            {
                "text": "教程（Tutorials）",
                "collapsed": false,
                "items": [
                    {
                        "text": "评估聊天机器人教程",
                        "link": "/langsmith/evaluate-chatbot-tutorial"
                    },
                    {
                        "text": "评估 RAG 教程",
                        "link": "/langsmith/evaluate-rag-tutorial"
                    },
                    {
                        "text": "使用 Pytest 测试 React 智能体（Agent）",
                        "link": "/langsmith/test-react-agent-pytest"
                    },
                    {
                        "text": "评估复杂智能体（Agent）",
                        "link": "/langsmith/evaluate-complex-agent"
                    },
                    {
                        "text": "对新智能体（Agent）运行回测",
                        "link": "/langsmith/run-backtests-new-agent"
                    }
                ]
            }
        ]
    },
    {
        "text": "分析实验结果",
        "collapsed": false,
        "items": [
            {
                "text": "分析实验",
                "link": "/langsmith/analyze-an-experiment"
            },
            {
                "text": "比较实验结果",
                "link": "/langsmith/compare-experiment-results"
            },
            {
                "text": "在 UI 中过滤实验",
                "link": "/langsmith/filter-experiments-ui"
            },
            {
                "text": "获取实验性能指标",
                "link": "/langsmith/fetch-perf-metrics-experiment"
            },
            {
                "text": "上传现有实验",
                "link": "/langsmith/upload-existing-experiments"
            }
        ]
    },
    {
        "text": "标注与人工反馈",
        "collapsed": false,
        "items": [
            {
                "text": "标注队列",
                "link": "/langsmith/annotation-queues"
            },
            {
                "text": "设置反馈标准",
                "link": "/langsmith/set-up-feedback-criteria"
            },
            {
                "text": "内联标注追踪",
                "link": "/langsmith/annotate-traces-inline"
            },
            {
                "text": "审计评估器分数",
                "link": "/langsmith/audit-evaluator-scores"
            }
        ]
    },
    {
        "text": "常见数据类型",
        "collapsed": false,
        "items": [
            {
                "text": "示例数据格式",
                "link": "/langsmith/example-data-format"
            },
            {
                "text": "数据集 JSON 类型",
                "link": "/langsmith/dataset-json-types"
            },
            {
                "text": "数据集转换",
                "link": "/langsmith/dataset-transformations"
            }
        ]
    }
];
