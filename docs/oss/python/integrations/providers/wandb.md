---
title: Weights & Biases
---
>[Weights & Biases](https://wandb.ai/) 是一个 AI 开发者平台提供商，用于训练和微调 AI 模型以及开发 AI 应用程序。

`Weights & Biases` 产品可用于在训练过程中记录指标和工件，并追踪代码的执行情况。

在 LangChain 中使用 `Weights & Biases` 产品主要有以下几种方式：
- 使用 `wandb_tracing_enabled`
- 使用 `Weave` 轻量级工具包
- 使用 `WandbCallbackHandler`（已弃用）

## wandb_tracing_enabled

查看[使用示例](/oss/integrations/providers/wandb_tracing)。

查看 [W&B 文档](https://docs.wandb.ai/guides/integrations/langchain)。

```python
from langchain_community.callbacks import wandb_tracing_enabled
```

## Weave

查看 [W&B 文档](https://weave-docs.wandb.ai/guides/integrations/langchain)。

## WandbCallbackHandler

**注意：** `WandbCallbackHandler` 正在被弃用，推荐使用 `wandb_tracing_enabled`。

查看[使用示例](/oss/integrations/providers/wandb_tracking)。

查看 [W&B 文档](https://docs.wandb.ai/guides/integrations/langchain)。

```python
from langchain_community.callbacks import WandbCallbackHandler
```
