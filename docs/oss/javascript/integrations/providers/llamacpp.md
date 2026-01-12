---
title: Llama.cpp
---
>[llama.cpp python](https://github.com/abetlen/llama-cpp-python) 库是 `@ggerganov` 的 [llama.cpp](https://github.com/ggerganov/llama.cpp) 的一个简单 Python 绑定。

此包提供：

- 通过 ctypes 接口对 C API 的低级访问。
- 用于文本补全的高级 Python API
  - 类 `OpenAI` 的 API
  - `LangChain` 兼容性
  - `LlamaIndex` 兼容性
- OpenAI 兼容的 Web 服务器
  - 本地 Copilot 替代方案
  - 函数调用支持
  - 视觉 API 支持
  - 多模型支持

## 安装与设置

- 安装 Python 包
```bash
pip install llama-cpp-python
```
- 下载一个[支持的模型](https://github.com/ggerganov/llama.cpp#description)，并按照[说明](https://github.com/ggerganov/llama.cpp)将其转换为 llama.cpp 格式。

## 聊天模型

查看[使用示例](/oss/javascript/integrations/chat/llamacpp)。

```python
from langchain_community.chat_models import ChatLlamaCpp
```

## 大语言模型

```python
from langchain_community.llms import LlamaCpp
```

## 嵌入模型

查看[使用示例](/oss/javascript/integrations/text_embedding/llamacpp)。

```python
from langchain_community.embeddings import LlamaCppEmbeddings
```
