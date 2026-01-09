---
title: MosaicML
---
[MosaicML](https://docs.mosaicml.com/en/latest/inference.html) 提供了一个托管的推理服务。您既可以使用各种开源模型，也可以部署自己的模型。

本示例将介绍如何使用 LangChain 与 MosaicML Inference 进行文本补全交互。

```python
# 注册账户：https://forms.mosaicml.com/demo?utm_source=langchain

from getpass import getpass

MOSAICML_API_TOKEN = getpass()
```

```python
import os

os.environ["MOSAICML_API_TOKEN"] = MOSAICML_API_TOKEN
```

```python
from langchain_classic.chains import LLMChain
from langchain_community.llms import MosaicML
from langchain_core.prompts import PromptTemplate
```

```python
template = """Question: {question}"""

prompt = PromptTemplate.from_template(template)
```

```python
llm = MosaicML(inject_instruction_format=True, model_kwargs={"max_new_tokens": 128})
```

```python
llm_chain = LLMChain(prompt=prompt, llm=llm)
```

```python
question = "What is one good reason why you should train a large language model on domain specific data?"

llm_chain.run(question)
```
