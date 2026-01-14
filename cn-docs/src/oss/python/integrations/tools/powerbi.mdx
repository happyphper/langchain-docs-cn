---
title: PowerBI 工具包
---
本笔记本展示了一个与 `Power BI 数据集` 交互的智能体（agent）。该智能体能够回答关于数据集的一般性问题，并能从错误中恢复。

请注意，由于该智能体正处于积极开发阶段，其所有回答可能并非完全正确。它通过 [executequery 端点](https://learn.microsoft.com/en-us/rest/api/power-bi/datasets/execute-queries) 运行，该端点不允许执行删除操作。

### 注意事项

-   它依赖于 `azure.identity` 包进行身份验证，可通过 `pip install azure-identity` 安装。或者，您也可以在不提供凭据的情况下，使用字符串形式的令牌来创建 PowerBI 数据集。
-   您还可以提供一个用户名进行模拟，以便与启用了行级安全性（RLS）的数据集一起使用。
-   该工具包使用大语言模型（LLM）根据问题生成查询，而智能体则使用 LLM 进行整体执行。
-   测试主要使用 `gpt-3.5-turbo-instruct` 模型完成，Codex 模型的表现似乎不太理想。

## 初始化

```python
from azure.identity import DefaultAzureCredential
from langchain_community.agent_toolkits import PowerBIToolkit, create_pbi_agent
from langchain_community.utilities.powerbi import PowerBIDataset
from langchain_openai import ChatOpenAI
```

```python
fast_llm = ChatOpenAI(
    temperature=0.5, max_tokens=1000, model_name="gpt-3.5-turbo", verbose=True
)
smart_llm = ChatOpenAI(temperature=0, max_tokens=100, model_name="gpt-4", verbose=True)

toolkit = PowerBIToolkit(
    powerbi=PowerBIDataset(
        dataset_id="<dataset_id>",
        table_names=["table1", "table2"],
        credential=DefaultAzureCredential(),
    ),
    llm=smart_llm,
)

agent_executor = create_pbi_agent(
    llm=fast_llm,
    toolkit=toolkit,
    verbose=True,
)
```

## 示例：描述表

```python
agent_executor.run("Describe table1")
```

## 示例：对表进行简单查询

在此示例中，智能体实际上找到了获取表行数的正确查询。

```python
agent_executor.run("How many records are in table1?")
```

## 示例：运行查询

```python
agent_executor.run("How many records are there by dimension1 in table2?")
```

```python
agent_executor.run("What unique values are there for dimensions2 in table2")
```

## 示例：添加您自己的少量示例提示

```python
# fictional example
few_shots = """
Question: How many rows are in the table revenue?
DAX: EVALUATE ROW("Number of rows", COUNTROWS(revenue_details))
----
Question: How many rows are in the table revenue where year is not empty?
DAX: EVALUATE ROW("Number of rows", COUNTROWS(FILTER(revenue_details, revenue_details[year] <> "")))
----
Question: What was the average of value in revenue in dollars?
DAX: EVALUATE ROW("Average", AVERAGE(revenue_details[dollar_value]))
----
"""
toolkit = PowerBIToolkit(
    powerbi=PowerBIDataset(
        dataset_id="<dataset_id>",
        table_names=["table1", "table2"],
        credential=DefaultAzureCredential(),
    ),
    llm=smart_llm,
    examples=few_shots,
)
agent_executor = create_pbi_agent(
    llm=fast_llm,
    toolkit=toolkit,
    verbose=True,
)
```

```python
agent_executor.run("What was the maximum of value in revenue in dollars in 2022?")
```
