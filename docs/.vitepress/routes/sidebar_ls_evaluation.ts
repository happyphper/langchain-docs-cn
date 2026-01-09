export const lsEvaluation = [
    {
        text: '评估',
        items: [
            { text: '概述', link: '/langsmith/evaluation' },
            { text: '快速开始', link: '/langsmith/evaluation-quickstart' },
            { text: '核心概念', link: '/langsmith/evaluation-concepts' },
            { text: '评估方法', link: '/langsmith/evaluation-approaches' }
        ]
    },
    {
        text: '数据集',
        items: [
            {
                text: '创建数据集',
                collapsed: true,
                items: [
                    { text: '使用 UI', link: '/langsmith/manage-datasets-in-application' },
                    { text: '使用 SDK', link: '/langsmith/manage-datasets-programmatically' }
                ]
            },
            { text: '管理数据集', link: '/langsmith/manage-datasets' },
            { text: '自定义输出渲染', link: '/langsmith/custom-output-rendering' }
        ]
    },
    {
        text: '设置评估',
        items: [
            {
                text: '运行评估',
                collapsed: true,
                items: [
                    { text: '使用 SDK', link: '/langsmith/evaluate-llm-application' },
                    { text: '使用 UI', link: '/langsmith/run-evaluation-from-prompt-playground' },
                    { text: '使用预置评估器', link: '/langsmith/prebuilt-evaluators' }
                ]
            },
            {
                text: '评估类型',
                collapsed: true,
                items: [
                    { text: '概述', link: '/langsmith/evaluation-types' },
                    { text: '代码评估器', link: '/langsmith/code-evaluator' },
                    { text: 'LLM 裁判评估器', link: '/langsmith/llm-as-judge' },
                    { text: '复合评估器', link: '/langsmith/composite-evaluators' },
                    { text: '总结评估器', link: '/langsmith/summary' },
                    { text: '成对评估', link: '/langsmith/evaluate-pairwise' }
                ]
            },
            {
                text: '框架与集成',
                collapsed: true,
                items: [
                    { text: '异步运行评估', link: '/langsmith/evaluation-async' },
                    { text: '使用 pytest 运行评估', link: '/langsmith/pytest' },
                    { text: '使用 Vitest/Jest 运行评估', link: '/langsmith/vitest-jest' },
                    { text: '使用 API', link: '/langsmith/run-evals-api-only' }
                ]
            },
            {
                text: '评估技术',
                collapsed: true,
                items: [
                    { text: '实验配置', link: '/langsmith/experiment-configuration' },
                    { text: '定义待评估的目标函数', link: '/langsmith/define-target-function' },
                    { text: '评估中间步骤', link: '/langsmith/evaluate-on-intermediate-steps' },
                    { text: '单个评估器返回多个得分', link: '/langsmith/multiple-scores' },
                    { text: '返回分类与数值指标', link: '/langsmith/metric-type' },
                    { text: '在实验上运行评估器', link: '/langsmith/bind-evaluator-to-dataset' },
                    { text: '带有重复次数的评估', link: '/langsmith/repetition' },
                    { text: '处理模型速率限制', link: '/langsmith/rate-limiting' },
                    { text: '在本地运行评估 (Python)', link: '/langsmith/local' },
                    { text: '在本地读取实验结果', link: '/langsmith/read-local-experiment-results' },
                    { text: '评估可运行对象 (Runnable)', link: '/langsmith/langchain-runnable' },
                    { text: '评估图 (Graph)', link: '/langsmith/evaluate-graph' },
                    { text: '评估现有实验 (Python)', link: '/langsmith/evaluate-existing-experiment' },
                    { text: '运行多模态内容评估', link: '/langsmith/evaluate-with-attachments' },
                    { text: '模拟多轮交互', link: '/langsmith/multi-turn-simulation' },
                    { text: '评估智能体轨迹', link: '/langsmith/trajectory-evals' }
                ]
            },
            {
                text: '优化评估器',
                collapsed: true,
                items: [
                    { text: '使用人工反馈优化 LLM 裁判评估器', link: '/langsmith/improve-judge-evaluator-feedback' },
                    { text: '使用 Few-shot 示例优化评估器', link: '/langsmith/create-few-shot-evaluators' },
                    { text: '动态 Few-shot 示例选择', link: '/langsmith/index-datasets-for-dynamic-few-shot-example-selection' }
                ]
            },
            {
                text: '教程',
                collapsed: true,
                items: [
                    { text: '评估对话机器人', link: '/langsmith/evaluate-chatbot-tutorial' },
                    { text: '评估 RAG 应用', link: '/langsmith/evaluate-rag-tutorial' },
                    { text: '使用 Pytest/Vitest 和 LangSmith 测试 ReAct 智能体', link: '/langsmith/test-react-agent-pytest' },
                    { text: '评估复杂智能体', link: '/langsmith/evaluate-complex-agent' },
                    { text: '对新版本智能体运行回测', link: '/langsmith/run-backtests-new-agent' }
                ]
            }
        ]
    },
    {
        text: '分析实验结果',
        items: [
            { text: '分析实验', link: '/langsmith/analyze-an-experiment' },
            { text: '对比实验结果', link: '/langsmith/compare-experiment-results' },
            { text: '在 UI 中过滤实验', link: '/langsmith/filter-experiments-ui' },
            { text: '获取实验性能指标', link: '/langsmith/fetch-perf-metrics-experiment' },
            { text: '上传在 LangSmith 外运行的实验', link: '/langsmith/upload-existing-experiments' }
        ]
    },
    {
        text: '标注与人工反馈',
        items: [
            { text: '使用标注队列', link: '/langsmith/annotation-queues' },
            { text: '设置反馈标准', link: '/langsmith/set-up-feedback-criteria' },
            { text: '内联标注追踪和运行', link: '/langsmith/annotate-traces-inline' },
            { text: '审计评估器得分', link: '/langsmith/audit-evaluator-scores' }
        ]
    },
    {
        text: '常见数据类型',
        items: [
            { text: '示例数据格式', link: '/langsmith/example-data-format' },
            { text: '数据集预置 JSON Schema 类型', link: '/langsmith/dataset-json-types' },
            { text: '数据集转换', link: '/langsmith/dataset-transformations' }
        ]
    }
];
