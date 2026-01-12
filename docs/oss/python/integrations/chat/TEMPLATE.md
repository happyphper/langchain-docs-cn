---
title: 聊天(MODULE_NAME)
---
如何使用此 Python 聊天模型模板：

- [ ] 将 `(MODULE_NAME)` 替换为模块名称，例如 Anthropic、OpenAI 等（`command + F` 查找替换很有用）
- [ ] 更新链接以指向正确的模块
- [ ] 在详情和功能表下，更新 ✅/❌ 以反映聊天模型的实际能力
- [ ] 如有需要，更新 PyPi/registry 包名称
- [ ] 如有需要，更新 API 密钥环境变量名称

模板从此行下方开始...

本指南提供了快速入门 (MODULE_NAME) [聊天模型](/oss/python/langchain/models) 的概述。有关 Chat(MODULE_NAME) 所有功能、参数和配置的详细列表，请参阅 [Chat(MODULE_NAME) API 参考](https://python.langchain.com/api_reference/(MODULE_NAME)/chat_models/langchain_(MODULE_NAME).chat_models.Chat(MODULE_NAME).html)。

## 概述

### 详情

| 类 | 包 | 可序列化 | [JS 支持](https://js.langchain.com/docs/integrations/chat/anthropic) | 下载量 | 版本 |
| :--- | :--- | :---: |  :---: | :---: | :---: |
| [Chat(MODULE_NAME)](https://python.langchain.com/api_reference/(MODULE_NAME)/chat_models/langchain_(MODULE_NAME).chat_models.Chat(MODULE_NAME).html) | [langchain-(MODULE_NAME)](https://python.langchain.com/api_reference/anthropic/index.html) | beta/❌ | ✅/❌ | ![PyPI - Downloads](https://img.shields.io/pypi/dm/langchain-(MODULE_NAME)?style=flat-square&label=%20) | ![PyPI - Version](https://img.shields.io/pypi/v/langchain-(MODULE_NAME)?style=flat-square&label=%20) |

### 功能

| [工具调用](/oss/python/langchain/tools) | [结构化输出](/oss/python/langchain/structured-output/) | [图像输入](/oss/python/langchain/messages#multimodal) | [音频输入](/oss/python/langchain/messages#multimodal) | [视频输入](/oss/python/langchain/messages#multimodal) | [Token 级流式传输](/oss/python/langchain/streaming/) | 原生异步 | [Token 使用量](/oss/python/langchain/models#token-usage) | [Logprobs](/oss/python/langchain/models#log-probabilities) |
| :---: | :---: | :---: |  :---: | :---: | :---: | :---: | :---: | :---: |
| ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅❌ |

---

## 设置

要访问 (MODULE_NAME) 模型，您需要创建一个 (MODULE_NAME) 账户，获取 API 密钥，并安装 `langchain-(MODULE_NAME)` 集成包。

### 凭证

```python Set API key icon="key"
import getpass
import os

if "(MODULE_NAME)_API_KEY" not in os.environ:
    os.environ["(MODULE_NAME)_API_KEY"] = getpass.getpass("Enter your (MODULE_NAME) API key: ")
```

要启用模型调用的自动化 <Tooltip tip="记录模型执行的每一步以进行调试和改进">追踪</Tooltip>，请设置您的 [LangSmith](https://docs.langchain.com/langsmith/home) API 密钥：

```python Enable tracing icon="flask"
os.environ["LANGSMITH_API_KEY"] = getpass.getpass("Enter your LangSmith API key: ")
os.environ["LANGSMITH_TRACING"] = "true"
```

### 安装

LangChain (MODULE_NAME) 集成位于 `langchain-(MODULE_NAME)` 包中：

::: code-group

```python [pip]
pip install -U langchain-(MODULE_NAME)
```
```python [uv]
uv add langchain-(MODULE_NAME)
```

:::

---

## 实例化

现在我们可以实例化模型对象并生成响应：

```python Initialize chat model icon="robot"
from langchain_(MODULE_NAME) import Chat(MODULE_NAME)

model = Chat(MODULE_NAME)(
    model="model-name",
    temperature=0,
    timeout=None,
    max_tokens=1024,
    max_retries=2,
    # 其他参数 - 完整列表请参阅 API 参考
)
```

---

## 调用

::: code-group

```python Dictionary format icon="book"
messages = [
    {"role": "system", "content": "You are a poetry expert"},
    {"role": "user", "content": "Write a haiku about spring"},
]
response = model.invoke(messages)
print(response)
```
```python Message objects icon="message"
from langchain.messages import SystemMessage, HumanMessage, AIMessage

messages = [
    SystemMessage("You are a poetry expert"),
    HumanMessage("Write a haiku about spring"),
    AIMessage("Cherry blossoms bloom...")
]
response = model.invoke(messages)
```

:::

```plaintext Response object icon="terminal"
TODO - 替换为 response.model_dump_json(indent=2) 或类似内容
```

```python Text content icon="i-cursor"
print(response.text)

# TODO - 替换为 response.text 的输出
```

```python Content Blocks icon="shapes"
print(response.content_blocks)

# TODO - 替换为 response.content_blocks 的输出
```

<Tip>

关于[聊天模型调用类型](/oss/python/langchain/models#invocation)、[消息类型](/oss/python/langchain/messages#message-types)和[内容块](/oss/python/langchain/messages#standard-content-blocks)的完整指南可供查阅。

</Tip>

## TODO: 此模型特有的任何功能

如果不相关，请删除。

查看现有模型文档以获取示例，例如：

- [ChatAnthropic](/oss/python/integrations/chat/anthropic)
- [ChatOpenAI](/oss/python/integrations/chat/openai)
- [ChatGenAI](/oss/python/integrations/chat/google_generative_ai)

示例：
- <Icon icon="wrench" :size="16"/> 工具调用
- <Icon icon="brain" :size="16"/> 推理输出 / 扩展推理
- <Icon icon="bullhorn" :size="16"/> 详细程度
- <Icon icon="quote-right" :size="16"/> 引用
- <Icon icon="terminal" :size="16"/> 内置工具
    - <Icon icon="clipboard-question" :size="16"/> 网络搜索
    - <Icon icon="code" :size="16"/> 代码执行
    - <Icon icon="rss" :size="16"/> 远程 MCP
- <Icon icon="photo-film" :size="16"/> 多模态输入 / 输出
- <Icon icon="database" :size="16"/> 缓存
- <Icon icon="link" :size="16"/> 链式调用
- <Icon icon="wifi" :size="16"/> 流式传输使用元数据
- <Icon icon="vial" :size="16"/> 微调
- <Icon icon="microchip" :size="16"/> 灵活处理
- <Icon icon="timeline" :size="16"/> 自定义基础 URL 或代理行为

---

## API 参考

有关 Chat(MODULE_NAME) 所有功能和配置的详细文档，请参阅 [API 参考](<LINK>)。
