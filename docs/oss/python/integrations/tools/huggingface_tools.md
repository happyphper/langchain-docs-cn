---
title: HuggingFace Hub 工具
---
>[Huggingface Tools](https://huggingface.co/docs/transformers/v4.29.0/en/custom_tools) 支持文本输入/输出的工具可以直接使用 `load_huggingface_tool` 函数加载。

```python
# 需要 transformers>=4.29.0 和 huggingface_hub>=0.14.1
pip install -qU  transformers huggingface_hub > /dev/null
```

```python
pip install -qU  langchain-community
```

```python
from langchain_community.agent_toolkits.load_tools import load_huggingface_tool

tool = load_huggingface_tool("lysandre/hf-model-downloads")

print(f"{tool.name}: {tool.description}")
```

```text
model_download_counter: This is a tool that returns the most downloaded model of a given task on the Hugging Face Hub. It takes the name of the category (such as text-classification, depth-estimation, etc), and returns the name of the checkpoint
```

```python
tool.run("text-classification")
```

```text
'facebook/bart-large-mnli'
```

```python

```
