---
title: OpenLM
---
[OpenLM](https://github.com/r2d4/openlm) 是一个零依赖、兼容 OpenAI 的 LLM 提供商，可以直接通过 HTTP 调用不同的推理端点。

它实现了 OpenAI 的 Completion 类，因此可以作为 OpenAI API 的直接替代品使用。本次变更利用了 BaseOpenAI，以添加最少的代码。

本示例将介绍如何使用 LangChain 与 OpenAI 和 HuggingFace 进行交互。您需要两者的 API 密钥。

### 设置

安装依赖项并设置 API 密钥。

```python
# 如果尚未安装 openlm 和 openai，请取消注释

pip install -qU  openlm
pip install -qU  langchain-openai
```

```python
import os
from getpass import getpass

# 检查是否设置了 OPENAI_API_KEY 环境变量
if "OPENAI_API_KEY" not in os.environ:
    print("Enter your OpenAI API key:")
    os.environ["OPENAI_API_KEY"] = getpass()

# 检查是否设置了 HF_API_TOKEN 环境变量
if "HF_API_TOKEN" not in os.environ:
    print("Enter your HuggingFace Hub API key:")
    os.environ["HF_API_TOKEN"] = getpass()
```

### 将 LangChain 与 OpenLM 结合使用

这里我们将在 LLMChain 中调用两个模型：来自 OpenAI 的 `text-davinci-003` 和来自 HuggingFace 的 `gpt2`。

```python
from langchain_classic.chains import LLMChain
from langchain_community.llms import OpenLM
from langchain_core.prompts import PromptTemplate
```

```python
question = "What is the capital of France?"
template = """Question: {question}

Answer: Let's think step by step."""

prompt = PromptTemplate.from_template(template)

for model in ["text-davinci-003", "huggingface.co/gpt2"]:
    llm = OpenLM(model=model)
    llm_chain = LLMChain(prompt=prompt, llm=llm)
    result = llm_chain.run(question)
    print(
        """Model: {}
Result: {}""".format(model, result)
    )
```

```text
Model: text-davinci-003
Result:  France is a country in Europe. The capital of France is Paris.
Model: huggingface.co/gpt2
Result: Question: What is the capital of France?

Answer: Let's think step by step. I am not going to lie, this is a complicated issue, and I don't see any solutions to all this, but it is still far more
```
