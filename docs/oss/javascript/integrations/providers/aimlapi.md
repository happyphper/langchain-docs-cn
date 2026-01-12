---
title: AI/ML API
---
>[AI/ML API](https://aimlapi.com/app/?utm_source=langchain&utm_medium=github&utm_campaign=integration) 提供了一个统一的 API，用于访问 300 多个托管的基座模型（DeepSeek、Gemini、GPT 等），并具备企业级的正常运行时间和吞吐量。

## 安装与设置

- 安装 AI/ML API 集成包。

```bash
pip install langchain-aimlapi
```

- 在 [aimlapi.com](https://aimlapi.com/app/?utm_source=langchain&utm_medium=github&utm_campaign=integration) 创建账户并生成 API 密钥。
- 通过设置 `AIMLAPI_API_KEY` 环境变量进行身份验证。

```python
import os

os.environ["AIMLAPI_API_KEY"] = "aimlapi_..."
```

## 聊天模型

查看[使用示例](/oss/javascript/integrations/chat/aimlapi)。

```python
from langchain_aimlapi import ChatAimlapi
```

## 大语言模型 (LLMs)

查看[使用示例](/oss/javascript/integrations/llms/aimlapi)。

```python
from langchain_aimlapi import AimlapiLLM
```

## 嵌入模型

查看[使用示例](/oss/javascript/integrations/text_embedding/aimlapi)。

```python
from langchain_aimlapi import AimlapiEmbeddings
```
