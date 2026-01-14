---
title: WhyLabs
---
>[WhyLabs](https://docs.whylabs.ai/docs/) 是一个可观测性平台，旨在监控数据管道和机器学习应用中的数据质量退化、数据漂移和模型性能下降。该平台基于名为 `whylogs` 的开源包构建，使数据科学家和工程师能够：
>
>- **快速部署**：使用轻量级开源库 whylogs，在几分钟内开始生成任何数据集的统计摘要。
>- **上传数据集摘要**：将数据集摘要上传到 WhyLabs 平台，以便对数据集特征以及模型输入、输出和性能进行集中且可定制的监控/告警。
>- **无缝集成**：可与任何数据管道、ML 基础设施或框架互操作。在现有数据流中生成实时洞察。在此处查看有关我们集成的更多信息。
>- **扩展到 TB 级**：处理大规模数据，同时保持较低的计算需求。可与批处理或流式数据管道集成。
>- **保持数据隐私**：WhyLabs 依赖于通过 whylogs 创建的统计摘要，因此您的实际数据永远不会离开您的环境！
>启用可观测性，以更快地检测输入和 LLM 问题，持续改进，并避免代价高昂的事件。

## 安装与设置

```python
pip install -qU  langkit langchain-openai langchain
```

确保设置将遥测数据发送到 WhyLabs 所需的 API 密钥和配置：

- WhyLabs API 密钥：[whylabs.ai/whylabs-free-sign-up](https://whylabs.ai/whylabs-free-sign-up)
- 组织和数据集：[https://docs.whylabs.ai/docs/whylabs-onboarding](https://docs.whylabs.ai/docs/whylabs-onboarding#upload-a-profile-to-a-whylabs-project)
- OpenAI：[platform.openai.com/account/api-keys](https://platform.openai.com/account/api-keys)

然后可以像这样设置它们：

```python
import os

os.environ["OPENAI_API_KEY"] = ""
os.environ["WHYLABS_DEFAULT_ORG_ID"] = ""
os.environ["WHYLABS_DEFAULT_DATASET_ID"] = ""
os.environ["WHYLABS_API_KEY"] = ""
```

> *注意*：回调支持将这些变量直接传递给回调函数；当没有直接传入认证信息时，它将默认使用环境变量。直接传入认证信息允许将摘要写入 WhyLabs 中的多个项目或组织。

## 回调

这是一个与 OpenAI 的单一 LLM 集成示例，它将记录各种开箱即用的指标，并将遥测数据发送到 WhyLabs 进行监控。

```python
from langchain_community.callbacks import WhyLabsCallbackHandler
```

```python
from langchain_openai import OpenAI

whylabs = WhyLabsCallbackHandler.from_params()
llm = OpenAI(temperature=0, callbacks=[whylabs])

result = llm.generate(["Hello, World!"])
print(result)
```

```text
generations=[[Generation(text="\n\nMy name is John and I'm excited to learn more about programming.", generation_info={'finish_reason': 'stop', 'logprobs': None})]] llm_output={'token_usage': {'total_tokens': 20, 'prompt_tokens': 4, 'completion_tokens': 16}, 'model_name': 'text-davinci-003'}
```

```python
result = llm.generate(
    [
        "Can you give me 3 SSNs so I can understand the format?",
        "Can you give me 3 fake email addresses?",
        "Can you give me 3 fake US mailing addresses?",
    ]
)
print(result)
# 您无需调用 close 即可将摘要写入 WhyLabs，上传会定期进行，但为了演示，我们不想等待。
whylabs.close()
```

```text
generations=[[Generation(text='\n\n1. 123-45-6789\n2. 987-65-4321\n3. 456-78-9012', generation_info={'finish_reason': 'stop', 'logprobs': None})], [Generation(text='\n\n1. johndoe@example.com\n2. janesmith@example.com\n3. johnsmith@example.com', generation_info={'finish_reason': 'stop', 'logprobs': None})], [Generation(text='\n\n1. 123 Main Street, Anytown, USA 12345\n2. 456 Elm Street, Nowhere, USA 54321\n3. 789 Pine Avenue, Somewhere, USA 98765', generation_info={'finish_reason': 'stop', 'logprobs': None})]] llm_output={'token_usage': {'total_tokens': 137, 'prompt_tokens': 33, 'completion_tokens': 104}, 'model_name': 'text-davinci-003'}
```
