---
title: Diffbot
---
>[Diffbot](https://docs.diffbot.com/docs/getting-started-with-diffbot) 是一套基于机器学习的产品，旨在简化网页数据的结构化处理。

>Diffbot 的 [Extract API](https://docs.diffbot.com/reference/extract-introduction) 是一项服务，用于对网页数据进行结构化和规范化。

>与传统的网页抓取工具不同，`Diffbot Extract` 无需任何规则即可读取页面内容。它使用计算机视觉模型将页面分类为 20 种可能的类型之一，然后将原始 HTML 标记转换为 JSON。生成的结构化 JSON 遵循一致的 [基于类型的本体论](https://docs.diffbot.com/docs/ontology)，这使得使用相同的模式从多个不同的网络源提取数据变得容易。

[![在 Colab 中打开](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/v0.3/docs/docs/integrations/document_loaders/diffbot.ipynb)

## 概述

本指南介绍如何使用 [Diffbot Extract API](https://www.diffbot.com/products/extract/) 从 URL 列表中提取数据，并将其转换为可用于下游处理的结构化 JSON。

## 设置

首先安装所需的包。

```python
pip install -qU langchain-community
```

Diffbot 的 Extract API 需要一个 API 令牌。请按照以下说明 [获取免费 API 令牌](/oss/javascript/integrations/providers/diffbot#installation-and-setup)，然后设置一个环境变量。

```python
%env DIFFBOT_API_TOKEN REPLACE_WITH_YOUR_TOKEN
```

## 使用文档加载器

导入 DiffbotLoader 模块，并使用 URL 列表和您的 Diffbot 令牌实例化它。

```python
import os

from langchain_community.document_loaders import DiffbotLoader

urls = [
    "https://python.langchain.com/",
]

loader = DiffbotLoader(urls=urls, api_token=os.environ.get("DIFFBOT_API_TOKEN"))
```

使用 `.load()` 方法，您可以查看加载的文档。

```python
loader.load()
```

```python
[Document(page_content="LangChain is a framework for developing applications powered by large language models (LLMs).\nLangChain simplifies every stage of the LLM application lifecycle:\nDevelopment: Build your applications using LangChain's open-source building blocks and components. Hit the ground running using third-party integrations and Templates.\nProductionization: Use LangSmith to inspect, monitor and evaluate your chains, so that you can continuously optimize and deploy with confidence.\nDeployment: Turn any chain into an API with LangServe.\nlangchain-core: Base abstractions and LangChain Expression Language.\nlangchain-community: Third party integrations.\nPartner packages (e.g. langchain-openai, langchain-anthropic, etc.): Some integrations have been further split into their own lightweight packages that only depend on langchain-core.\nlangchain: Chains, agents, and retrieval strategies that make up an application's cognitive architecture.\nlanggraph: Build robust and stateful multi-actor applications with LLMs by modeling steps as edges and nodes in a graph.\nlangserve: Deploy LangChain chains as REST APIs.\nThe broader ecosystem includes:\nLangSmith: A developer platform that lets you debug, test, evaluate, and monitor LLM applications and seamlessly integrates with LangChain.\nGet started\nWe recommend following our Quickstart guide to familiarize yourself with the framework by building your first LangChain application.\nSee here for instructions on how to install LangChain, set up your environment, and start building.\nnote\nThese docs focus on the Python LangChain library. Head here for docs on the JavaScript LangChain library.\nUse cases\nIf you're looking to build something specific or are more of a hands-on learner, check out our use-cases. They're walkthroughs and techniques for common end-to-end tasks, such as:\nQuestion answering with RAG\nExtracting structured output\nChatbots\nand more!\nExpression Language\nLangChain Expression Language (LCEL) is the foundation of many of LangChain's components, and is a declarative way to compose chains. LCEL was designed from day 1 to support putting prototypes in production, with no code changes, from the simplest “prompt + LLM” chain to the most complex chains.\nGet started: LCEL and its benefits\nRunnable interface: The standard interface for LCEL objects\nPrimitives: More on the primitives LCEL includes\nand more!\nEcosystem\n🦜🛠️ LangSmith\nTrace and evaluate your language model applications and intelligent agents to help you move from prototype to production.\n🦜🕸️ LangGraph\nBuild stateful, multi-actor applications with LLMs, built on top of (and intended to be used with) LangChain primitives.\n🦜🏓 LangServe\nDeploy LangChain runnables and chains as REST APIs.\nSecurity\nRead up on our Security best practices to make sure you're developing safely with LangChain.\nAdditional resources\nComponents\nLangChain provides standard, extendable interfaces and integrations for many different components, including:\nIntegrations\nLangChain is part of a rich ecosystem of tools that integrate with our framework and build on top of it. Check out our growing list of integrations.\nGuides\nBest practices for developing with LangChain.\nAPI reference\nHead to the reference section for full documentation of all classes and methods in the LangChain and LangChain Experimental Python packages.\nContributing\nCheck out the developer's guide for guidelines on contributing and help getting your dev environment set up.\nHelp us out by providing feedback on this documentation page:", metadata={'source': 'https://python.langchain.com/'})]
```

## 将提取的文本转换为图文档

结构化的页面内容可以通过 `DiffbotGraphTransformer` 进一步处理，以将实体和关系提取到图中。

```python
pip install -qU langchain-experimental
```

```python
from langchain_experimental.graph_transformers.diffbot import DiffbotGraphTransformer

diffbot_nlp = DiffbotGraphTransformer(
    diffbot_api_key=os.environ.get("DIFFBOT_API_TOKEN")
)
graph_documents = diffbot_nlp.convert_to_graph_documents(loader.load())
```

要继续将数据加载到知识图谱中，请遵循 [`DiffbotGraphTransformer` 指南](/oss/javascript/integrations/graphs/diffbot/#loading-the-data-into-a-knowledge-graph)。
