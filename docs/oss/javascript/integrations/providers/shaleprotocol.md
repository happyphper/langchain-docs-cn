---
title: Shale Protocol
---
[Shale Protocol](https://shaleprotocol.com) 为开源大语言模型提供生产就绪的推理 API。它是一个即插即用的 API，托管在高度可扩展的 GPU 云基础设施上。

我们的免费套餐支持每个密钥每天最多 1,000 次请求，因为我们希望消除任何人开始使用 LLM 构建生成式 AI 应用的门槛。

借助 Shale Protocol，开发者/研究人员可以零成本创建应用并探索开源大语言模型的能力。

本页介绍如何将 Shale-Serve API 与 LangChain 结合使用。

截至 2023 年 6 月，该 API 默认支持 Vicuna-13B。我们将在未来的版本中支持更多 LLM，例如 Falcon-40B。

## 操作指南

### 1. 在 https://shaleprotocol.com 上找到我们 Discord 的链接。通过我们 Discord 上的 "Shale Bot" 生成一个 API 密钥。无需信用卡，也没有免费试用。这是一个永久免费的套餐，每个 API 密钥每天有 1K 次请求限制。

### 2. 使用 https://shale.live/v1 作为 OpenAI API 的直接替代品

例如

```python
from langchain_openai import OpenAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser

import os
os.environ['OPENAI_API_BASE'] = "https://shale.live/v1"
os.environ['OPENAI_API_KEY'] = "ENTER YOUR API KEY"

llm = OpenAI()

template = """Question: {question}

# Answer: Let's think step by step."""

prompt = PromptTemplate.from_template(template)

llm_chain = prompt | llm | StrOutputParser()

question = "What NFL team won the Super Bowl in the year Justin Beiber was born?"

llm_chain.invoke(question)
```
