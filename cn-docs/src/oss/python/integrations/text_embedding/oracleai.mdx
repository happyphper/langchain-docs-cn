---
title: Oracle AI 向量搜索生成嵌入向量
---
Oracle AI Vector Search 专为人工智能（AI）工作负载设计，允许您基于语义而非关键字来查询数据。
Oracle AI Vector Search 的最大优势之一是，可以在单一系统中将非结构化数据的语义搜索与业务数据的关系型搜索相结合。
这不仅功能强大，而且显著更高效，因为您无需添加专门的向量数据库，从而消除了多个系统间数据碎片化的痛点。

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

本指南演示了如何使用 Oracle AI Vector Search 中的嵌入功能，通过 OracleEmbeddings 为您的文档生成嵌入向量。

如果您刚开始使用 Oracle 数据库，可以考虑探索[免费的 Oracle 23 AI](https://www.oracle.com/database/free/#resources)，它提供了设置数据库环境的绝佳入门介绍。在使用数据库时，通常建议避免默认使用系统用户；相反，您可以创建自己的用户以增强安全性和定制性。有关用户创建的详细步骤，请参阅我们的[端到端指南](https://github.com/langchain-ai/langchain/blob/v0.3/cookbook/oracleai_demo.ipynb)，该指南也展示了如何在 Oracle 中设置用户。此外，了解用户权限对于有效管理数据库安全至关重要。您可以在官方的[Oracle 指南](https://docs.oracle.com/en/database/oracle/oracle-database/19/admqs/administering-user-accounts-and-security.html#GUID-36B21D72-1BBB-46C9-A0C9-F0D2A8591B8D)中了解更多关于管理用户帐户和安全性的主题。

### 先决条件

您需要安装 `langchain-oracledb` 才能使用此集成。

`python-oracledb` 驱动程序将作为 langchain-oracledb 的依赖项自动安装。

```python
# python -m pip install -U langchain-oracledb
```

### 连接到 Oracle 数据库

以下示例代码将展示如何连接到 Oracle 数据库。默认情况下，python-oracledb 以“Thin”模式运行，该模式直接连接到 Oracle 数据库。此模式不需要 Oracle 客户端库。但是，当 python-oracledb 使用它们时，会提供一些额外的功能。当使用 Oracle 客户端库时，python-oracledb 被称为处于“Thick”模式。两种模式都具有支持 Python 数据库 API v2.0 规范的全面功能。请参阅以下[指南](https://python-oracledb.readthedocs.io/en/latest/user_guide/appendix_a.html#featuresummary)，该指南讨论了每种模式支持的功能。如果您无法使用 Thin 模式，可能需要切换到 Thick 模式。

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

对于嵌入向量生成，用户可以使用多种提供程序选项，包括数据库内生成和第三方服务，如 OcigenAI、Hugging Face 和 OpenAI。选择第三方提供程序的用户必须建立包含必要身份验证信息的凭据。或者，如果用户选择“database”作为其提供程序，则需要将 ONNX 模型加载到 Oracle 数据库中以促进嵌入向量生成。

### 加载 ONNX 模型

Oracle 支持多种嵌入向量提供程序，允许用户在专有数据库解决方案和第三方服务（如 OCIGENAI 和 HuggingFace）之间进行选择。此选择决定了生成和管理嵌入向量的方法。

***重要提示***：如果用户选择数据库选项，则必须将 ONNX 模型上传到 Oracle 数据库。相反，如果选择第三方提供程序来生成嵌入向量，则无需将 ONNX 模型上传到 Oracle 数据库。

直接在 Oracle 中使用 ONNX 模型的一个显著优势是，它通过消除向外部传输数据的需要，提供了增强的安全性和性能。此外，这种方法避免了通常与网络或 REST API 调用相关的延迟。

以下是将 ONNX 模型上传到 Oracle 数据库的示例代码：

```python
from langchain_oracledb.embeddings.oracleai import OracleEmbeddings

# 更新您的 ONNX 模型的目录和文件名
# 确保系统中存在 onnx 文件
onnx_dir = "DEMO_DIR"
onnx_file = "tinybert.onnx"
model_name = "demo_model"

try:
    OracleEmbeddings.load_onnx_model(conn, onnx_dir, onnx_file, model_name)
    print("ONNX model loaded.")
except Exception as e:
    print("ONNX model loading failed!")
    sys.exit(1)
```

### 创建凭据

当选择第三方提供程序生成嵌入向量时，用户需要建立凭据以安全访问提供程序的端点。

***重要提示：*** 选择“database”提供程序生成嵌入向量时不需要凭据。但是，如果用户决定使用第三方提供程序，则必须为所选提供程序创建特定的凭据。

以下是一个说明性示例：

```python
try:
    cursor = conn.cursor()
    cursor.execute(
        """
       declare
           jo json_object_t;
       begin
           -- HuggingFace
           dbms_vector_chain.drop_credential(credential_name  => 'HF_CRED');
           jo := json_object_t();
           jo.put('access_token', '<access_token>');
           dbms_vector_chain.create_credential(
               credential_name   =>  'HF_CRED',
               params            => json(jo.to_string));

           -- OCIGENAI
           dbms_vector_chain.drop_credential(credential_name  => 'OCI_CRED');
           jo := json_object_t();
           jo.put('user_ocid','<user_ocid>');
           jo.put('tenancy_ocid','<tenancy_ocid>');
           jo.put('compartment_ocid','<compartment_ocid>');
           jo.put('private_key','<private_key>');
           jo.put('fingerprint','<fingerprint>');
           dbms_vector_chain.create_credential(
               credential_name   => 'OCI_CRED',
               params            => json(jo.to_string));
       end;
       """
    )
    cursor.close()
    print("Credentials created.")
except Exception as ex:
    cursor.close()
    raise
```

### 生成嵌入向量

Oracle AI Vector Search 提供了多种生成嵌入向量的方法，利用本地托管的 ONNX 模型或第三方 API。有关配置这些替代方案的完整说明，请参阅 [Oracle AI Vector Search 指南](https://docs.oracle.com/en/database/oracle/oracle-database/23/arpls/dbms_vector_chain1.html#GUID-C6439E94-4E86-4ECD-954E-4B73D53579DE)。

***注意：*** 用户可能需要配置代理才能使用第三方嵌入向量生成提供程序，不包括使用 ONNX 模型的“database”提供程序。

```python
# 实例化摘要和嵌入器对象时要使用的代理
proxy = "<proxy>"
```

以下示例代码将展示如何生成嵌入向量：

```python
from langchain_oracledb.embeddings.oracleai import OracleEmbeddings
from langchain_core.documents import Document

"""
# 使用 ocigenai
embedder_params = {
    "provider": "ocigenai",
    "credential_name": "OCI_CRED",
    "url": "https://inference.generativeai.us-chicago-1.oci.oraclecloud.com/20231130/actions/embedText",
    "model": "cohere.embed-english-light-v3.0",
}

# 使用 huggingface
embedder_params = {
    "provider": "huggingface",
    "credential_name": "HF_CRED",
    "url": "https://api-inference.huggingface.co/pipeline/feature-extraction/",
    "model": "sentence-transformers/all-MiniLM-L6-v2",
    "wait_for_model": "true"
}
"""

# 使用加载到 Oracle 数据库的 ONNX 模型
embedder_params = {"provider": "database", "model": "demo_model"}

# 如果您的环境不需要代理，可以省略下面的 'proxy' 参数
embedder = OracleEmbeddings(conn=conn, params=embedder_params, proxy=proxy)
embed = embedder.embed_query("Hello World!")

""" 验证 """
print(f"Embedding generated by OracleEmbeddings: {embed}")
```

### 端到端演示

请参阅我们的完整演示指南 [Oracle AI Vector Search 端到端演示指南](https://github.com/langchain-ai/langchain/blob/v0.3/cookbook/oracleai_demo.ipynb)，以借助 Oracle AI Vector Search 构建端到端的 RAG 管道。
