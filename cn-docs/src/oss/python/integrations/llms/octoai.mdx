---
title: OctoAI
---
[OctoAI](https://docs.octoai.cloud/docs) 提供便捷的高效计算访问，使用户能够将他们选择的 AI 模型集成到应用程序中。`OctoAI` 计算服务帮助您轻松地运行、调优和扩展 AI 应用程序。

本示例将介绍如何使用 LangChain 与 `OctoAI` 的 [LLM 端点](https://octoai.cloud/templates) 进行交互。

## 设置

要运行我们的示例应用程序，只需两个简单的步骤：

1.  从 [您的 OctoAI 账户页面](https://octoai.cloud/settings) 获取一个 API 令牌。

2.  将您的 API 密钥粘贴到下面的代码单元格中。

注意：如果您想使用不同的 LLM 模型，可以按照 [从 Python 构建容器](https://octo.ai/docs/bring-your-own-model/advanced-build-a-container-from-scratch-in-python) 和 [从容器创建自定义端点](https://octo.ai/docs/bring-your-own-model/create-custom-endpoints-from-a-container/create-custom-endpoints-from-a-container) 的说明，将模型容器化并自行创建自定义的 OctoAI 端点，然后更新您的 `OCTOAI_API_BASE` 环境变量。

```python
import os

os.environ["OCTOAI_API_TOKEN"] = "OCTOAI_API_TOKEN"
```

```python
from langchain_classic.chains import LLMChain
from langchain_community.llms.octoai_endpoint import OctoAIEndpoint
from langchain_core.prompts import PromptTemplate
```

## 示例

```python
template = """Below is an instruction that describes a task. Write a response that appropriately completes the request.\n Instruction:\n{question}\n Response: """
prompt = PromptTemplate.from_template(template)
```

```python
llm = OctoAIEndpoint(
    model_name="llama-2-13b-chat-fp16",
    max_tokens=200,
    presence_penalty=0,
    temperature=0.1,
    top_p=0.9,
)
```

```python
question = "Who was Leonardo da Vinci?"

chain = prompt | llm

print(chain.invoke(question))
```

莱昂纳多·达·芬奇是一位真正的文艺复兴巨匠。他于 1452 年出生在意大利的芬奇，以其在艺术、科学、工程和数学等多个领域的成就而闻名。他被认为是有史以来最伟大的画家之一，他最著名的作品包括《蒙娜丽莎》和《最后的晚餐》。除了艺术之外，达·芬奇在工程学和解剖学方面也做出了重大贡献，他的机器和发明设计领先于他所处的时代数个世纪。他还以其大量的日记和绘画而闻名，这些资料为了解他的思想和想法提供了宝贵的见解。达·芬奇的遗产至今仍在激励和影响着世界各地的艺术家、科学家和思想家。
