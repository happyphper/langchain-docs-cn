---
title: Dappier
---
[Dappier](https://dappier.com) 将任何 LLM 或您的智能体 AI 连接到来自可信来源的实时、权利清晰、专有的数据，使您的 AI 成为任何领域的专家。我们的专业模型包括实时网络搜索、新闻、体育、金融股市数据、加密货币数据以及来自优质出版商的独家内容。在我们的市场 [marketplace.dappier.com](https://marketplace.dappier.com) 探索广泛的数据模型。

[Dappier](https://dappier.com) 提供经过丰富处理、即用且上下文相关的数据字符串，专为与 LangChain 无缝集成而优化。无论您是在构建对话式 AI、推荐引擎还是智能搜索，Dappier 的 LLM 无关 RAG 模型都能确保您的 AI 能够访问经过验证的最新数据，而无需构建和管理自己的检索管道的复杂性。

## 安装与设置

安装 `langchain-dappier` 并设置环境变量 `DAPPIER_API_KEY`。

::: code-group

```bash [pip]
pip install -U langchain-dappier
export DAPPIER_API_KEY="your-api-key"
```

```bash [uv]
uv add langchain-dappier
export DAPPIER_API_KEY="your-api-key"
```

:::

我们还需要设置 Dappier API 凭证，可以在 [Dappier 网站](https://platform.dappier.com/profile/api-keys) 生成。

我们可以前往 [Dappier 市场](https://platform.dappier.com/marketplace) 查找支持的数据模型。

## 聊天模型

查看 [使用示例](/oss/integrations/chat/dappier)。

```python
from langchain_community.chat_models import ChatDappierAI
```

## 检索器

查看 [使用示例](/oss/integrations/retrievers/dappier)。

```python
from langchain_dappier import DappierRetriever
```

## 工具

查看 [使用示例](/oss/integrations/tools/dappier)。

```python
from langchain_dappier import (
    DappierRealTimeSearchTool,
    DappierAIRecommendationTool
)
```
