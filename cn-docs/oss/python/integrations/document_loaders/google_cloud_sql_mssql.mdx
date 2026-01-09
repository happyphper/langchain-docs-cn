---
title: Google Cloud SQL for SQL Server
---
> [Cloud SQL](https://cloud.google.com/sql) 是一个全托管的关系型数据库服务，提供高性能、无缝集成和卓越的可扩展性。它支持 [MySQL](https://cloud.google.com/sql/mysql)、[PostgreSQL](https://cloud.google.com/sql/postgres) 和 [SQL Server](https://cloud.google.com/sql/sqlserver) 数据库引擎。借助 Cloud SQL 的 LangChain 集成，您可以扩展数据库应用程序，构建由 AI 驱动的体验。

本笔记本将介绍如何使用 [Cloud SQL for SQL server](https://cloud.google.com/sql/sqlserver) 通过 `MSSQLLoader` 和 `MSSQLDocumentSaver` 来[保存、加载和删除 LangChain 文档](/oss/integrations/document_loaders)。

在 [GitHub](https://github.com/googleapis/langchain-google-cloud-sql-mssql-python/) 上了解更多关于该软件包的信息。

[![在 Colab 中打开](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/googleapis/langchain-google-cloud-sql-mssql-python/blob/main/docs/document_loader.ipynb)

## 开始之前

要运行此笔记本，您需要完成以下操作：

*   [创建一个 Google Cloud 项目](https://developers.google.com/workspace/guides/create-project)
*   [启用 Cloud SQL Admin API](https://console.cloud.google.com/marketplace/product/google/sqladmin.googleapis.com)。
*   [创建一个 Cloud SQL for SQL server 实例](https://cloud.google.com/sql/docs/sqlserver/create-instance)
*   [创建一个 Cloud SQL 数据库](https://cloud.google.com/sql/docs/sqlserver/create-manage-databases)
*   [向数据库添加一个 IAM 数据库用户](https://cloud.google.com/sql/docs/sqlserver/create-manage-users)（可选）

在确认可以在此笔记本的运行时环境中访问数据库后，请填写以下值并在运行示例脚本之前运行该单元格。

```python
# @markdown 请填写您的 Cloud SQL 实例所在的 Google Cloud 区域和实例名称。
REGION = "us-central1"  # @param {type:"string"}
INSTANCE = "test-instance"  # @param {type:"string"}

# @markdown 请填写您的 Cloud SQL 实例的用户名和密码。
DB_USER = "sqlserver"  # @param {type:"string"}
DB_PASS = "password"  # @param {type:"string"}

# @markdown 请为演示指定一个数据库和表。
DATABASE = "test"  # @param {type:"string"}
TABLE_NAME = "test-default"  # @param {type:"string"}
```

### 🦜🔗 库安装

该集成位于其独立的 `langchain-google-cloud-sql-mssql` 包中，因此我们需要安装它。

```python
pip install -qU langchain-google-cloud-sql-mssql
```

**仅限 Colab**：取消注释以下单元格以重启内核，或使用按钮重启内核。对于 Vertex AI Workbench，您可以使用顶部的按钮重启终端。

```python
# # 安装后自动重启内核，以便您的环境可以访问新包
# import IPython

# app = IPython.Application.instance()
# app.kernel.do_shutdown(True)
```

### 🔐 身份验证

以登录此笔记本的 IAM 用户身份向 Google Cloud 进行身份验证，以便访问您的 Google Cloud 项目。

*   如果您使用 Colab 运行此笔记本，请使用下面的单元格并继续。
*   如果您使用 Vertex AI Workbench，请查看[此处的设置说明](https://github.com/GoogleCloudPlatform/generative-ai/tree/main/setup-env)。

```python
from google.colab import auth

auth.authenticate_user()
```

### ☁ 设置您的 Google Cloud 项目

设置您的 Google Cloud 项目，以便您可以在本笔记本中利用 Google Cloud 资源。

如果您不知道您的项目 ID，请尝试以下操作：

*   运行 `gcloud config list`。
*   运行 `gcloud projects list`。
*   查看支持页面：[查找项目 ID](https://support.google.com/googleapi/answer/7014113)。

```python
# @markdown 请在下方填写您的 Google Cloud 项目 ID，然后运行该单元格。

PROJECT_ID = "my-project-id"  # @param {type:"string"}

# 设置项目 ID
!gcloud config set project {PROJECT_ID}
```

### 💡 API 启用

`langchain-google-cloud-sql-mssql` 包要求您在 Google Cloud 项目中[启用 Cloud SQL Admin API](https://console.cloud.google.com/flows/enableapi?apiid=sqladmin.googleapis.com)。

```python
# 启用 Cloud SQL Admin API
!gcloud services enable sqladmin.googleapis.com
```

## 基本用法

### MSSQLEngine 连接池

在从 MSSQL 表保存或加载文档之前，我们首先需要配置一个到 Cloud SQL 数据库的连接池。`MSSQLEngine` 为您的 Cloud SQL 数据库配置一个 [SQLAlchemy 连接池](https://docs.sqlalchemy.org/en/20/core/pooling.html#module-sqlalchemy.pool)，使您的应用程序能够成功连接并遵循行业最佳实践。

要使用 `MSSQLEngine.from_instance()` 创建 `MSSQLEngine`，您只需要提供 4 项信息：

1.  `project_id`：Cloud SQL 实例所在的 Google Cloud 项目的项目 ID。
2.  `region`：Cloud SQL 实例所在的区域。
3.  `instance`：Cloud SQL 实例的名称。
4.  `database`：要连接的 Cloud SQL 实例上的数据库名称。
5.  `user`：用于内置数据库身份验证和登录的数据库用户。
6.  `password`：用于内置数据库身份验证和登录的数据库密码。

```python
from langchain_google_cloud_sql_mssql import MSSQLEngine

engine = MSSQLEngine.from_instance(
    project_id=PROJECT_ID,
    region=REGION,
    instance=INSTANCE,
    database=DATABASE,
    user=DB_USER,
    password=DB_PASS,
)
```

### 初始化表

通过 `MSSQLEngine.init_document_table(<table_name>)` 初始化一个具有默认模式的表。表列：

*   page_content (类型: text)
*   langchain_metadata (类型: JSON)

`overwrite_existing=True` 标志意味着新初始化的表将替换任何同名的现有表。

```python
engine.init_document_table(TABLE_NAME, overwrite_existing=True)
```

### 保存文档

使用 `MSSQLDocumentSaver.add_documents(<documents>)` 保存 LangChain 文档。要初始化 `MSSQLDocumentSaver` 类，您需要提供 2 项信息：

1.  `engine` - `MSSQLEngine` 引擎的实例。
2.  `table_name` - Cloud SQL 数据库中用于存储 LangChain 文档的表名。

```python
from langchain_core.documents import Document
from langchain_google_cloud_sql_mssql import MSSQLDocumentSaver

test_docs = [
    Document(
        page_content="Apple Granny Smith 150 0.99 1",
        metadata={"fruit_id": 1},
    ),
    Document(
        page_content="Banana Cavendish 200 0.59 0",
        metadata={"fruit_id": 2},
    ),
    Document(
        page_content="Orange Navel 80 1.29 1",
        metadata={"fruit_id": 3},
    ),
]
saver = MSSQLDocumentSaver(engine=engine, table_name=TABLE_NAME)
saver.add_documents(test_docs)
```

### 加载文档

使用 `MSSQLLoader.load()` 或 `MSSQLLoader.lazy_load()` 加载 LangChain 文档。`lazy_load` 返回一个生成器，仅在迭代期间查询数据库。要初始化 `MSSQLDocumentSaver` 类，您需要提供：

1.  `engine` - `MSSQLEngine` 引擎的实例。
2.  `table_name` - Cloud SQL 数据库中用于存储 LangChain 文档的表名。

```python
from langchain_google_cloud_sql_mssql import MSSQLLoader

loader = MSSQLLoader(engine=engine, table_name=TABLE_NAME)
docs = loader.lazy_load()
for doc in docs:
    print("Loaded documents:", doc)
```

### 通过查询加载文档

除了从表加载文档外，我们还可以选择从 SQL 查询生成的视图中加载文档。例如：

```python
from langchain_google_cloud_sql_mssql import MSSQLLoader

loader = MSSQLLoader(
    engine=engine,
    query=f"select * from \"{TABLE_NAME}\" where JSON_VALUE(langchain_metadata, '$.fruit_id') = 1;",
)
onedoc = loader.load()
onedoc
```

由 SQL 查询生成的视图可以具有与默认表不同的模式。在这种情况下，MSSQLLoader 的行为与从具有非默认模式的表加载相同。请参阅[使用自定义文档页面内容和元数据加载文档](#使用自定义文档页面内容和元数据加载文档)部分。

### 删除文档

使用 `MSSQLDocumentSaver.delete(<documents>)` 从 MSSQL 表中删除 LangChain 文档列表。

对于具有默认模式（page_content, langchain_metadata）的表，删除条件是：

如果存在列表中的某个 `document`，使得以下条件成立，则应删除 `row`：

*   `document.page_content` 等于 `row[page_content]`
*   `document.metadata` 等于 `row[langchain_metadata]`

```python
from langchain_google_cloud_sql_mssql import MSSQLLoader

loader = MSSQLLoader(engine=engine, table_name=TABLE_NAME)
docs = loader.load()
print("Documents before delete:", docs)
saver.delete(onedoc)
print("Documents after delete:", loader.load())
```

## 高级用法

### 使用自定义文档页面内容和元数据加载文档

首先，我们准备一个具有非默认模式的示例表，并用一些任意数据填充它。

```python
import sqlalchemy

with engine.connect() as conn:
    conn.execute(sqlalchemy.text(f'DROP TABLE IF EXISTS "{TABLE_NAME}"'))
    conn.commit()
    conn.execute(
        sqlalchemy.text(
            f"""
            IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[{TABLE_NAME}]') AND type in (N'U'))
                BEGIN
                    CREATE TABLE [dbo].[{TABLE_NAME}](
                        fruit_id INT IDENTITY(1,1) PRIMARY KEY,
                        fruit_name VARCHAR(100) NOT NULL,
                        variety VARCHAR(50),
                        quantity_in_stock INT NOT NULL,
                        price_per_unit DECIMAL(6,2) NOT NULL,
                        organic BIT NOT NULL
                    )
                END
            """
        )
    )
    conn.execute(
        sqlalchemy.text(
            f"""
            INSERT INTO "{TABLE_NAME}" (fruit_name, variety, quantity_in_stock, price_per_unit, organic)
            VALUES
                ('Apple', 'Granny Smith', 150, 0.99, 1),
                ('Banana', 'Cavendish', 200, 0.59, 0),
                ('Orange', 'Navel', 80, 1.29, 1);
            """
        )
    )
    conn.commit()
```

如果我们仍然使用 `MSSQLLoader` 的默认参数从此示例表加载 LangChain 文档，则加载文档的 `page_content` 将是表的第一列，而 `metadata` 将包含所有其他列的键值对。

```python
loader = MSSQLLoader(
    engine=engine,
    table_name=TABLE_NAME,
)
loader.load()
```

我们可以通过在初始化 `MSSQLLoader` 时设置 `content_columns` 和 `metadata_columns` 来指定要加载的内容和元数据。

1.  `content_columns`：要写入文档 `page_content` 的列。
2.  `metadata_columns`：要写入文档 `metadata` 的列。

例如，此处 `content_columns` 中列的值将连接成一个以空格分隔的字符串，作为加载文档的 `page_content`，而加载文档的 `metadata` 将仅包含 `metadata_columns` 中指定列的键值对。

```python
loader = MSSQLLoader(
    engine=engine,
    table_name=TABLE_NAME,
    content_columns=[
        "variety",
        "quantity_in_stock",
        "price_per_unit",
        "organic",
    ],
    metadata_columns=["fruit_id", "fruit_name"],
)
loader.load()
```

### 使用自定义页面内容和元数据保存文档

为了将 LangChain 文档保存到具有自定义元数据字段的表中，我们首先需要通过 `MSSQLEngine.init_document_table()` 创建这样一个表，并指定我们想要的 `metadata_columns` 列表。在此示例中，创建的表将具有以下列：

*   description (类型: text)：用于存储水果描述。
*   fruit_name (类型 text)：用于存储水果名称。
*   organic (类型 tinyint(1))：用于指示水果是否为有机。
*   other_metadata (类型: JSON)：用于存储水果的其他元数据信息。

我们可以将以下参数与 `MSSQLEngine.init_document_table()` 一起使用来创建表：

1.  `table_name`：Cloud SQL 数据库中用于存储 LangChain 文档的表名。
2.  `metadata_columns`：一个 `sqlalchemy.Column` 列表，指示我们需要的元数据列列表。
3.  `content_column`：用于存储 LangChain 文档 `page_content` 的列名。默认值：`page_content`。
4.  `metadata_json_column`：用于存储 LangChain 文档额外 `metadata` 的 JSON 列名。默认值：`langchain_metadata`。

```python
engine.init_document_table(
    TABLE_NAME,
    metadata_columns=[
        sqlalchemy.Column(
            "fruit_name",
            sqlalchemy.UnicodeText,
            primary_key=False,
            nullable=True,
        ),
        sqlalchemy.Column(
            "organic",
            sqlalchemy.Boolean,
            primary_key=False,
            nullable=True,
        ),
    ],
    content_column="description",
    metadata_json_column="other_metadata",
    overwrite_existing=True,
)
```

使用 `MSSQLDocumentSaver.add_documents(<documents>)` 保存文档。如本例所示，

*   `document.page_content` 将保存到 `description` 列。
*   `document.metadata.fruit_name` 将保存到 `fruit_name` 列。
*   `document.metadata.organic` 将保存到 `organic` 列。
*   `document.metadata.fruit_id` 将以 JSON 格式保存到 `other_metadata` 列。

```python
test_docs = [
    Document(
        page_content="Granny Smith 150 0.99",
        metadata={"fruit_id": 1, "fruit_name": "Apple", "organic": 1},
    ),
]
saver = MSSQLDocumentSaver(
    engine=engine,
    table_name=TABLE_NAME,
    content_column="description",
    metadata_json_column="other_metadata",
)
saver.add_documents(test_docs)
```

```python
with engine.connect() as conn:
    result = conn.execute(sqlalchemy.text(f'select * from "{TABLE_NAME}";'))
    print(result.keys())
    print(result.fetchall())
```

### 使用自定义页面内容和元数据删除文档

我们还可以通过 `MSSQLDocumentSaver.delete(<documents>)` 从具有自定义元数据列的表中删除文档。删除条件是：

如果存在列表中的某个 `document`，使得以下条件成立，则应删除 `row`：

*   `document.page_content` 等于 `row[page_content]`
*   对于 `document.metadata` 中的每个元数据字段 `k`
    *   `document.metadata[k]` 等于 `row[k]` 或 `document.metadata[k]` 等于 `row[langchain_metadata][k]`
*   在 `row` 中不存在但在 `document.metadata` 中不存在的额外元数据字段。

```python
loader = MSSQLLoader(engine=engine, table_name=TABLE_NAME)
docs = loader.load()
print("Documents before delete:", docs)
saver.delete(docs)
print("Documents after delete:", loader.load())
```
