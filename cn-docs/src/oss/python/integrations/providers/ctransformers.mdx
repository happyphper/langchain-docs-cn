---
title: C Transformers
---
本页介绍如何在 LangChain 中使用 [C Transformers](https://github.com/marella/ctransformers) 库。
内容分为两部分：安装与设置，以及特定 C Transformers 封装器的参考信息。

## 安装与设置

- 使用 `pip install ctransformers` 安装 Python 包
- 下载支持的 [GGML 模型](https://huggingface.co/TheBloke)（参见[支持的模型](https://github.com/marella/ctransformers#supported-models)）

## 封装器

### LLM

CTransformers 提供了一个 LLM 封装器，可通过以下方式导入：

```python
from langchain_community.llms import CTransformers
```

它为所有模型提供了统一的接口：

```python
llm = CTransformers(model='/path/to/ggml-gpt-2.bin', model_type='gpt2')

print(llm.invoke('AI is going to'))
```

如果遇到 `illegal instruction` 错误，请尝试使用 `lib='avx'` 或 `lib='basic'`：

```py
llm = CTransformers(model='/path/to/ggml-gpt-2.bin', model_type='gpt2', lib='avx')
```

它可以与托管在 Hugging Face Hub 上的模型一起使用：

```py
llm = CTransformers(model='marella/gpt-2-ggml')
```

如果模型仓库有多个模型文件（`.bin` 文件），请使用以下方式指定模型文件：

```py
llm = CTransformers(model='marella/gpt-2-ggml', model_file='ggml-model.bin')
```

可以通过 `config` 参数传递其他参数：

```py
config = {'max_new_tokens': 256, 'repetition_penalty': 1.1}

llm = CTransformers(model='marella/gpt-2-ggml', config=config)
```

有关可用参数的列表，请参阅[文档](https://github.com/marella/ctransformers#config)。

更详细的步骤说明，请参见[此笔记本](/oss/integrations/llms/ctransformers)。
