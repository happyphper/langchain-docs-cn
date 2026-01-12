---
title: Pipeshift
---
> [Pipeshift](https://pipeshift.com) 是一个面向开源大语言模型（LLM）的微调与推理平台。

- 您提供数据集。微调多个大语言模型。一键启动推理，并见证它们扩展到数百万级别。

## 安装与设置

- 安装 Pipeshift 集成包。

```bash
pip install langchain-pipeshift
```

- 在 [Pipeshift](https://pipeshift.com) 注册以获取您的 Pipeshift API 密钥。

### 身份验证

您可以通过以下任一方式使用您的 Pipeshift API 密钥进行身份验证：

1. 将 API 密钥添加到环境变量 `PIPESHIFT_API_KEY` 中。

```python
os.environ["PIPESHIFT_API_KEY"] = "<your_api_key>"
```

2. 通过将 `api_key` 传递给 pipeshift LLM 模块或聊天模块

```python
llm = Pipeshift(api_key="<your_api_key>", model="meta-llama/Meta-Llama-3.1-8B-Instruct", max_tokens=512)

                    或

chat = ChatPipeshift(api_key="<your_api_key>", model="meta-llama/Meta-Llama-3.1-8B-Instruct", max_tokens=512)
```

## 聊天模型

查看一个[示例](/oss/python/integrations/chat/pipeshift)。

```python
from langchain_pipeshift import ChatPipeshift
```
## 大语言模型

查看一个[示例](/oss/python/integrations/llms/pipeshift)。

```python
from langchain_pipeshift import Pipeshift
```
