---
title: GooseAI
---
>[GooseAI](https://goose.ai) 让部署 NLP 服务变得更简单、更易用。
> `GooseAI` 是一个通过 API 交付的完全托管的推理服务。
> 它与其他知名 API 功能对等，`GooseAI` 提供了一个即插即用的解决方案，
> 只需在您的代码中修改两行，就能以业界最佳的经济效益提供开源语言模型服务。

## 安装与设置

- 使用 `pip install openai` 安装 Python SDK。
- 从此链接[获取](https://goose.ai/)您的 GooseAI API 密钥。
- 设置环境变量 (`GOOSEAI_API_KEY`)。

```python
import os
os.environ["GOOSEAI_API_KEY"] = "YOUR_API_KEY"
```

## LLMs

查看[使用示例](/oss/python/integrations/llms/gooseai)。

```python
from langchain_community.llms import GooseAI
```
