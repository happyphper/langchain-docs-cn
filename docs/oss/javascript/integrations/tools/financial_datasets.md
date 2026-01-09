---
title: 金融数据集工具包
---
[financialdatasets](https://financialdatasets.ai/) 股票市场 API 提供了 REST 端点，可让您获取涵盖 30 多年、超过 16,000 种股票代码的金融数据。

## 设置

要使用此工具包，您需要两个 API 密钥：

`FINANCIAL_DATASETS_API_KEY`：从 [financialdatasets.ai](https://financialdatasets.ai/) 获取。
`OPENAI_API_KEY`：从 [OpenAI](https://platform.openai.com/) 获取。

```python
import getpass
import os

os.environ["FINANCIAL_DATASETS_API_KEY"] = getpass.getpass()
```

```python
os.environ["OPENAI_API_KEY"] = getpass.getpass()
```

### 安装

此工具包位于 `langchain-community` 包中。

```python
pip install -qU langchain-community
```

## 实例化

现在我们可以实例化我们的工具包：

```python
from langchain_community.agent_toolkits.financial_datasets.toolkit import (
    FinancialDatasetsToolkit,
)
from langchain_community.utilities.financial_datasets import FinancialDatasetsAPIWrapper

api_wrapper = FinancialDatasetsAPIWrapper(
    financial_datasets_api_key=os.environ["FINANCIAL_DATASETS_API_KEY"]
)
toolkit = FinancialDatasetsToolkit(api_wrapper=api_wrapper)
```

## 工具

查看可用工具：

```python
tools = toolkit.get_tools()
```

## 在智能体中使用

让我们为智能体配备 FinancialDatasetsToolkit 并询问财务问题。

```python
system_prompt = """
您是一个配备了专用工具以访问和分析金融数据的高级金融分析 AI 助手。您的主要功能是通过检索和解释上市公司的利润表、资产负债表和现金流量表来帮助用户进行财务分析。

您可以访问 FinancialDatasetsToolkit 中的以下工具：

1. 资产负债表：检索给定股票代码的资产负债表数据。
2. 利润表：获取指定公司的利润表数据。
3. 现金流量表：访问特定股票代码的现金流量表信息。

您的能力包括：

1. 使用股票代码检索任何上市公司的财务报表。
2. 基于这些报表中的数据，分析财务比率和指标。
3. 比较不同时间段（例如，同比或环比）的财务表现。
4. 识别公司财务健康状况和表现的趋势。
5. 提供关于公司流动性、偿债能力、盈利能力和效率的见解。
6. 用简单的术语解释复杂的金融概念。

在回应查询时：

1. 始终说明您分析所使用的财务报表。
2. 为您引用的数字提供上下文（例如，财年、季度）。
3. 清晰地解释您的推理和计算过程。
4. 如果您需要更多信息来提供完整的答案，请要求澄清。
5. 在适当的时候，建议可能有所帮助的额外分析。

请记住，您的目标是提供准确、有洞察力的财务分析，以帮助用户做出明智的决策。在回应中始终保持专业和客观的语气。
"""
```

实例化 LLM。

```python
from langchain.tools import tool
from langchain_openai import ChatOpenAI

model = ChatOpenAI(model="gpt-4o")
```

定义一个用户查询。

```python
query = "What was AAPL's revenue in 2023? What about it's total debt in Q1 2024?"
```

创建智能体。

```python
from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain_core.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system_prompt),
        ("human", "{input}"),
        # 占位符填充一个消息**列表**
        ("placeholder", "{agent_scratchpad}"),
    ]
)

agent = create_tool_calling_agent(model, tools, prompt)
agent_executor = AgentExecutor(agent=agent, tools=tools)
```

查询智能体。

```python
agent_executor.invoke({"input": query})
```

---

## API 参考

有关 `FinancialDatasetsToolkit` 所有功能和配置的详细文档，请前往 [API 参考](https://python.langchain.com/api_reference/community/agent_toolkits/langchain_community.agent_toolkits.financial_datasets.toolkit.FinancialDatasetsToolkit.html)。
