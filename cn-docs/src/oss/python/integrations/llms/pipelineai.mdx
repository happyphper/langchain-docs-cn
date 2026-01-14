---
title: PipelineAI
---
>[PipelineAI](https://pipeline.ai) 允许您在云端大规模运行机器学习模型。它还提供了对[多个大型语言模型（LLM）](https://pipeline.ai)的 API 访问。

本笔记本将介绍如何将 LangChain 与 [PipelineAI](https://docs.pipeline.ai/docs) 结合使用。

## PipelineAI 示例

[此示例展示了 PipelineAI 如何与 LangChain 集成](https://docs.pipeline.ai/docs/langchain)，它由 PipelineAI 创建。

## 设置

使用 `PipelineAI` API（也称为 `Pipeline Cloud`）需要 `pipeline-ai` 库。使用 `pip install pipeline-ai` 安装 `pipeline-ai`。

```python
# 安装包
pip install -qU  pipeline-ai
```

## 示例

### 导入

```python
import os

from langchain_community.llms import PipelineAI
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate
```

### 设置环境 API 密钥

请确保从 PipelineAI 获取您的 API 密钥。查看[云端快速入门指南](https://docs.pipeline.ai/docs/cloud-quickstart)。您将获得 30 天免费试用期，包含 10 小时的无服务器 GPU 计算资源，用于测试不同模型。

```python
os.environ["PIPELINE_API_KEY"] = "YOUR_API_KEY_HERE"
```

## 创建 PipelineAI 实例

实例化 PipelineAI 时，您需要指定要使用的流水线（pipeline）的 ID 或标签，例如 `pipeline_key = "public/gpt-j:base"`。然后，您可以选择传递特定于该流水线的额外关键字参数：

```python
llm = PipelineAI(pipeline_key="YOUR_PIPELINE_KEY", pipeline_kwargs={...})
```

### 创建提示模板

我们将为问答创建一个提示模板。

```python
template = """问题：{question}

答案：让我们一步步思考。"""

prompt = PromptTemplate.from_template(template)
```

### 初始化 LLMChain

```python
llm_chain = prompt | llm | StrOutputParser()
```

### 运行 LLMChain

提供一个问题并运行 LLMChain。

```python
question = "贾斯汀·比伯出生那年，哪支 NFL 球队赢得了超级碗？"

llm_chain.invoke(question)
```
