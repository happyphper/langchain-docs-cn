---
title: Predibase
---
[Predibase](https://predibase.com/) 允许您训练、微调和部署任何机器学习模型——从线性回归到大型语言模型。

本示例演示了如何将 LangChain 与部署在 Predibase 上的模型结合使用。

# 设置

要运行此笔记本，您需要一个 [Predibase 账户](https://predibase.com/free-trial/?utm_source=langchain) 和一个 [API 密钥](https://docs.predibase.com/sdk-guide/intro)。

您还需要安装 Predibase Python 包：

```python
pip install -qU  predibase
import os

os.environ["PREDIBASE_API_TOKEN"] = "{PREDIBASE_API_TOKEN}"
```

## 初始调用

```python
from langchain_community.llms import Predibase

model = Predibase(
    model="mistral-7b",
    predibase_api_key=os.environ.get("PREDIBASE_API_TOKEN"),
)
```

```python
from langchain_community.llms import Predibase

# 使用托管在 Predibase 的微调适配器（必须指定 adapter_version）。
model = Predibase(
    model="mistral-7b",
    predibase_api_key=os.environ.get("PREDIBASE_API_TOKEN"),
    predibase_sdk_version=None,  # 可选参数（如果省略，默认为最新的 Predibase SDK 版本）
    adapter_id="e2e_nlg",
    adapter_version=1,
    **{
        "api_token": os.environ.get("HUGGING_FACE_HUB_TOKEN"),
        "max_new_tokens": 5,  # 默认值为 256
    },
)
```

```python
from langchain_community.llms import Predibase

# 使用托管在 HuggingFace 的微调适配器（adapter_version 不适用且将被忽略）。
model = Predibase(
    model="mistral-7b",
    predibase_api_key=os.environ.get("PREDIBASE_API_TOKEN"),
    predibase_sdk_version=None,  # 可选参数（如果省略，默认为最新的 Predibase SDK 版本）
    adapter_id="predibase/e2e_nlg",
    **{
        "api_token": os.environ.get("HUGGING_FACE_HUB_TOKEN"),
        "max_new_tokens": 5,  # 默认值为 256
    },
)
```

```python
# 可选地使用 `kwargs` 来动态覆盖 "generate()" 的设置。
response = model.invoke(
    "Can you recommend me a nice dry wine?",
    **{"temperature": 0.5, "max_new_tokens": 1024},
)
print(response)
```

## 链式调用设置

```python
from langchain_community.llms import Predibase

model = Predibase(
    model="mistral-7b",
    predibase_api_key=os.environ.get("PREDIBASE_API_TOKEN"),
    predibase_sdk_version=None,  # 可选参数（如果省略，默认为最新的 Predibase SDK 版本）
    **{
        "api_token": os.environ.get("HUGGING_FACE_HUB_TOKEN"),
        "max_new_tokens": 5,  # 默认值为 256
    },
)
```

```python
# 使用托管在 Predibase 的微调适配器（必须指定 adapter_version）。
model = Predibase(
    model="mistral-7b",
    predibase_api_key=os.environ.get("PREDIBASE_API_TOKEN"),
    predibase_sdk_version=None,  # 可选参数（如果省略，默认为最新的 Predibase SDK 版本）
    adapter_id="e2e_nlg",
    adapter_version=1,
    **{
        "api_token": os.environ.get("HUGGING_FACE_HUB_TOKEN"),
        "max_new_tokens": 5,  # 默认值为 256
    },
)
```

```python
# 使用托管在 HuggingFace 的微调适配器（adapter_version 不适用且将被忽略）。
llm = Predibase(
    model="mistral-7b",
    predibase_api_key=os.environ.get("PREDIBASE_API_TOKEN"),
    predibase_sdk_version=None,  # 可选参数（如果省略，默认为最新的 Predibase SDK 版本）
    adapter_id="predibase/e2e_nlg",
    **{
        "api_token": os.environ.get("HUGGING_FACE_HUB_TOKEN"),
        "max_new_tokens": 5,  # 默认值为 256
    },
)
```

## 顺序链 (SequentialChain)

```python
from langchain_classic.chains import LLMChain
from langchain_core.prompts import PromptTemplate
```

```python
# 这是一个 LLMChain，用于根据剧本标题撰写剧情简介。
template = """You are a playwright. Given the title of play, it is your job to write a synopsis for that title.

Title: {title}
Playwright: This is a synopsis for the above play:"""
prompt_template = PromptTemplate(input_variables=["title"], template=template)
synopsis_chain = LLMChain(llm=llm, prompt=prompt_template)
```

```python
# 这是一个 LLMChain，用于根据剧本剧情简介撰写评论。
template = """You are a play critic from the New York Times. Given the synopsis of play, it is your job to write a review for that play.

Play Synopsis:
{synopsis}
Review from a New York Times play critic of the above play:"""
prompt_template = PromptTemplate(input_variables=["synopsis"], template=template)
review_chain = LLMChain(llm=llm, prompt=prompt_template)
```

```python
# 这是整体链，我们按顺序运行这两个链。
from langchain_classic.chains import SimpleSequentialChain

overall_chain = SimpleSequentialChain(
    chains=[synopsis_chain, review_chain], verbose=True
)
```

```python
review = overall_chain.run("Tragedy at sunset on the beach")
```

## 微调后的 LLM（使用您在 Predibase 上自己的微调 LLM）

```python
from langchain_community.llms import Predibase

model = Predibase(
    model="my-base-LLM",
    predibase_api_key=os.environ.get(
        "PREDIBASE_API_TOKEN"
    ),  # Adapter 参数是可选的。
    predibase_sdk_version=None,  # 可选参数（如果省略，默认为最新的 Predibase SDK 版本）
    adapter_id="my-finetuned-adapter-id",  # 同时支持 Predibase 托管和 HuggingFace 托管的适配器仓库。
    adapter_version=1,  # Predibase 托管的适配器必需（对于 HuggingFace 托管的适配器会被忽略）
    **{
        "api_token": os.environ.get("HUGGING_FACE_HUB_TOKEN"),
        "max_new_tokens": 5,  # 默认值为 256
    },
)
# 将 my-base-LLM 替换为您在 Predibase 中选择的无服务器基础模型的名称
```

```python
# 可选地使用 `kwargs` 来动态覆盖 "generate()" 的设置。
# response = model.invoke("Can you help categorize the following emails into positive, negative, and neutral?", **{"temperature": 0.5, "max_new_tokens": 1024})
```
