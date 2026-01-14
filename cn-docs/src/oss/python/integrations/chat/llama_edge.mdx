---
title: LlamaEdge
---
[LlamaEdge](https://github.com/second-state/LlamaEdge) 允许你通过本地或聊天服务与 [GGUF](https://github.com/ggerganov/llama.cpp/blob/master/gguf-py/README.md) 格式的大语言模型（LLM）进行对话。

- `LlamaEdgeChatService` 为开发者提供了一个与 OpenAI API 兼容的服务，可以通过 HTTP 请求与 LLM 对话。

- `LlamaEdgeChatLocal` 使开发者能够在本地与 LLM 对话（即将推出）。

`LlamaEdgeChatService` 和 `LlamaEdgeChatLocal` 都运行在由 [WasmEdge Runtime](https://wasmedge.org/) 驱动的基础设施上，该运行时为 LLM 推理任务提供了一个轻量级、可移植的 WebAssembly 容器环境。

## 通过 API 服务进行对话

`LlamaEdgeChatService` 运行在 `llama-api-server` 上。按照 [llama-api-server 快速入门](https://github.com/second-state/llama-utils/tree/main/api-server#readme) 中的步骤，你可以托管自己的 API 服务，从而在任何有网络连接的设备上与任何你喜欢的模型进行对话。

```python
from langchain_community.chat_models.llama_edge import LlamaEdgeChatService
from langchain.messages import HumanMessage, SystemMessage
```

### 以非流式模式与 LLM 对话

```python
# service url
service_url = "https://b008-54-186-154-209.ngrok-free.app"

# create wasm-chat service instance
chat = LlamaEdgeChatService(service_url=service_url)

# create message sequence
system_message = SystemMessage(content="You are an AI assistant")
user_message = HumanMessage(content="What is the capital of France?")
messages = [system_message, user_message]

# chat with wasm-chat service
response = chat.invoke(messages)

print(f"[Bot] {response.content}")
```

```text
[Bot] Hello! The capital of France is Paris.
```

### 以流式模式与 LLM 对话

```python
# service url
service_url = "https://b008-54-186-154-209.ngrok-free.app"

# create wasm-chat service instance
chat = LlamaEdgeChatService(service_url=service_url, streaming=True)

# create message sequence
system_message = SystemMessage(content="You are an AI assistant")
user_message = HumanMessage(content="What is the capital of Norway?")
messages = [
    system_message,
    user_message,
]

output = ""
for chunk in chat.stream(messages):
    # print(chunk.content, end="", flush=True)
    output += chunk.content

print(f"[Bot] {output}")
```

```text
[Bot]   Hello! I'm happy to help you with your question. The capital of Norway is Oslo.
```
