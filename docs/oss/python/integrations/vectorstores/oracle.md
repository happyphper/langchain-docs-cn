---
title: Oracle AI 向量搜索 - 向量存储
---
Oracle AI Vector Search 专为人工智能（AI）工作负载设计，允许您基于语义而非关键字来查询数据。
Oracle AI Vector Search 的最大优势之一是，可以在单一系统中将非结构化数据的语义搜索与业务数据的关系型搜索相结合。
这不仅功能强大，而且效率显著更高，因为您无需添加专门的向量数据库，从而消除了多系统间数据碎片化的痛点。

此外，您的向量可以受益于 Oracle 数据库的所有强大功能，例如：

* [分区支持](https://www.oracle.com/database/technologies/partitioning.html)
* [真正应用集群可扩展性](https://www.oracle.com/database/real-application-clusters/)
* [Exadata 智能扫描](https://www.oracle.com/database/technologies/exadata/software/smartscan/)
* [跨地理分布式数据库的分片处理](https://www.oracle.com/database/distributed-database/)
* [事务](https://docs.oracle.com/en/database/oracle/oracle-database/23/cncpt/transactions.html)
* [并行 SQL](https://docs.oracle.com/en/database/oracle/oracle-database/21/vldbg/parallel-exec-intro.html#GUID-D28717E4-0F77-44F5-BB4E-234C31D4E4BA)
* [灾难恢复](https://www.oracle.com/database/data-guard/)
* [安全性](https://www.oracle.com/security/database-security/)
* [Oracle 机器学习](https://www.oracle.com/artificial-intelligence/database-machine-learning/)
* [Oracle 图数据库](https://www.oracle.com/database/integrated-graph-database/)
* [Oracle Spatial and Graph](https://www.oracle.com/database/spatial/)
* [Oracle 区块链](https://docs.oracle.com/en/database/oracle/oracle-database/23/arpls/dbms_blockchain_table.html#GUID-B469E277-978E-4378-A8C1-26D3FF96C9A6)
* [JSON](https://docs.oracle.com/en/database/oracle/oracle-database/23/adjsn/json-in-oracle-database.html)

如果您是 Oracle 数据库的新手，可以考虑探索[免费的 Oracle 23 AI](https://www.oracle.com/database/free/#resources)，它提供了设置数据库环境的绝佳入门指南。在使用数据库时，通常建议避免默认使用系统用户；相反，您可以创建自己的用户以增强安全性和定制性。有关用户创建的详细步骤，请参阅我们的[端到端指南](https://github.com/langchain-ai/langchain/blob/v0.3/cookbook/oracleai_demo.ipynb)，该指南也展示了如何在 Oracle 中设置用户。此外，了解用户权限对于有效管理数据库安全至关重要。您可以在官方的[Oracle 指南](https://docs.oracle.com/en/database/oracle/oracle-database/19/admqs/administering-user-accounts-and-security.html#GUID-36B21D72-1BBB-46C9-A0C9-F0D2A8591B8D)中了解更多关于管理用户帐户和安全性的信息。

### 先决条件

您需要安装 `langchain-oracledb` 才能使用此集成。

`python-oracledb` 驱动程序将作为 langchain-oracledb 的依赖项自动安装。

```python
# python -m pip install -U langchain-oracledb
```

### 连接到 Oracle AI Vector Search

以下示例代码将展示如何连接到 Oracle 数据库。默认情况下，python-oracledb 以“Thin”模式运行，该模式直接连接到 Oracle 数据库。此模式不需要 Oracle 客户端库。但是，当 python-oracledb 使用它们时，会提供一些额外的功能。当使用 Oracle 客户端库时，python-oracledb 被称为处于“Thick”模式。两种模式都具有支持 Python 数据库 API v2.0 规范的全面功能。请参阅以下[指南](https://python-oracledb.readthedocs.io/en/latest/user_guide/appendix_a.html#featuresummary)，其中讨论了每种模式支持的功能。如果您无法使用 Thin 模式，可能需要切换到 Thick 模式。

```python
import oracledb

# 请更新您的用户名、密码、主机名、端口和服务名
username = "<username>"
password = "<password>"
dsn = "<hostname>:<port>/<service_name>"

connection = oracledb.connect(user=username, password=password, dsn=dsn)
print("Connection successful!")
```

### 导入所需的依赖项

```python
from langchain_oracledb.vectorstores import oraclevs
from langchain_oracledb.vectorstores.oraclevs import OracleVS
from langchain_community.vectorstores.utils import DistanceStrategy
from langchain_core.documents import Document
from langchain_huggingface import HuggingFaceEmbeddings
```

### 加载文档

```python
# 定义文档列表（以下示例来自 Oracle 概念手册中的 5 个随机文档）

documents_json_list = [
    {
        "id": "cncpt_15.5.3.2.2_P4",
        "text": "If the answer to any preceding questions is yes, then the database stops the search and allocates space from the specified tablespace; otherwise, space is allocated from the database default shared temporary tablespace.",
        "link": "https://docs.oracle.com/en/database/oracle/oracle-database/23/cncpt/logical-storage-structures.html#GUID-5387D7B2-C0CA-4C1E-811B-C7EB9B636442",
    },
    {
        "id": "cncpt_15.5.5_P1",
        "text": "A tablespace can be online (accessible) or offline (not accessible) whenever the database is open.\nA tablespace is usually online so that its data is available to users. The SYSTEM tablespace and temporary tablespaces cannot be taken offline.",
        "link": "https://docs.oracle.com/en/database/oracle/oracle-database/23/cncpt/logical-storage-structures.html#GUID-D02B2220-E6F5-40D9-AFB5-BC69BCEF6CD4",
    },
    {
        "id": "cncpt_22.3.4.3.1_P2",
        "text": "The database stores LOBs differently from other data types. Creating a LOB column implicitly creates a LOB segment and a LOB index. The tablespace containing the LOB segment and LOB index, which are always stored together, may be different from the tablespace containing the table.\nSometimes the database can store small amounts of LOB data in the table itself rather than in a separate LOB segment.",
        "link": "https://docs.oracle.com/en/database/oracle/oracle-database/23/cncpt/concepts-for-database-developers.html#GUID-3C50EAB8-FC39-4BB3-B680-4EACCE49E866",
    },
    {
        "id": "cncpt_22.3.4.3.1_P3",
        "text": "The LOB segment stores data in pieces called chunks. A chunk is a logically contiguous set of data blocks and is the smallest unit of allocation for a LOB. A row in the table stores a pointer called a LOB locator, which points to the LOB index. When the table is queried, the database uses the LOB index to quickly locate the LOB chunks.",
        "link": "https://docs.oracle.com/en/database/oracle/oracle-database/23/cncpt/concepts-for-database-developers.html#GUID-3C50EAB8-FC39-4BB3-B680-4EACCE49E866",
    },
]
```

```python
# 创建 LangChain 文档

documents_langchain = []

for doc in documents_json_list:
    metadata = {"id": doc["id"], "link": doc["link"]}
    doc_langchain = Document(page_content=doc["text"], metadata=metadata)
    documents_langchain.append(doc_langchain)
```

### 使用不同距离度量创建向量存储

首先，我们将创建三个向量存储，每个使用不同的距离函数。由于我们尚未在其中创建索引，它们目前只会创建表。稍后我们将使用这些向量存储来创建 HNSW 索引。要了解更多关于 Oracle AI Vector Search 支持的不同类型索引的信息，请参阅以下[指南](https://docs.oracle.com/en/database/oracle/oracle-database/23/vecse/manage-different-categories-vector-indexes.html)。

您可以手动连接到 Oracle 数据库，将会看到三个表：
Documents_DOT、Documents_COSINE 和 Documents_EUCLIDEAN。

然后，我们将创建另外三个表 Documents_DOT_IVF、Documents_COSINE_IVF 和 Documents_EUCLIDEAN_IVF，这些表将用于在表上创建 IVF 索引，而不是 HNSW 索引。

```python
# 使用不同的距离策略将文档摄取到 Oracle 向量存储中

# 使用我们的 API 调用时，首先通过 from_documents() 使用文档子集初始化您的向量存储，
# 然后使用 add_texts() 增量添加更多文档。
# 这种方法可以防止系统过载，并确保高效的文档处理。

model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")

vector_store_dot = OracleVS.from_documents(
    documents_langchain,
    model,
    client=connection,
    table_name="Documents_DOT",
    distance_strategy=DistanceStrategy.DOT_PRODUCT,
)
vector_store_max = OracleVS.from_documents(
    documents_langchain,
    model,
    client=connection,
    table_name="Documents_COSINE",
    distance_strategy=DistanceStrategy.COSINE,
)
vector_store_euclidean = OracleVS.from_documents(
    documents_langchain,
    model,
    client=connection,
    table_name="Documents_EUCLIDEAN",
    distance_strategy=DistanceStrategy.EUCLIDEAN_DISTANCE,
)

# 使用不同的距离策略将文档摄取到 Oracle 向量存储中
vector_store_dot_ivf = OracleVS.from_documents(
    documents_langchain,
    model,
    client=connection,
    table_name="Documents_DOT_IVF",
    distance_strategy=DistanceStrategy.DOT_PRODUCT,
)
vector_store_max_ivf = OracleVS.from_documents(
    documents_langchain,
    model,
    client=connection,
    table_name="Documents_COSINE_IVF",
    distance_strategy=DistanceStrategy.COSINE,
)
vector_store_euclidean_ivf = OracleVS.from_documents(
    documents_langchain,
    model,
    client=connection,
    table_name="Documents_EUCLIDEAN_IVF",
    distance_strategy=DistanceStrategy.EUCLIDEAN_DISTANCE,
)
```

### 文本的添加和删除操作，以及基本的相似性搜索

```python
def manage_texts(vector_stores):
    """
    向每个向量存储添加文本，演示重复添加的错误处理，
    并执行文本删除。展示每个向量存储的相似性搜索和索引创建。

    参数:
    - vector_stores (list): OracleVS 实例的列表。
    """
    texts = ["Rohan", "Shailendra"]
    metadata = [
        {"id": "100", "link": "Document Example Test 1"},
        {"id": "101", "link": "Document Example Test 2"},
    ]

    for i, vs in enumerate(vector_stores, start=1):
        # 添加文本
        try:
            vs.add_texts(texts, metadata)
            print(f"\n\n\nAdd texts complete for vector store {i}\n\n\n")
        except Exception as ex:
            print(f"\n\n\nExpected error on duplicate add for vector store {i}\n\n\n")

        # 使用 'id' 的值删除文本
        vs.delete([metadata[0]["id"]])
        print(f"\n\n\nDelete texts complete for vector store {i}\n\n\n")

        # 相似性搜索
        results = vs.similarity_search("How are LOBS stored in Oracle Database", 2)
        print(f"\n\n\nSimilarity search results for vector store {i}: {results}\n\n\n")

vector_store_list = [
    vector_store_dot,
    vector_store_max,
    vector_store_euclidean,
    vector_store_dot_ivf,
    vector_store_max_ivf,
    vector_store_euclidean_ivf,
]
manage_texts(vector_store_list)
```

### 使用特定参数创建索引

```python
def create_search_indices(connection):
    """
    为向量存储创建搜索索引，每个索引都有针对其距离策略定制的特定参数。
    """
    # DOT_PRODUCT 策略的索引
    # 注意我们正在使用默认参数创建 HNSW 索引
    # 这将默认创建具有 8 个并行工作线程并使用 Oracle AI Vector Search 默认精度的 HNSW 索引
    oraclevs.create_index(
        connection,
        vector_store_dot,
        params={"idx_name": "hnsw_idx1", "idx_type": "HNSW"},
    )

    # COSINE 策略的索引，带有特定参数
    # 注意我们正在创建具有并行度 16 和目标精度规范为 97% 的 HNSW 索引
    oraclevs.create_index(
        connection,
        vector_store_max,
        params={
            "idx_name": "hnsw_idx2",
            "idx_type": "HNSW",
            "accuracy": 97,
            "parallel": 16,
        },
    )

    # EUCLIDEAN_DISTANCE 策略的索引，带有特定参数
    # 注意我们正在通过指定高级用户参数来创建 HNSW 索引，这些参数是 neighbors = 64 和 efConstruction = 100
    oraclevs.create_index(
        connection,
        vector_store_euclidean,
        params={
            "idx_name": "hnsw_idx3",
            "idx_type": "HNSW",
            "neighbors": 64,
            "efConstruction": 100,
        },
    )

    # DOT_PRODUCT 策略的索引，带有特定参数
    # 注意我们正在使用默认参数创建 IVF 索引
    # 这将默认创建具有 8 个并行工作线程并使用 Oracle AI Vector Search 默认精度的 IVF 索引
    oraclevs.create_index(
        connection,
        vector_store_dot_ivf,
        params={
            "idx_name": "ivf_idx1",
            "idx_type": "IVF",
        },
    )

    # COSINE 策略的索引，带有特定参数
    # 注意我们正在创建具有并行度 32 和目标精度规范为 90% 的 IVF 索引
    oraclevs.create_index(
        connection,
        vector_store_max_ivf,
        params={
            "idx_name": "ivf_idx2",
            "idx_type": "IVF",
            "accuracy": 90,
            "parallel": 32,
        },
    )

    # EUCLIDEAN_DISTANCE 策略的索引，带有特定参数
    # 注意我们正在通过指定高级用户参数来创建 IVF 索引，该参数是 neighbor_part = 64
    oraclevs.create_index(
        connection,
        vector_store_euclidean_ivf,
        params={"idx_name": "ivf_idx3", "idx_type": "IVF", "neighbor_part": 64},
    )

    print("Index creation complete.")

create_search_indices(connection)
```

### 高级搜索

Oracle Database 23ai 支持预过滤、内过滤和后过滤，以增强 AI 向量搜索能力。这些过滤机制允许用户在执行向量相似性搜索之前、期间和之后应用约束，从而提高搜索性能和准确性。

关于 Oracle 23ai 中过滤的关键点：

1. 预过滤
在执行向量相似性搜索之前，应用传统的 SQL 过滤器来减少数据集。
通过限制 AI 算法处理的数据量来提高效率。
2. 内过滤
利用 AI 向量搜索直接在向量嵌入上执行相似性搜索，使用优化的索引和算法。
基于向量相似性高效过滤结果，无需全数据集扫描。
3. 后过滤
在向量相似性搜索之后，应用额外的 SQL 过滤来优化结果。
允许基于业务逻辑或额外的元数据条件进行进一步优化。

**为什么这很重要？**

* 性能优化：预过滤显著减少了查询执行时间，使对海量数据集的搜索更加高效。
* 准确性增强：内过滤确保向量搜索在语义上有意义，提高了搜索结果的质量。

#### 过滤器详情

`OracleVS` 支持一组可以应用于 `metadata` 字段的过滤器，使用 `filter` 参数。这些过滤器允许您根据各种条件选择和优化数据。

**可用的过滤器运算符：**

| 运算符                   | 描述                                                                                      |
|----------------------------|--------------------------------------------------------------------------------------------------|
| `\$exists`                 | 字段存在。                                                                                    |
| `\$eq`                     | 字段值等于操作数值 (`=`)。                                                      |
| `\$ne`                     | 字段存在且值不等于操作数值 (`!=`)。                                  |
| `\$gt`                     | 字段值大于操作数值 (`>`)。                                             |
| `\$lt`                     | 字段值小于操作数值 (`<`)。                                                |
| `\$gte`                    | 字段值大于或等于操作数值 (`>=`)。                                |
| `\$lte`                    | 字段值小于或等于操作数值 (`<=`)。                                   |
| `\$between`                | 字段值在操作数数组的两个值之间（或等于）。                            |
| `\$startsWith`             | 字段值以操作数值开头。                                                       |
| `\$hasSubstring`           | 字段值包含操作数作为子字符串。                                                 |
| `\$instr`                  | 字段值包含操作数作为子字符串。                                                 |
| `\$regex`                  | 字段值与给定的正则表达式模式匹配。                                        |
| `\$like`                   | 字段值与操作数模式匹配（使用类似 SQL 的语法）。                                 |
| `\$in`                     | 字段值等于操作数数组中的至少一个值。                                      |
| `\$nin`                    | 字段存在，但其值不等于操作数数组中的任何值，或者该字段不存在。|
| `\$all`                    | 字段值是一个包含操作数数组中所有项的数组，或者是一个与单个操作数匹配的标量。 |

* 您可以使用逻辑运算符组合这些过滤器：

| 逻辑运算符   | 描述          |
|--------------------|----------------------|
| `\$and`            | 逻辑 AND         
