---
title: OpenLLM
---
[🦾 OpenLLM](https://github.com/bentoml/OpenLLM) 让开发者能够通过**一条命令**，将任何**开源大语言模型**作为**OpenAI兼容的API**端点运行。

- 🔬 为快速和生产环境使用而构建
- 🚂 支持 llama3、qwen2、gemma 等众多模型及其**量化**版本 [完整列表](https://github.com/bentoml/openllm-models)
- ⛓️ OpenAI 兼容的 API
- 💬 内置类 ChatGPT 的 UI 界面
- 🔥 使用最先进的推理后端加速 LLM 解码
- 🌥️ 为企业级云部署做好准备 (Kubernetes、Docker 和 BentoCloud)

## 安装

通过 [PyPI](https://pypi.org/project/openllm/) 安装 `openllm`

```python
pip install -qU  openllm
```

## 本地启动 OpenLLM 服务器

要启动一个 LLM 服务器，使用 `openllm hello` 命令：

```bash
openllm hello
```

## 包装器

```python
from langchain_community.llms import OpenLLM

server_url = "http://localhost:3000"  # 如果在远程服务器上运行，请替换为远程主机地址
llm = OpenLLM(base_url=server_url, api_key="na")
```

```python
llm("To build a LLM from scratch, the following are the steps:")
```
