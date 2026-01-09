---
title: SQL Server
---
>Azure SQL 提供了专用的[向量数据类型](https:\learn.microsoft.com\sql\t-sql\data-types\vector-data-type?view=azuresqldb-current&viewFallbackFrom=sql-server-ver16&tabs=csharp-sample)，可直接在关系数据库中简化向量嵌入的创建、存储和查询。这消除了对独立向量数据库及相关集成的需求，在降低整体复杂性的同时，提高了解决方案的安全性。

Azure SQL 是一项结合了可扩展性、安全性和高可用性的强大服务，提供了现代数据库解决方案的所有优势。它利用复杂的查询优化器和企业级功能，在执行传统 SQL 查询的同时进行向量相似性搜索，从而增强数据分析和决策能力。

阅读更多关于[使用 Azure SQL 数据库构建智能应用程序](https://learn.microsoft.com/azure/azure-sql/database/ai-artificial-intelligence-intelligent-applications?view=azuresql)的信息。

本笔记本将向您展示如何利用这个集成的 SQL [向量数据库](https://devblogs.microsoft.com/azure-sql/exciting-announcement-public-preview-of-native-vector-support-in-azure-sql-database/)来存储文档，并使用余弦距离（cosine distance）、L2距离（欧几里得距离）和内积（inner product）执行向量搜索查询，以查找与查询向量接近的文档。

## 设置

安装 `langchain-sqlserver` Python 包。

代码位于名为 [langchain-sqlserver](https:\github.com\langchain-ai\langchain-azure\tree\main\libs\sqlserver) 的集成包中。

```python
!pip install langchain-sqlserver==0.1.1
```

## 凭证

运行此笔记本无需任何凭证，只需确保已下载 `langchain-sqlserver` 包。
如果您希望获得最佳的模型调用自动追踪体验，也可以通过取消下面的注释来设置您的 [LangSmith](https://docs.langchain.com/langsmith/home) API 密钥：

```python
os.environ["LANGSMITH_API_KEY"] = getpass.getpass("Enter your LangSmith API key: ")
os.environ["LANGSMITH_TRACING"] = "true"
```

## 初始化

```python
from langchain_sqlserver import SQLServer_VectorStore
```

在 Azure 门户中，在您的数据库设置下找到 Azure SQL 数据库连接字符串。

更多信息：[连接到 Azure SQL 数据库 - Python](https:\learn.microsoft.com\en-us\azure\azure-sql\database\connect-query-python?view=azuresql)

```python
import os

import pyodbc

# 定义您的 SQLServer 连接字符串
_CONNECTION_STRING = (
    "Driver={ODBC Driver 18 for SQL Server};"
    "Server=<YOUR_DBSERVER>.database.windows.net,1433;"
    "Database=test;"
    "TrustServerCertificate=yes;"
    "Connection Timeout=60;"
    "LongAsMax=yes;"
)

# 连接字符串可能有所不同：
# "mssql+pyodbc://<username>:<password><servername>/<dbname>?driver=ODBC+Driver+18+for+SQL+Server" -> 指定用户名和密码
# "mssql+pyodbc://<servername>/<dbname>?driver=ODBC+Driver+18+for+SQL+Server&Trusted_connection=yes" -> 使用受信任连接
# "mssql+pyodbc://<servername>/<dbname>?driver=ODBC+Driver+18+for+SQL+Server" -> 使用 EntraID 连接
# "mssql+pyodbc://<servername>/<dbname>?driver=ODBC+Driver+18+for+SQL+Server&Trusted_connection=no" -> 使用 EntraID 连接
```

在本示例中，我们使用 Azure OpenAI 生成嵌入向量，但您也可以使用 LangChain 中提供的其他嵌入模型。

您可以按照此[指南](https:\learn.microsoft.com\en-us\azure\ai-services\openai\how-to\create-resource?pivots=web-portal)在 Azure 门户上部署 Azure OpenAI 实例。一旦您的实例运行起来，请确保您拥有实例名称和密钥。您可以在 Azure 门户中，在实例的“密钥和终结点”部分找到密钥。

```python
!pip install langchain-openai
```

```python
# 导入必要的库
from langchain_openai import AzureChatOpenAI, AzureOpenAIEmbeddings

# 设置您的 AzureOpenAI 详细信息
azure_endpoint = "https://<YOUR_ENDPOINT>.openai.azure.com/"
azure_deployment_name_embedding = "text-embedding-3-small"
azure_deployment_name_chatcompletion = "chatcompletion"
azure_api_version = "2023-05-15"
azure_api_key = "YOUR_KEY"

# 使用 AzureChatOpenAI 进行聊天补全
llm = AzureChatOpenAI(
    azure_endpoint=azure_endpoint,
    azure_deployment=azure_deployment_name_chatcompletion,
    openai_api_version=azure_api_version,
    openai_api_key=azure_api_key,
)

# 使用 AzureOpenAIEmbeddings 生成嵌入向量
embeddings = AzureOpenAIEmbeddings(
    azure_endpoint=azure_endpoint,
    azure_deployment=azure_deployment_name_embedding,
    openai_api_version=azure_api_version,
    openai_api_key=azure_api_key,
)
```

## 管理向量存储

```python
from langchain_community.vectorstores.utils import DistanceStrategy
from langchain_sqlserver import SQLServer_VectorStore

# 初始化向量存储
vector_store = SQLServer_VectorStore(
    connection_string=_CONNECTION_STRING,
    distance_strategy=DistanceStrategy.COSINE,  # 可选，如果不提供，默认为 COSINE
    embedding_function=embeddings,  # 您可以使用 LangChain 中提供的其他嵌入模型
    embedding_length=1536,
    table_name="langchain_test_table",  # 使用自定义名称的表
)
```

### 向向量存储添加项目

```python
## 我们将为此示例使用一些人工数据
query = [
    "I have bought several of the Vitality canned dog food products and have found them all to be of good quality. The product looks more like a stew than a processed meat and it smells better. My Labrador is finicky and she appreciates this product better than  most.",
    "The candy is just red , No flavor . Just  plan and chewy .  I would never buy them again",
    "Arrived in 6 days and were so stale i could not eat any of the 6 bags!!",
    "Got these on sale for roughly 25 cents per cup, which is half the price of my local grocery stores, plus they rarely stock the spicy flavors. These things are a GREAT snack for my office where time is constantly crunched and sometimes you can't escape for a real meal. This is one of my favorite flavors of Instant Lunch and will be back to buy every time it goes on sale.",
    "If you are looking for a less messy version of licorice for the children, then be sure to try these!  They're soft, easy to chew, and they don't get your hands all sticky and gross in the car, in the summer, at the beach, etc. We love all the flavos and sometimes mix these in with the chocolate to have a very nice snack! Great item, great price too, highly recommend!",
    "We had trouble finding this locally - delivery was fast, no more hunting up and down the flour aisle at our local grocery stores.",
    "Too much of a good thing? We worked this kibble in over time, slowly shifting the percentage of Felidae to national junk-food brand until the bowl was all natural. By this time, the cats couldn't keep it in or down. What a mess. We've moved on.",
    "Hey, the description says 360 grams - that is roughly 13 ounces at under $4.00 per can. No way - that is the approximate price for a 100 gram can.",
    "The taste of these white cheddar flat breads is like a regular cracker - which is not bad, except that I bought them because I wanted a cheese taste.<br /><br />What was a HUGE disappointment? How misleading the packaging of the box is. The photo on the box (I bought these in store) makes it look like it is full of long flatbreads (expanding the length and width of the box). Wrong! The plastic tray that holds the crackers is about 2"
    " smaller all around - leaving you with about 15 or so small flatbreads.<br /><br />What is also bad about this is that the company states they use biodegradable and eco-friendly packaging. FAIL! They used a HUGE box for a ridiculously small amount of crackers. Not ecofriendly at all.<br /><br />Would I buy these again? No - I feel ripped off. The other crackers (like Sesame Tarragon) give you a little<br />more bang for your buck and have more flavor.",
    "I have used this product in smoothies for my son and he loves it. Additionally, I use this oil in the shower as a skin conditioner and it has made my skin look great. Some of the stretch marks on my belly has disappeared quickly. Highly recommend!!!",
    "Been taking Coconut Oil for YEARS.  This is the best on the retail market.  I wish it was in glass, but this is the one.",
]

query_metadata = [
    {"id": 1, "summary": "Good Quality Dog Food"},
    {"id": 8, "summary": "Nasty No flavor"},
    {"id": 4, "summary": "stale product"},
    {"id": 11, "summary": "Great value and convenient ramen"},
    {"id": 5, "summary": "Great for the kids!"},
    {"id": 2, "summary": "yum falafel"},
    {"id": 9, "summary": "Nearly killed the cats"},
    {"id": 6, "summary": "Price cannot be correct"},
    {"id": 3, "summary": "Taste is neutral, quantity is DECEITFUL!"},
    {"id": 7, "summary": "This stuff is great"},
    {"id": 10, "summary": "The reviews don't lie"},
]
```

```python
vector_store.add_texts(texts=query, metadatas=query_metadata)
```

```text
[1, 8, 4, 11, 5, 2, 9, 6, 3, 7, 10]
```

## 查询向量存储

一旦您的向量存储创建完成并添加了相关文档，您很可能希望在运行链或代理时查询它。

执行简单的相似性搜索可以按如下方式进行：

```python
# 在查询的嵌入向量和文档的嵌入向量之间执行相似性搜索
simsearch_result = vector_store.similarity_search("Good reviews", k=3)
print(simsearch_result)
```

```text
[Document(metadata={'id': 1, 'summary': 'Good Quality Dog Food'}, page_content='I have bought several of the Vitality canned dog food products and have found them all to be of good quality. The product looks more like a stew than a processed meat and it smells better. My Labrador is finicky and she appreciates this product better than  most.'), Document(metadata={'id': 7, 'summary': 'This stuff is great'}, page_content='I have used this product in smoothies for my son and he loves it. Additionally, I use this oil in the shower as a skin conditioner and it has made my skin look great. Some of the stretch marks on my belly has disappeared quickly. Highly recommend!!!'), Document(metadata={'id': 5, 'summary': 'Great for the kids!'}, page_content="If you are looking for a less messy version of licorice for the children, then be sure to try these!  They're soft, easy to chew, and they don't get your hands all sticky and gross in the car, in the summer, at the beach, etc. We love all the flavos and sometimes mix these in with the chocolate to have a very nice snack! Great item, great price too, highly recommend!")]
```

### 过滤支持

向量存储支持一组可应用于文档元数据字段的过滤器。此功能使开发人员和数据分析师能够优化他们的查询，确保搜索结果与他们的需求精确匹配。通过基于特定元数据属性应用过滤器，用户可以限制搜索范围，仅关注最相关的数据子集。

```python
# 混合搜索 -> 过滤掉 id 不等于 1 的情况。
hybrid_simsearch_result = vector_store.similarity_search(
    "Good reviews", k=3, filter={"id": {"$ne": 1}}
)
print(hybrid_simsearch_result)
```

```text
[Document(metadata={'id': 7, 'summary': 'This stuff is great'}, page_content='I have used this product in smoothies for my son and he loves it. Additionally, I use this oil in the shower as a skin conditioner and it has made my skin look great. Some of the stretch marks on my belly has disappeared quickly. Highly recommend!!!'), Document(metadata={'id': 5, 'summary': 'Great for the kids!'}, page_content="If you are looking for a less messy version of licorice for the children, then be sure to try these!  They're soft, easy to chew, and they don't get your hands all sticky and gross in the car, in the summer, at the beach, etc. We love all the flavos and sometimes mix these in with the chocolate to have a very nice snack! Great item, great price too, highly recommend!"), Document(metadata={'id': 3, 'summary': 'Taste is neutral, quantity is DECEITFUL!'}, page_content='The taste of these white cheddar flat breads is like a regular cracker - which is not bad, except that I bought them because I wanted a cheese taste.<br /><br />What was a HUGE disappointment? How misleading the packaging of the box is. The photo on the box (I bought these in store) makes it look like it is full of long flatbreads (expanding the length and width of the box). Wrong! The plastic tray that holds the crackers is about 2 smaller all around - leaving you with about 15 or so small flatbreads.<br /><br />What is also bad about this is that the company states they use biodegradable and eco-friendly packaging. FAIL! They used a HUGE box for a ridiculously small amount of crackers. Not ecofriendly at all.<br /><br />Would I buy these again? No - I feel ripped off. The other crackers (like Sesame Tarragon) give you a little<br />more bang for your buck and have more flavor.')]
```

### 带分数的相似性搜索

如果您想执行相似性搜索并获取相应的分数，可以运行：

```python
simsearch_with_score_result = vector_store.similarity_search_with_score(
    "Not a very good product", k=12
)
print(simsearch_with_score_result)
```

```text
[(Document(metadata={'id': 3, 'summary': 'Taste is neutral, quantity is DECEITFUL!'}, page_content='The taste of these white cheddar flat breads is like a regular cracker - which is not bad, except that I bought them because I wanted a cheese taste.<br /><br />What was a HUGE disappointment? How misleading the packaging of the box is. The photo on the box (I bought these in store) makes it look like it is full of long flatbreads (expanding the length and width of the box). Wrong! The plastic tray that holds the crackers is about 2 smaller all around - leaving you with about 15 or so small flatbreads.<br /><br />What is also bad about this is that the company states they use biodegradable and eco-friendly packaging. FAIL! They used a HUGE box for a ridiculously small amount of crackers. Not ecofriendly at all.<br /><br />Would I buy these again? No - I feel ripped off. The other crackers (like Sesame Tarragon) give you a little<br />more bang for your buck and have more flavor.'), 0.651870006770711), (Document(metadata={'id': 8, 'summary': 'Nasty No flavor'}, page_content='The candy is just red , No flavor . Just  plan and chewy .  I would never buy them again'), 0.6908952973052638), (Document(metadata={'id': 4, 'summary': 'stale product'}, page_content='Arrived in 6 days and were so stale i could not eat any of the 6 bags!!'), 0.7360955776468822), (Document(metadata={'id': 1, 'summary': 'Good Quality Dog Food'}, page_content='I have bought several of the Vitality canned dog food products and have found them all to be of good quality. The product looks more like a stew than a processed meat and it smells better. My Labrador is finicky and she appreciates this product better than  most.'), 0.7408823529514486), (Document(metadata={'id': 9, 'summary': 'Nearly killed the cats'}, page_content="Too much of a good thing? We worked this kibble in over time, slowly shifting the percentage of Felidae to national junk-food brand until the bowl was all natural. By this time, the cats couldn't keep it in or down. What a mess. We've moved on."), 0.782995248991772), (Document(metadata={'id': 7, 'summary': 'This stuff is great'}, page_content='I have used this product in smoothies for my son and he loves it. Additionally, I use this oil in the shower as a skin conditioner and it has made my skin look great. Some of the stretch marks on my belly has disappeared quickly. Highly recommend!!!'), 0.7912681479906212), (Document(metadata={'id': 2, 'summary': 'yum falafel'}, page_content='We had trouble finding this locally - delivery was fast, no more hunting up and down the flour aisle at our local grocery stores.'), 0.809213468778896), (Document(metadata={'id': 10, 'summary': "The reviews don't lie"}, page_content='Been taking Coconut Oil for YEARS.  This is the best on the retail market.  I wish it was in glass, but this is the one.'), 0.8281482301097155), (Document(metadata={'id': 5, 'summary': 'Great for the kids!'}, page_content="If you are looking for a less messy version of licor
