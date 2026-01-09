---
title: 上下文人工智能
---
Contextual AI 提供专为企业级 AI 应用设计的先进 RAG 组件，旨在实现准确可靠的性能。我们的 LangChain 集成提供了针对我们专业模型的独立 API 端点：

- **基于知识的语言模型**：全球最注重事实依据的语言模型，通过优先考虑检索知识的忠实性来最大限度地减少幻觉。GLM 提供卓越的事实准确性并附带行内引用，使其成为对可靠性要求极高的企业 RAG 和智能体应用的理想选择。

- **指令遵循重排序器**：首个能够遵循自定义指令，根据特定标准（如时效性、来源或文档类型）智能地优先处理文档的重排序器。在行业基准测试中表现优于竞争对手，我们的重排序器解决了企业知识库中信息冲突的挑战。

Contextual AI 由 RAG 技术的发明者创立，其专业组件帮助创新团队加速开发生产就绪的 RAG 智能体，以提供极其准确的响应。

## 基于知识的语言模型

基于知识的语言模型专门设计用于最大限度地减少企业 RAG 和智能体应用中的幻觉。GLM 提供：

- 强大的性能，在 FACTS 基准测试中达到 88% 的事实准确性（[查看基准测试结果](https://venturebeat.com/ai/contextual-ais-new-ai-model-crushes-gpt-4o-in-accuracy-heres-why-it-matters/)）
- 严格基于所提供的知识源并附带行内引用的响应（[阅读产品详情](https://contextual.ai/blog/introducing-grounded-language-model/)）
- 直接集成在生成响应中的精确来源引用
- 优先考虑检索到的上下文而非参数化知识（[查看技术概述](https://contextual.ai/blog/platform-benchmarks-2025/)）
- 当信息不可用时，清晰承认不确定性

GLM 可作为 RAG 流水线中通用 LLM 的直接替代品，显著提高关键任务企业应用的可靠性。

## 指令遵循重排序器

全球首个指令遵循重排序器以前所未有的控制和准确性革新了文档排序。关键能力包括：

- 使用自然语言指令，根据时效性、来源、元数据等对文档进行优先级排序（[了解其工作原理](https://contextual.ai/blog/introducing-instruction-following-reranker/)）
- 在 BEIR 基准测试中表现出色，得分 61.2，显著优于竞争对手（[查看基准数据](https://contextual.ai/blog/platform-benchmarks-2025/)）
- 智能解决来自多个知识源的信息冲突
- 作为现有重排序器的直接替代品无缝集成
- 通过自然语言命令动态控制文档排序

该重排序器擅长处理可能存在矛盾信息的企业知识库，允许您精确指定在各种情况下应优先考虑哪些来源。

## 在 LangChain 中使用 Contextual AI

详情请见[此处](/oss/integrations/chat/contextual)。

此集成使您可以轻松地将 Contextual AI 的 GLM 和指令遵循重排序器纳入您的 LangChain 工作流。GLM 确保您的应用提供严格基于事实的响应，而重排序器则通过智能地优先处理最相关的文档来显著提高检索质量。

无论您是为受监管的行业还是注重安全的环境构建应用，Contextual AI 都能提供您的企业用例所需的准确性、控制和可靠性。

立即开始免费试用，体验面向企业 AI 应用的最注重事实的语言模型和指令遵循重排序器。

### 基于知识的语言模型

```python
# Integrating the Grounded Language Model
import getpass
import os

from langchain_contextual import ChatContextual

# Set credentials
if not os.getenv("CONTEXTUAL_AI_API_KEY"):
    os.environ["CONTEXTUAL_AI_API_KEY"] = getpass.getpass(
        "Enter your Contextual API key: "
    )

# initialize Contextual llm
llm = ChatContextual(
    model="v1",
    api_key="",
)
# include a system prompt (optional)
system_prompt = "You are a helpful assistant that uses all of the provided knowledge to answer the user's query to the best of your ability."

# provide your own knowledge from your knowledge-base here in an array of string
knowledge = [
    "There are 2 types of dogs in the world: good dogs and best dogs.",
    "There are 2 types of cats in the world: good cats and best cats.",
]

# create your message
messages = [
    ("human", "What type of cats are there in the world and what are the types?"),
]

# invoke the GLM by providing the knowledge strings, optional system prompt
# if you want to turn off the GLM's commentary, pass True to the `avoid_commentary` argument
ai_msg = llm.invoke(
    messages, knowledge=knowledge, system_prompt=system_prompt, avoid_commentary=True
)

print(ai_msg.content)
```

```text
According to the information available, there are two types of cats in the world:

1. Good cats
2. Best cats
```

### 指令遵循重排序器

```python
import getpass
import os

from langchain_contextual import ContextualRerank

if not os.getenv("CONTEXTUAL_AI_API_KEY"):
    os.environ["CONTEXTUAL_AI_API_KEY"] = getpass.getpass(
        "Enter your Contextual API key: "
    )

api_key = ""
model = "ctxl-rerank-en-v1-instruct"

compressor = ContextualRerank(
    model=model,
    api_key=api_key,
)

from langchain_core.documents import Document

query = "What is the current enterprise pricing for the RTX 5090 GPU for bulk orders?"
instruction = "Prioritize internal sales documents over market analysis reports. More recent documents should be weighted higher. Enterprise portal content supersedes distributor communications."

document_contents = [
    "Following detailed cost analysis and market research, we have implemented the following changes: AI training clusters will see a 15% uplift in raw compute performance, enterprise support packages are being restructured, and bulk procurement programs (100+ units) for the RTX 5090 Enterprise series will operate on a $2,899 baseline.",
    "Enterprise pricing for the RTX 5090 GPU bulk orders (100+ units) is currently set at $3,100-$3,300 per unit. This pricing for RTX 5090 enterprise bulk orders has been confirmed across all major distribution channels.",
    "RTX 5090 Enterprise GPU requires 450W TDP and 20% cooling overhead.",
]

metadata = [
    {
        "Date": "January 15, 2025",
        "Source": "NVIDIA Enterprise Sales Portal",
        "Classification": "Internal Use Only",
    },
    {"Date": "11/30/2023", "Source": "TechAnalytics Research Group"},
    {
        "Date": "January 25, 2025",
        "Source": "NVIDIA Enterprise Sales Portal",
        "Classification": "Internal Use Only",
    },
]

documents = [
    Document(page_content=content, metadata=metadata[i])
    for i, content in enumerate(document_contents)
]
reranked_documents = compressor.compress_documents(
    query=query,
    instruction=instruction,
    documents=documents,
)
```
