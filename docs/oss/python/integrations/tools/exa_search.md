---
title: Exa 搜索
---
Exa 是一款专为 LLM 使用而设计的搜索引擎。它允许使用**自然语言查询**在互联网上搜索文档，然后从所需文档中检索**经过清理的 HTML 内容**。

与基于关键词的搜索（如 Google）不同，Exa 的神经搜索能力使其能够语义化地理解查询并返回相关文档。例如，我们可以搜索 `"关于猫的有趣文章"`，并比较 [Google](https://www.google.com/search?q=fascinating+article+about+cats) 和 [Exa](https://search.exa.ai/search?q=fascinating%20article%20about%20cats&autopromptString=Here%20is%20a%20fascinating%20article%20about%20cats%3A) 的搜索结果。Google 会根据关键词 "fascinating" 给我们提供经过 SEO 优化的列表式文章。而 Exa 则能直接给出我们想要的结果。

本笔记本将介绍如何在 LangChain 中使用 Exa 搜索。

## 设置

### 安装

安装 LangChain Exa 集成包：

```python
pip install -qU langchain-exa

# 以及本笔记本所需的一些依赖
pip install -qU langchain langchain-openai langchain-community
```

### 凭证

你需要一个 Exa API 密钥才能使用此集成。通过[在此处注册](https://dashboard.exa.ai/)，你可以获得 10 美元的免费额度（完成某些操作，如进行首次搜索，还可以获得更多额度）。

```python
import getpass
import os

if not os.environ.get("EXA_API_KEY"):
    os.environ["EXA_API_KEY"] = getpass.getpass("Exa API key:\n")
```

## 使用 ExaSearchResults 工具

ExaSearchResults 是一个可以与 LangChain 智能体（agent）一起使用的工具，用于执行 Exa 搜索。它为搜索操作提供了一个更结构化的接口：

```python
from langchain_exa import ExaSearchResults

# 初始化 ExaSearchResults 工具
search_tool = ExaSearchResults(exa_api_key=os.environ["EXA_API_KEY"])

# 执行搜索查询
search_results = search_tool._run(
    query="纽约尼克斯队上一次赢得 NBA 总冠军是什么时候？",
    num_results=5,
    text_contents_options=True,
    highlights=True,
)

print("Search Results:", search_results)
```

### ExaSearchResults 的高级功能

你可以使用高级搜索选项，例如控制搜索类型、实时爬取和内容过滤：

```python
# 使用高级选项执行搜索查询
search_results = search_tool._run(
    query="最新的 AI 研究论文",
    num_results=10,  # 结果数量 (1-100)
    type="auto",  # 可以是 "neural"、"keyword" 或 "auto"
    livecrawl="always",  # 可以是 "always"、"fallback" 或 "never"
    text_contents_options={"max_characters": 2000},  # 限制文本长度
    summary={"query": "generate one liner"},  # 自定义摘要提示
)

print("Advanced Search Results:")
print(search_results)
```

## 使用 ExaFindSimilarResults 工具

ExaFindSimilarResults 允许你查找与给定 URL 相似的网页。这对于查找相关内容或进行竞争分析非常有用：

```python
from langchain_exa import ExaFindSimilarResults

# 初始化 ExaFindSimilarResults 工具
find_similar_tool = ExaFindSimilarResults(exa_api_key=os.environ["EXA_API_KEY"])

# 基于 URL 查找相似结果
similar_results = find_similar_tool._run(
    url="http://espn.com", num_results=5, text_contents_options=True, highlights=True
)

print("Similar Results:", similar_results)
```

## 在智能体（Agent）中使用

我们可以将 ExaSearchResults 和 ExaFindSimilarResults 工具与 LangGraph 智能体一起使用。这使智能体能够根据用户的查询动态搜索信息并查找相似内容。

首先，让我们设置语言模型。你需要提供你的 OpenAI API 密钥：

```python
import getpass

if not os.environ.get("OPENAI_API_KEY"):
    os.environ["OPENAI_API_KEY"] = getpass.getpass("OpenAI API key:\n")
```

我们需要安装 langgraph：

```python
pip install -qU langgraph
```

```python
from langchain.chat_models import init_chat_model
from langchain_exa import ExaFindSimilarResults, ExaSearchResults
from langchain.agents import create_agent

# 初始化语言模型
model = init_chat_model(model="gpt-4o", model_provider="openai", temperature=0)

# 初始化 Exa 工具
exa_search = ExaSearchResults(
    exa_api_key=os.environ["EXA_API_KEY"],
    max_results=5,
)

exa_find_similar = ExaFindSimilarResults(
    exa_api_key=os.environ["EXA_API_KEY"],
    max_results=5,
)

# 创建包含两个工具的智能体
agent = create_agent(model, [exa_search, exa_find_similar])

# 示例 1：基本搜索
user_input = "量子计算的最新进展是什么？"

for step in agent.stream(
    {"messages": user_input},
    stream_mode="values",
):
    step["messages"][-1].pretty_print()
```

## 使用 ExaSearchRetriever

ExaSearchRetriever 是一个检索器（retriever），它使用 Exa 搜索来检索相关文档。

<Note>

<strong>用于 </strong>TextContentsOptions<strong> 的 `max_characters` 参数以前称为 `max_length`，现已弃用。请确保使用 `max_characters`。</strong>

</Note>

### 基本用法

以下是使用 ExaSearchRetriever 的一个简单示例：

```python
from langchain_exa import ExaSearchRetriever

# 创建 ExaSearchRetriever 的新实例
exa = ExaSearchRetriever(exa_api_key=os.environ["EXA_API_KEY"])

# 搜索查询并保存结果
results = exa.invoke("法国的首都是什么？")

# 打印结果
print(results)
```

### 高级功能

你可以使用高级功能，例如控制结果数量、搜索类型、实时爬取、摘要和文本内容选项：

```python
from langchain_exa import ExaSearchRetriever

# 使用高级选项创建新实例
exa = ExaSearchRetriever(
    exa_api_key=os.environ["EXA_API_KEY"],
    k=20,  # 结果数量 (1-100)
    type="auto",  # 可以是 "neural"、"keyword" 或 "auto"
    livecrawl="always",  # 可以是 "always"、"fallback" 或 "never"
    text_contents_options={"max_characters": 3000},  # 限制文本长度
    # 用于生成页面内容 LLM 摘要的自定义提示
    summary={"query": "用简单的语言生成一行摘要。"},
)

# 使用高级选项进行搜索
results = exa.invoke("量子计算的最新进展")
print(f"Found {len(results)} results")
for result in results[:3]:  # 打印前 3 个结果
    print(f"Title: {result.metadata.get('title', 'N/A')}")
    print(f"URL: {result.metadata.get('url', 'N/A')}")
    print(f"Summary: {result.metadata.get('summary', 'N/A')}")
    print("-" * 80)
```

---

## API 参考

有关所有 Exa API 功能和配置的详细文档，请访问 [Exa API 文档](https://docs.exa.ai/)。
