---
title: 阿里云 PAI EAS
---
>[阿里云机器学习平台（PAI）](https://www.alibabacloud.com/help/en/pai) 是一个面向企业和开发者的机器学习或深度学习工程平台。它提供易用、经济高效、高性能且易于扩展的插件，可应用于各种行业场景。`机器学习平台（PAI）`内置超过 140 种优化算法，提供全流程的 AI 工程能力，包括数据标注（`PAI-iTAG`）、模型构建（`PAI-Designer` 和 `PAI-DSW`）、模型训练（`PAI-DLC`）、编译优化以及推理部署（`PAI-EAS`）。`PAI-EAS` 支持不同类型的硬件资源，包括 CPU 和 GPU，并具备高吞吐、低延迟的特点。它允许您通过几次点击即可部署大规模复杂模型，并实时进行弹性扩缩容。它还提供全面的运维和监控系统。

```python
## 安装使用该集成所需的 langchain 包
pip install -qU langchain-community
```

```python
from langchain_classic.chains import LLMChain
from langchain_community.llms.pai_eas_endpoint import PaiEasEndpoint
from langchain_core.prompts import PromptTemplate

template = """Question: {question}

Answer: Let's think step by step."""

prompt = PromptTemplate.from_template(template)
```

想要使用 EAS LLMs 的用户必须先设置 EAS 服务。当 EAS 服务启动后，即可获取 `EAS_SERVICE_URL` 和 `EAS_SERVICE_TOKEN`。用户可以参阅 [www.alibabacloud.com/help/en/pai/user-guide/service-deployment/](https://www.alibabacloud.com/help/en/pai/user-guide/service-deployment/) 了解更多信息。

```python
import os

os.environ["EAS_SERVICE_URL"] = "Your_EAS_Service_URL"
os.environ["EAS_SERVICE_TOKEN"] = "Your_EAS_Service_Token"
llm = PaiEasEndpoint(
    eas_service_url=os.environ["EAS_SERVICE_URL"],
    eas_service_token=os.environ["EAS_SERVICE_TOKEN"],
)
```

```python
llm_chain = prompt | llm

question = "What NFL team won the Super Bowl in the year Justin Beiber was born?"
llm_chain.invoke({"question": question})
```

```text
'  Thank you for asking! However, I must respectfully point out that the question contains an error. Justin Bieber was born in 1994, and the Super Bowl was first played in 1967. Therefore, it is not possible for any NFL team to have won the Super Bowl in the year Justin Bieber was born.\n\nI hope this clarifies things! If you have any other questions, please feel free to ask.'
```
