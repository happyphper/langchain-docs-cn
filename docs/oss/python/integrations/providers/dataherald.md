---
title: 数据先驱
---
>[Dataherald](https://www.dataherald.com) 是一个自然语言转 SQL 的工具。

本页介绍如何在 LangChain 中使用 `Dataherald API`。

## 安装与设置
- 使用以下命令安装所需依赖：

::: code-group

```bash [pip]
pip install dataherald
```

```bash [uv]
uv add dataherald
```

:::

- 前往 dataherald 并在此处注册：[here](https://www.dataherald.com)
- 创建一个应用并获取你的 `API KEY`
- 将你的 `API KEY` 设置为环境变量 `DATAHERALD_API_KEY`

## 包装器

### 实用工具

存在一个封装此 API 的 DataheraldAPIWrapper 实用工具。导入此实用工具：

```python
from langchain_community.utilities.dataherald import DataheraldAPIWrapper
```

关于此包装器的更详细说明，请参阅[此笔记本](/oss/integrations/tools/dataherald)。

### 工具

你可以在智能体（agent）中像这样使用该工具：

```python
from langchain_community.utilities.dataherald import DataheraldAPIWrapper
from langchain_community.tools.dataherald.tool import DataheraldTextToSQL
from langchain_openai import ChatOpenAI
from langchain_classic import hub
from langchain.agents import AgentExecutor, create_agent, load_tools

api_wrapper = DataheraldAPIWrapper(db_connection_id="<db_connection_id>")
tool = DataheraldTextToSQL(api_wrapper=api_wrapper)
llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0)
prompt = hub.pull("hwchase17/react")
agent = create_agent(llm, tools, prompt)
agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True, handle_parsing_errors=True)
agent_executor.invoke({"input":"Return the sql for this question: How many employees are in the company?"})
```

输出

```shell
> 进入新的 AgentExecutor 链...
我需要使用一个能将此问题转换为 SQL 的工具。
动作：dataherald
动作输入：How many employees are in the company?答案：SELECT
    COUNT(*) FROM employees我现在知道了最终答案
最终答案：SELECT
    COUNT(*)
FROM
    employees

> 链结束。
{'input': 'Return the sql for this question: How many employees are in the company?', 'output': "SELECT \n    COUNT(*)\nFROM \n    employees"}
```

有关工具的更多信息，请参阅[此页面](/oss/integrations/tools)。
