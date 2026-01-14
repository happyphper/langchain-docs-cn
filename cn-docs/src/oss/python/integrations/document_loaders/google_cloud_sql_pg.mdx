---
title: Google Cloud SQL for PostgreSQL
---
> [Cloud SQL for PostgreSQL](https://cloud.google.com/sql/docs/postgres) 是一项全托管的数据库服务，可帮助您在 Google Cloud Platform 上设置、维护、管理和运维您的 PostgreSQL 关系型数据库。借助 Cloud SQL for PostgreSQL 的 LangChain 集成，扩展您的数据库应用程序以构建由 AI 驱动的体验。

本笔记本将介绍如何使用 `Cloud SQL for PostgreSQL` 通过 `PostgresLoader` 类加载文档。

在 [GitHub](https://github.com/googleapis/langchain-google-cloud-sql-pg-python/) 上了解更多关于该软件包的信息。

[![在 Colab 中打开](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/googleapis/langchain-google-cloud-sql-pg-python/blob/main/docs/document_loader.ipynb)

## 开始之前

要运行此笔记本，您需要完成以下操作：

*   [创建一个 Google Cloud 项目](https://developers.google.com/workspace/guides/create-project)
*   [启用 Cloud SQL Admin API](https://console.cloud.google.com/marketplace/product/google/sqladmin.googleapis.com)
*   [创建一个 Cloud SQL for PostgreSQL 实例](https://cloud.google.com/sql/docs/postgres/create-instance)
*   [创建一个 Cloud SQL for PostgreSQL 数据库](https://cloud.google.com/sql/docs/postgres/create-manage-databases)
*   [向数据库添加用户](https://cloud.google.com/sql/docs/postgres/create-manage-users)

### 🦜🔗 库安装

安装集成库 `langchain_google_cloud_sql_pg`。

```python
pip install -qU  langchain_google_cloud_sql_pg
```

**仅限 Colab：** 取消注释以下单元格以重启内核，或使用按钮重启内核。对于 Vertex AI Workbench，您可以使用顶部的按钮重启终端。

```python
# # 安装后自动重启内核，以便您的环境可以访问新的包
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
# @title 项目 { display-mode: "form" }
PROJECT_ID = "gcp_project_id"  # @param {type:"string"}

# 设置项目 ID
! gcloud config set project {PROJECT_ID}
```

## 基本用法

### 设置 Cloud SQL 数据库值

在 [Cloud SQL 实例页面](https://console.cloud.google.com/sql/instances) 中找到您的数据库变量。

```python
# @title 在此处设置您的值 { display-mode: "form" }
REGION = "us-central1"  # @param {type: "string"}
INSTANCE = "my-primary"  # @param {type: "string"}
DATABASE = "my-database"  # @param {type: "string"}
TABLE_NAME = "vector_store"  # @param {type: "string"}
```

### Cloud SQL 引擎

将 PostgreSQL 配置为文档加载器的要求和参数之一是 `PostgresEngine` 对象。`PostgresEngine` 为您的 Cloud SQL for PostgreSQL 数据库配置一个连接池，使您的应用程序能够成功连接并遵循行业最佳实践。

要使用 `PostgresEngine.from_instance()` 创建 `PostgresEngine`，您只需要提供 4 项内容：

1.  `project_id`：Cloud SQL 实例所在的 Google Cloud 项目的项目 ID。
2.  `region`：Cloud SQL 实例所在的区域。
3.  `instance`：Cloud SQL 实例的名称。
4.  `database`：要连接的 Cloud SQL 实例上的数据库名称。

默认情况下，将使用 [IAM 数据库身份验证](https://cloud.google.com/sql/docs/postgres/iam-authentication) 作为数据库身份验证方法。此库使用属于从环境获取的 [应用程序默认凭据 (ADC)](https://cloud.google.com/docs/authentication/application-default-credentials) 的 IAM 主体。

也可以选择使用 [内置数据库身份验证](https://cloud.google.com/sql/docs/postgres/users)，即使用用户名和密码访问 Cloud SQL 数据库。只需向 `PostgresEngine.from_instance()` 提供可选的 `user` 和 `password` 参数：

*   `user`：用于内置数据库身份验证和登录的数据库用户
*   `password`：用于内置数据库身份验证和登录的数据库密码。

**注意**：本教程演示异步接口。所有异步方法都有对应的同步方法。

```python
from langchain_google_cloud_sql_pg import PostgresEngine

engine = await PostgresEngine.afrom_instance(
    project_id=PROJECT_ID,
    region=REGION,
    instance=INSTANCE,
    database=DATABASE,
)
```

### 创建 PostgresLoader

```python
from langchain_google_cloud_sql_pg import PostgresLoader

# 创建一个基本的 PostgreSQL 对象
loader = await PostgresLoader.create(engine, table_name=TABLE_NAME)
```

### 通过默认表加载文档

加载器从表中返回一个 Document 列表，使用第一列作为 page_content，所有其他列作为元数据。默认表的第一列将是 page_content，第二列是元数据 (JSON)。每一行成为一个文档。请注意，如果您希望文档具有 ID，您需要自行添加。

```python
from langchain_google_cloud_sql_pg import PostgresLoader

# 创建一个基本的 PostgresLoader 对象
loader = await PostgresLoader.create(engine, table_name=TABLE_NAME)

docs = await loader.aload()
print(docs)
```

### 通过自定义表/元数据或自定义页面内容列加载文档

```python
loader = await PostgresLoader.create(
    engine,
    table_name=TABLE_NAME,
    content_columns=["product_name"],  # 可选
    metadata_columns=["id"],  # 可选
)
docs = await loader.aload()
print(docs)
```

### 设置页面内容格式

加载器返回一个 Document 列表，每行一个文档，页面内容采用指定的字符串格式，例如文本（空格分隔的连接）、JSON、YAML、CSV 等。JSON 和 YAML 格式包含标题，而文本和 CSV 不包含字段标题。

```python
loader = await PostgresLoader.create(
    engine,
    table_name="products",
    content_columns=["product_name", "description"],
    format="YAML",
)
docs = await loader.aload()
print(docs)
```
