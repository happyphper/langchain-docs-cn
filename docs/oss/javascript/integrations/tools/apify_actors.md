---
title: Apify Actor
---
>[Apify Actors](https://docs.apify.com/platform/actors) 是专为广泛的网络抓取、爬虫和数据提取任务而设计的云程序。这些 Actor 能够自动化地从网络收集数据，使用户能够高效地提取、处理和存储信息。Actor 可用于执行诸如抓取电子商务网站获取产品详情、监控价格变化或收集搜索引擎结果等任务。它们与 [Apify Datasets](https://docs.apify.com/platform/storage/dataset) 无缝集成，允许将 Actor 收集的结构化数据以 JSON、CSV 或 Excel 等格式存储、管理和导出，以供进一步分析或使用。

## 概述

本笔记本将引导您使用 [Apify Actors](https://docs.apify.com/platform/actors) 与 LangChain 来自动化网络抓取和数据提取。`langchain-apify` 包将 Apify 的基于云的工具与 LangChain 智能体集成，为 AI 应用实现高效的数据收集和处理。

## 设置

此集成位于 [langchain-apify](https://pypi.org/project/langchain-apify/) 包中。可以使用 pip 安装该包。

```python
pip install langchain-apify
```

### 前提条件

- **Apify 账户**：在此处注册您的免费 Apify 账户 [here](https://console.apify.com/sign-up)。
- **Apify API 令牌**：了解如何在 [Apify 文档](https://docs.apify.com/platform/integrations/api) 中获取您的 API 令牌。

```python
import os

os.environ["APIFY_API_TOKEN"] = "your-apify-api-token"
os.environ["OPENAI_API_KEY"] = "your-openai-api-key"
```

## 实例化

这里我们实例化 `ApifyActorsTool`，以便能够调用 [RAG Web Browser](https://apify.com/apify/rag-web-browser) Apify Actor。此 Actor 为 AI 和 LLM 应用程序提供网络浏览功能，类似于 ChatGPT 中的网络浏览功能。[Apify Store](https://apify.com/store) 中的任何 Actor 都可以通过这种方式使用。

```python
from langchain_apify import ApifyActorsTool

tool = ApifyActorsTool("apify/rag-web-browser")
```

## 调用

`ApifyActorsTool` 接受一个参数，即 `run_input` - 一个作为运行输入传递给 Actor 的字典。运行输入模式的文档可以在 Actor 详情页面的输入部分找到。请参阅 [RAG Web Browser 输入模式](https://apify.com/apify/rag-web-browser/input-schema)。

```python
tool.invoke({"run_input": {"query": "what is apify?", "maxResults": 2}})
```

## 链式调用

我们可以将创建的工具提供给一个 [智能体](https://python.langchain.com/docs/tutorials/agents/)。当被要求搜索信息时，智能体将调用 Apify Actor，该 Actor 将搜索网络，然后检索搜索结果。

```python
pip install langgraph langchain-openai
```

```python
from langchain.messages import ToolMessage
from langchain_openai import ChatOpenAI
from langchain.agents import create_agent

model = ChatOpenAI(model="gpt-4o")
tools = [tool]
graph = create_agent(model, tools=tools)
```

```python
inputs = {"messages": [("user", "search for what is Apify")]}
for s in graph.stream(inputs, stream_mode="values"):
    message = s["messages"][-1]
    # 跳过工具消息
    if isinstance(message, ToolMessage):
        continue
    message.pretty_print()
```

```text
================================ Human Message =================================

search for what is Apify
================================== Ai Message ==================================
Tool Calls:
  apify_actor_apify_rag-web-browser (call_27mjHLzDzwa5ZaHWCMH510lm)
 Call ID: call_27mjHLzDzwa5ZaHWCMH510lm
  Args:
    run_input: {"run_input":{"query":"Apify","maxResults":3,"outputFormats":["markdown"]}}
================================== Ai Message ==================================

Apify 是一个用于网络抓取、浏览器自动化和数据提取的综合平台。它提供了一系列广泛的工具和服务，满足开发者和企业高效、有效地从网站提取数据的需求。以下是 Apify 的概述：

1. **生态系统和工具**：
   - Apify 提供了一个生态系统，开发者可以在其中构建、部署和发布称为 Actor 的数据提取和网络自动化工具。
   - 该平台支持各种用例，例如从社交媒体平台提取数据、执行基于浏览器的自动化任务等。

2. **产品与服务**：
   - Apify 提供超过 3,000 个现成的抓取工具和代码模板。
   - 用户还可以构建自定义解决方案，或聘请 Apify 的专业服务来满足更定制化的数据提取需求。

3. **技术与集成**：
   - 该平台支持与 Zapier、GitHub、Google Sheets、Pinecone 等流行工具和服务的集成。
   - Apify 支持开源工具和技术，如 JavaScript、Python、Puppeteer、Playwright、Selenium 以及其自己的用于网络爬虫和浏览器自动化的 Crawlee 库。

4. **社区与学习**：
   - Apify 在 Discord 上托管了一个社区，开发者可以在其中获得帮助并分享专业知识。
   - 它通过 Web Scraping Academy 提供教育资源，帮助用户精通数据抓取和自动化。

5. **企业解决方案**：
   - Apify 提供企业级网络数据提取解决方案，具有高可靠性、99.95% 的正常运行时间，并符合 SOC2、GDPR 和 CCPA 标准。

欲了解更多信息，您可以访问 [Apify 官方网站](https://apify.com/) 或其 [GitHub 页面](https://github.com/apify)，其中包含其代码仓库和有关其项目的更多详细信息。
```

---

## API 参考

有关如何使用此集成的更多信息，请参阅 [git 仓库](https://github.com/apify/langchain-apify) 或 [Apify 集成文档](https://docs.apify.com/platform/integrations/langgraph)。
