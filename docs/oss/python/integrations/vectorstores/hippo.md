---
title: 河马
---
>[星环 Hippo](https://www.transwarp.cn/en/subproduct/hippo) 是一款企业级云原生分布式向量数据库，支持海量向量数据集的存储、检索与管理。它高效解决了向量相似性搜索、高密度向量聚类等问题。`Hippo` 具备高可用、高性能、易扩展等特点，拥有多向量搜索索引、数据分区分片、数据持久化、增量数据摄取、向量标量字段过滤、混合查询等多种功能，能够有效满足企业对海量向量数据的高实时性搜索需求。

## 快速开始

这里唯一的先决条件是来自 OpenAI 网站的 API 密钥。请确保您已经启动了一个 Hippo 实例。

## 安装依赖

首先，我们需要安装一些依赖项，例如 OpenAI、LangChain 和 Hippo-API。请注意，您应该根据您的环境安装合适的版本。

```python
pip install -qU  langchain langchain_community tiktoken langchain-openai
pip install -qU  hippo-api==1.1.0.rc3
```

```text
Requirement already satisfied: hippo-api==1.1.0.rc3 in /Users/daochengzhang/miniforge3/envs/py310/lib/python3.10/site-packages (1.1.0rc3)
Requirement already satisfied: pyyaml>=6.0 in /Users/daochengzhang/miniforge3/envs/py310/lib/python3.10/site-packages (from hippo-api==1.1.0.rc3) (6.0.1)
```

注意：Python 版本需要 >=3.8。

## 最佳实践

### 导入依赖包

```python
import os

from langchain_community.document_loaders import TextLoader
from langchain_community.vectorstores.hippo import Hippo
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_text_splitters import CharacterTextSplitter
```

### 加载知识文档

```python
os.environ["OPENAI_API_KEY"] = "YOUR OPENAI KEY"
loader = TextLoader("../../how_to/state_of_the_union.txt")
documents = loader.load()
```

### 分割知识文档

这里我们使用 LangChain 的 CharacterTextSplitter 进行分割。分隔符是句号。分割后，文本片段不超过 1000 个字符，重复字符数为 0。

```python
text_splitter = CharacterTextSplitter(chunk_size=500, chunk_overlap=0)
docs = text_splitter.split_documents(documents)
```

### 声明嵌入模型

下面，我们使用 LangChain 的 <a href="https://reference.langchain.com/python/integrations/langchain_openai/OpenAIEmbeddings" target="_blank" rel="noreferrer" class="link"><code>OpenAIEmbeddings</code></a> 方法创建 OpenAI 或 Azure 嵌入模型。

```python
# openai
embeddings = OpenAIEmbeddings()
# azure
# embeddings = OpenAIEmbeddings(
#     openai_api_type="azure",
#     openai_api_base="x x x",
#     openai_api_version="x x x",
#     model="x x x",
#     deployment="x x x",
#     openai_api_key="x x x"
# )
```

### 声明 Hippo 客户端

```python
HIPPO_CONNECTION = {"host": "IP", "port": "PORT"}
```

### 存储文档

```python
print("input...")
# insert docs
vector_store = Hippo.from_documents(
    docs,
    embedding=embeddings,
    table_name="langchain_test",
    connection_args=HIPPO_CONNECTION,
)
print("success")
```

```text
input...
success
```

### 进行基于知识的问答

#### 创建大语言问答模型

下面，我们分别使用 LangChain 的 AzureChatOpenAI 和 ChatOpenAI 方法创建 OpenAI 或 Azure 大语言问答模型。

```python
# llm = AzureChatOpenAI(
#     openai_api_base="x x x",
#     openai_api_version="xxx",
#     deployment_name="xxx",
#     openai_api_key="xxx",
#     openai_api_type="azure"
# )

llm = ChatOpenAI(openai_api_key="YOUR OPENAI KEY", model_name="gpt-3.5-turbo-16k")
```

### 根据问题获取相关知识

```python
query = "请介绍一下 COVID-19"
# query = "请介绍一下 Hippo 核心架构"
# query = "Hippo 向量数据库支持对向量数据进行哪些操作？"
# query = "Hippo 是否使用了硬件加速技术？请简要介绍一下硬件加速技术。"

# 从知识库中检索相似内容，获取最相似的两段文本。
res = vector_store.similarity_search(query, 2)
content_list = [item.page_content for item in res]
text = "".join(content_list)
```

### 构建提示模板

```python
prompt = f"""
请使用以下[文章]的内容来回答我的问题。如果你不知道，请说不知道，并且答案要简洁。"
[文章]:{text}
请结合以上文章回答这个问题：{query}
"""
```

### 等待大语言模型生成答案

```python
response_with_hippo = llm.predict(prompt)
print(f"response_with_hippo:{response_with_hippo}")
response = llm.predict(query)
print("==========================================")
print(f"response_without_hippo:{response}")
```

```text
response_with_hippo:COVID-19 是一种病毒，在过去两年多的时间里影响了我们生活的方方面面。它具有高度传染性且容易变异，需要我们保持警惕以对抗其传播。然而，由于取得的进展和个人的韧性，我们现在能够安全地向前迈进，并恢复更正常的生活节奏。
==========================================
response_without_hippo:COVID-19 是由新型冠状病毒 SARS-CoV-2 引起的一种传染性呼吸道疾病。它于 2019 年 12 月在中国武汉首次被发现，此后在全球范围内传播，导致了一场大流行。该病毒主要通过感染者咳嗽、打喷嚏、说话或呼吸时产生的呼吸道飞沫传播，也可以通过接触受污染的表面然后触摸脸部传播。COVID-19 的症状包括发烧、咳嗽、呼吸急促、疲劳、肌肉或身体疼痛、喉咙痛、味觉或嗅觉丧失、头痛，严重时可能导致肺炎和器官衰竭。虽然大多数人症状轻微至中度，但它可能导致严重疾病甚至死亡，尤其是在老年人和有基础健康问题的人群中。为了对抗病毒的传播，全球已实施了各种预防措施，包括保持社交距离、佩戴口罩、保持良好的手部卫生以及疫苗接种工作。
```

```python

```
