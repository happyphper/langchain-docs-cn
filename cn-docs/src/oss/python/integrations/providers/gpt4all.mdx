---
title: GPT4All
---
本页介绍了如何在 LangChain 中使用 `GPT4All` 包装器。本教程分为两部分：安装与设置，以及使用示例。

## 安装与设置

- 使用 `pip install gpt4all` 安装 Python 包
- 下载一个 [GPT4All 模型](https://gpt4all.io/index.html) 并将其放置在你期望的目录中

在本示例中，我们使用 `mistral-7b-openorca.Q4_0.gguf`：

```bash
mkdir models
wget https://gpt4all.io/models/gguf/mistral-7b-openorca.Q4_0.gguf -O models/mistral-7b-openorca.Q4_0.gguf
```

## 使用

### GPT4All

要使用 GPT4All 包装器，你需要提供预训练模型文件的路径以及模型的配置。

```python
from langchain_community.llms import GPT4All

# 实例化模型。回调函数支持逐令牌流式传输
model = GPT4All(model="./models/mistral-7b-openorca.Q4_0.gguf", n_threads=8)

# 生成文本
response = model.invoke("Once upon a time, ")
```

你也可以自定义生成参数，例如 `n_predict`、`temp`、`top_p`、`top_k` 等。

要流式传输模型的预测结果，请添加一个 CallbackManager。

```python
from langchain_community.llms import GPT4All
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler

# 支持多种 CallbackHandler，例如
# from langchain.callbacks.streamlit import StreamlitCallbackHandler

callbacks = [StreamingStdOutCallbackHandler()]
model = GPT4All(model="./models/mistral-7b-openorca.Q4_0.gguf", n_threads=8)

# 生成文本。令牌通过回调管理器进行流式传输。
model.invoke("Once upon a time, ", callbacks=callbacks)
```

## 模型文件

你可以从 GPT4All 客户端下载模型文件。你可以从 [GPT4All](https://gpt4all.io/index.html) 网站下载客户端。

关于此过程的更详细步骤，请参阅 [此笔记本](/oss/integrations/llms/gpt4all)
