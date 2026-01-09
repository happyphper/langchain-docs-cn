---
title: Oracle AI 向量搜索文档处理
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

本指南演示了如何在 Oracle AI Vector Search 中使用文档处理功能，分别通过 OracleDocLoader 和 OracleTextSplitter 来加载和分块文档。

如果您是 Oracle 数据库的新手，可以考虑探索[免费的 Oracle 23 AI](https://www.oracle.com/database/free/#resources)，它提供了设置数据库环境的绝佳入门介绍。在使用数据库时，通常建议避免默认使用系统用户；相反，您可以创建自己的用户以增强安全性和定制性。有关用户创建的详细步骤，请参阅我们的[端到端指南](https://github.com/langchain-ai/langchain/blob/v0.3/cookbook/oracleai_demo.ipynb)，该指南也展示了如何在 Oracle 中设置用户。此外，了解用户权限对于有效管理数据库安全至关重要。您可以在官方的[Oracle 指南](https://docs.oracle.com/en/database/oracle/oracle-database/19/admqs/administering-user-accounts-and-security.html#GUID-36B21D72-1BBB-46C9-A0C9-F0D2A8591B8D)中了解更多关于管理用户帐户和安全性的内容。

### 先决条件

您需要安装 `langchain-oracledb` 才能使用此集成。

`python-oracledb` 驱动程序将作为 langchain-oracledb 的依赖项自动安装。

```python
# python -m pip install -U langchain-oracledb
```

### 连接到 Oracle 数据库

以下示例代码将展示如何连接到 Oracle 数据库。默认情况下，python-oracledb 以“Thin”模式运行，该模式直接连接到 Oracle 数据库。此模式不需要 Oracle 客户端库。但是，当 python-oracledb 使用它们时，可以获得一些额外的功能。当使用 Oracle 客户端库时，python-oracledb 被称为处于“Thick”模式。两种模式都具有支持 Python 数据库 API v2.0 规范的全面功能。请参阅以下[指南](https://python-oracledb.readthedocs.io/en/latest/user_guide/appendix_a.html#featuresummary)，该指南讨论了每种模式支持的功能。如果您无法使用 Thin 模式，可能需要切换到 Thick 模式。

```python
import sys

import oracledb

# 请更新为您的用户名、密码、主机名、端口和服务名
username = "<username>"
password = "<password>"
dsn = "<hostname>:<port>/<service_name>"

connection = oracledb.connect(user=username, password=password, dsn=dsn)
print("Connection successful!")
```

现在让我们创建一个表并插入一些示例文档进行测试。

```python
try:
    cursor = conn.cursor()

    drop_table_sql = """drop table if exists demo_tab"""
    cursor.execute(drop_table_sql)

    create_table_sql = """create table demo_tab (id number, data clob)"""
    cursor.execute(create_table_sql)

    insert_row_sql = """insert into demo_tab values (:1, :2)"""
    rows_to_insert = [
        (
            1,
            "If the answer to any preceding questions is yes, then the database stops the search and allocates space from the specified tablespace; otherwise, space is allocated from the database default shared temporary tablespace.",
        ),
        (
            2,
            "A tablespace can be online (accessible) or offline (not accessible) whenever the database is open.\nA tablespace is usually online so that its data is available to users. The SYSTEM tablespace and temporary tablespaces cannot be taken offline.",
        ),
        (
            3,
            "The database stores LOBs differently from other data types. Creating a LOB column implicitly creates a LOB segment and a LOB index. The tablespace containing the LOB segment and LOB index, which are always stored together, may be different from the tablespace containing the table.\nSometimes the database can store small amounts of LOB data in the table itself rather than in a separate LOB segment.",
        ),
    ]
    cursor.executemany(insert_row_sql, rows_to_insert)

    conn.commit()

    print("Table created and populated.")
    cursor.close()
except Exception as e:
    print("Table creation failed.")
    cursor.close()
    conn.close()
    sys.exit(1)
```

### 加载文档

用户可以通过适当配置加载器参数，灵活地从 Oracle 数据库、文件系统或两者加载文档。有关这些参数的完整详细信息，请查阅 [Oracle AI Vector Search 指南](https://docs.oracle.com/en/database/oracle/oracle-database/23/arpls/dbms_vector_chain1.html#GUID-73397E89-92FB-48ED-94BB-1AD960C4EA1F)。

使用 OracleDocLoader 的一个显著优势是其能够处理超过 150 种不同的文件格式，无需为不同的文档类型使用多个加载器。有关支持格式的完整列表，请参阅 [Oracle Text 支持的文档格式](https://docs.oracle.com/en/database/oracle/oracle-database/23/ccref/oracle-text-supported-document-formats.html)。

以下是一个演示如何使用 `OracleDocLoader` 的示例代码片段：

```python
from langchain_oracledb.document_loaders.oracleai import OracleDocLoader
from langchain_core.documents import Document

"""
# 加载本地文件
loader_params = {}
loader_params["file"] = "<file>"

# 从本地目录加载
loader_params = {}
loader_params["dir"] = "<directory>"
"""

# 从 Oracle 数据库表加载
loader_params = {
    "owner": "<owner>",
    "tablename": "demo_tab",
    "colname": "data",
}

""" 加载文档 """
loader = OracleDocLoader(conn=conn, params=loader_params)
docs = loader.load()

""" 验证 """
print(f"Number of docs loaded: {len(docs)}")
# print(f"Document-0: {docs[0].page_content}") # 内容
```

### 分割文档

文档的大小可能各不相同，从小型到非常大型。用户通常倾向于将文档分块成较小的部分，以便于生成嵌入向量。此分割过程提供了广泛的定制选项。有关这些参数的完整详细信息，请查阅 [Oracle AI Vector Search 指南](https://docs.oracle.com/en/database/oracle/oracle-database/23/arpls/dbms_vector_chain1.html#GUID-4E145629-7098-4C7C-804F-FC85D1F24240)。

以下是一个说明如何实现此功能的示例代码：

```python
from langchain_oracledb.document_loaders.oracleai import OracleTextSplitter
from langchain_core.documents import Document

"""
# 一些示例
# 按字符分割，最多 500 个字符
splitter_params = {"split": "chars", "max": 500, "normalize": "all"}

# 按单词分割，最多 100 个单词
splitter_params = {"split": "words", "max": 100, "normalize": "all"}

# 按句子分割，最多 20 个句子
splitter_params = {"split": "sentence", "max": 20, "normalize": "all"}
"""

# 使用默认参数分割
splitter_params = {"normalize": "all"}

# 获取分割器实例
splitter = OracleTextSplitter(conn=conn, params=splitter_params)

list_chunks = []
for doc in docs:
    chunks = splitter.split_text(doc.page_content)
    list_chunks.extend(chunks)

""" 验证 """
print(f"Number of Chunks: {len(list_chunks)}")
# print(f"Chunk-0: {list_chunks[0]}") # 内容
```

### 端到端演示

请参阅我们的完整演示指南 [Oracle AI Vector Search 端到端演示指南](https://github.com/langchain-ai/langchain/blob/v0.3/cookbook/oracleai_demo.ipynb)，以借助 Oracle AI Vector Search 构建端到端的 RAG 管道。
