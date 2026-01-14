---
title: Fiddler
---
>[Fiddler](https://www.fiddler.ai/) 是企业级生成式和预测性系统运维领域的先驱，它提供了一个统一的平台，使数据科学、MLOps、风险、合规、分析及其他业务线团队能够监控、解释、分析并改进企业规模的机器学习部署。

## 1. 安装与设置

```python
#!pip install langchain langchain-community langchain-openai fiddler-client
```

## 2. Fiddler 连接详情

*在您向 Fiddler 添加模型信息之前，需要准备以下内容：*

1.  您用于连接 Fiddler 的 URL
2.  您的组织 ID
3.  您的授权令牌

这些信息可以通过导航到您的 Fiddler 环境的 *Settings* 页面找到。

```python
URL = ""  # 您的 Fiddler 实例 URL，请确保包含完整的 URL（包括 https://）。例如：https://demo.fiddler.ai
ORG_NAME = ""
AUTH_TOKEN = ""  # 您的 Fiddler 实例授权令牌

# Fiddler 项目和模型名称，用于模型注册
PROJECT_NAME = ""
MODEL_NAME = ""  # Fiddler 中的模型名称
```

## 3. 创建 fiddler 回调处理器实例

```python
from langchain_community.callbacks.fiddler_callback import FiddlerCallbackHandler

fiddler_handler = FiddlerCallbackHandler(
    url=URL,
    org=ORG_NAME,
    project=PROJECT_NAME,
    model=MODEL_NAME,
    api_key=AUTH_TOKEN,
)
```

## 示例 1：基础链

```python
from langchain_core.output_parsers import StrOutputParser
from langchain_openai import OpenAI

# 注意：确保在环境变量 OPENAI_API_KEY 中设置了 OpenAI API 密钥
llm = OpenAI(temperature=0, streaming=True, callbacks=[fiddler_handler])
output_parser = StrOutputParser()

chain = llm | output_parser

# 调用链。调用将被记录到 Fiddler，并自动生成指标
chain.invoke("How far is moon from earth?")
```

```python
# 更多调用示例
chain.invoke("What is the temperature on Mars?")
chain.invoke("How much is 2 + 200000?")
chain.invoke("Which movie won the oscars this year?")
chain.invoke("Can you write me a poem about insomnia?")
chain.invoke("How are you doing today?")
chain.invoke("What is the meaning of life?")
```

## 示例 2：包含提示模板的链

```python
from langchain_core.prompts import (
    ChatPromptTemplate,
    FewShotChatMessagePromptTemplate,
)

examples = [
    {"input": "2+2", "output": "4"},
    {"input": "2+3", "output": "5"},
]

example_prompt = ChatPromptTemplate.from_messages(
    [
        ("human", "{input}"),
        ("ai", "{output}"),
    ]
)

few_shot_prompt = FewShotChatMessagePromptTemplate(
    example_prompt=example_prompt,
    examples=examples,
)

final_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", "You are a wondrous wizard of math."),
        few_shot_prompt,
        ("human", "{input}"),
    ]
)

# 注意：确保在环境变量 OPENAI_API_KEY 中设置了 OpenAI API 密钥
llm = OpenAI(temperature=0, streaming=True, callbacks=[fiddler_handler])

chain = final_prompt | llm

# 调用链。调用将被记录到 Fiddler，并自动生成指标
chain.invoke({"input": "What's the square of a triangle?"})
```
