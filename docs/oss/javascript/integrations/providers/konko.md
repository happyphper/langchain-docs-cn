---
title: Konko
---
所有与 Konko 相关的功能

>[Konko AI](https://www.konko.ai/) 提供了一个完全托管的 API，帮助应用开发者：

>1.  **选择** 适合其应用的开源或专有 LLM
>2.  **更快地构建** 应用，通过与领先的应用框架集成和完全托管的 API
>3.  **微调** 较小的开源 LLM，以极低的成本实现行业领先的性能
>4.  **部署生产级 API**，满足安全性、隐私性、吞吐量和延迟的 SLA，无需基础设施设置或管理，使用 Konko AI 符合 SOC 2 标准的多云基础设施

## 安装与设置

1.  登录我们的 Web 应用以 [创建 API 密钥](https://platform.konko.ai/settings/api-keys)，通过我们的 [聊天补全](https://docs.konko.ai/reference/post-chat-completions) 和 [补全](https://docs.konko.ai/reference/post-completions) 端点访问模型。
2.  启用 Python 3.8+ 环境
3.  安装 SDK

::: code-group

```bash [pip]
pip install konko
```

```bash [uv]
uv add konko
```

:::

4.  将 API 密钥设置为环境变量 (`KONKO_API_KEY`, `OPENAI_API_KEY`)

```bash
export KONKO_API_KEY={your_KONKO_API_KEY_here}
export OPENAI_API_KEY={your_OPENAI_API_KEY_here} #可选
```

更多详情请参阅 [Konko 文档](https://docs.konko.ai/docs/getting-started)。

## LLM

**探索可用模型：** 首先浏览 Konko 上的 [可用模型](https://docs.konko.ai/docs/list-of-models)。每个模型适用于不同的用例和能力。

另一种查找在 Konko 实例上运行的模型列表的方法是通过此 [端点](https://docs.konko.ai/reference/get-models)。

查看使用 [示例](/oss/javascript/integrations/llms/konko)。

### 端点使用示例

-   **使用 mistralai/Mistral-7B-v0.1 进行补全：**

```python
from langchain_community.llms import Konko
llm = Konko(max_tokens=800, model='mistralai/Mistral-7B-v0.1')
prompt = "Generate a Product Description for Apple Iphone 15"
response = llm.invoke(prompt)
```

## 聊天模型

查看使用 [示例](/oss/javascript/integrations/chat/konko)。

-   **使用 Mistral-7B 进行 ChatCompletion：**

```python
from langchain.messages import HumanMessage
from langchain_community.chat_models import ChatKonko
chat_instance = ChatKonko(max_tokens=10, model = 'mistralai/mistral-7b-instruct-v0.1')
msg = HumanMessage(content="Hi")
chat_response = chat_instance([msg])
```

如需进一步帮助，请联系 [support@konko.ai](mailto:support@konko.ai) 或加入我们的 [Discord](https://discord.gg/TXV2s3z7RZ)。
