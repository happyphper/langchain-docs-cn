---
title: DeepSparse
---
本页介绍如何在 LangChain 中使用 [DeepSparse](https://github.com/neuralmagic/deepsparse) 推理运行时。
内容分为两部分：安装与设置，以及 DeepSparse 的使用示例。

## 安装与设置

- 使用 `pip install deepsparse` 安装 Python 包
- 选择一个 [SparseZoo 模型](https://sparsezoo.neuralmagic.com/?useCase=text_generation)，或使用 Optimum 将支持的模型导出为 ONNX 格式 [参考此教程](https://github.com/neuralmagic/notebooks/blob/main/notebooks/opt-text-generation-deepsparse-quickstart/OPT_Text_Generation_DeepSparse_Quickstart.ipynb)

DeepSparse 提供了一个统一的 LLM 封装器，适用于所有模型：

```python
from langchain_community.llms import DeepSparse

llm = DeepSparse(
    model="zoo:nlg/text_generation/codegen_mono-350m/pytorch/huggingface/bigpython_bigquery_thepile/base-none"
)

print(llm.invoke("def fib():"))
```

可以通过 `config` 参数传递额外的配置：

```python
config = {"max_generated_tokens": 256}

llm = DeepSparse(
    model="zoo:nlg/text_generation/codegen_mono-350m/pytorch/huggingface/bigpython_bigquery_thepile/base-none",
    config=config,
)
```
