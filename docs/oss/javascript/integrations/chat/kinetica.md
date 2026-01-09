---
title: Kinetica 语言转 SQL 聊天模型
---
本笔记本演示了如何使用 Kinetica 将自然语言转换为 SQL，并简化数据检索过程。本演示旨在展示创建和使用链的机制，而非展示 LLM 的能力。

## 概述

使用 Kinetica LLM 工作流时，您需要在数据库中创建一个 LLM 上下文，该上下文提供推理所需的信息，包括表、注释、规则和样本。调用 `ChatKinetica.load_messages_from_context()` 将从数据库中检索上下文信息，以便用于创建聊天提示。

聊天提示由一个 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.messages.SystemMessage.html" target="_blank" rel="noreferrer" class="link"><code>SystemMessage</code></a> 和多对包含样本（即问题/SQL 对）的 `HumanMessage`/`AIMessage` 组成。您可以向此列表追加样本对，但这并非旨在支持典型的自然语言对话。

当您从聊天提示创建链并执行时，Kinetica LLM 将根据输入生成 SQL。您可以选择使用 `KineticaSqlOutputParser` 来执行 SQL 并将结果作为数据框返回。

目前，支持两种用于 SQL 生成的 LLM：

1.  **Kinetica SQL-GPT**：此 LLM 基于 OpenAI ChatGPT API。
2.  **Kinetica SqlAssist**：此 LLM 专为与 Kinetica 数据库集成而构建，可以在安全的客户环境中运行。

在本演示中，我们将使用 **SqlAssist**。更多信息请参阅 [Kinetica 文档站点](https://docs.kinetica.com/7.1/sql-gpt/concepts/)。

## 先决条件

要开始使用，您需要一个 Kinetica 数据库实例。如果您没有，可以获取一个[免费开发实例](https://cloud.kinetica.com/trynow)。

您需要安装以下软件包...

```python
# 安装 LangChain 社区和核心包
pip install -qU langchain-core langchain-community

# 安装 Kinetica 数据库连接包
pip install -qU 'gpudb>=7.2.0.8' typeguard pandas tqdm

# 安装本教程所需的包
pip install -qU faker ipykernel
```

## 数据库连接

您必须在以下环境变量中设置数据库连接。如果您使用的是虚拟环境，可以在项目的 `.env` 文件中设置它们：

*   `KINETICA_URL`：数据库连接 URL
*   `KINETICA_USER`：数据库用户
*   `KINETICA_PASSWD`：安全密码。

如果您能创建 `KineticaChatLLM` 的实例，则表示连接成功。

```python
from langchain_community.chat_models.kinetica import ChatKinetica

kinetica_llm = ChatKinetica()

# 我们将创建的测试表
table_name = "demo.user_profiles"

# 我们将创建的 LLM 上下文
kinetica_ctx = "demo.test_llm_ctx"
```

## 创建测试数据

在生成 SQL 之前，我们需要创建一个 Kinetica 表和一个可以对该表进行推理的 LLM 上下文。

### 创建一些虚假的用户配置文件

我们将使用 `faker` 包创建一个包含 100 个虚假配置文件的数据框。

```python
from typing import Generator

import pandas as pd
from faker import Faker

Faker.seed(5467)
faker = Faker(locale="en-US")

def profile_gen(count: int) -> Generator:
    for id in range(0, count):
        rec = dict(id=id, **faker.simple_profile())
        rec["birthdate"] = pd.Timestamp(rec["birthdate"])
        yield rec

load_df = pd.DataFrame.from_records(data=profile_gen(100), index="id")
print(load_df.head())
```

```text
         username             name sex  \
id
0       eduardo69       Haley Beck   F
1        lbarrera  Joshua Stephens   M
2         bburton     Paula Kaiser   F
3       melissa49      Wendy Reese   F
4   melissacarter      Manuel Rios   M

                                              address                    mail  \
id
0   59836 Carla Causeway Suite 939\nPort Eugene, I...  meltondenise@yahoo.com
1   3108 Christina Forges\nPort Timothychester, KY...     erica80@hotmail.com
2                    Unit 7405 Box 3052\nDPO AE 09858  timothypotts@gmail.com
3   6408 Christopher Hill Apt. 459\nNew Benjamin, ...        dadams@gmail.com
4    2241 Bell Gardens Suite 723\nScottside, CA 38463  williamayala@gmail.com

    birthdate
id
0  1997-12-08
1  1924-08-03
2  1933-12-05
3  1988-10-26
4  1931-03-19
```

### 从数据框创建 Kinetica 表

```python
from gpudb import GPUdbTable

gpudb_table = GPUdbTable.from_df(
    load_df,
    db=kinetica_llm.kdbc,
    table_name=table_name,
    clear_table=True,
    load_data=True,
)

# 查看 Kinetica 列类型
print(gpudb_table.type_as_df())
```

```text
        name    type   properties
0   username  string     [char32]
1       name  string     [char32]
2        sex  string      [char2]
3    address  string     [char64]
4       mail  string     [char32]
5  birthdate    long  [timestamp]
```

### 创建 LLM 上下文

您可以使用 Kinetica Workbench UI 创建 LLM 上下文，也可以使用 `CREATE OR REPLACE CONTEXT` 语法手动创建。

这里我们使用 SQL 语法引用我们创建的表来创建上下文。

```python
from gpudb import GPUdbSamplesClause, GPUdbSqlContext, GPUdbTableClause

table_ctx = GPUdbTableClause(table=table_name, comment="Contains user profiles.")

samples_ctx = GPUdbSamplesClause(
    samples=[
        (
            "How many male users are there?",
            f"""
            select count(1) as num_users
                from {table_name}
                where sex = 'M';
            """,
        )
    ]
)

context_sql = GPUdbSqlContext(
    name=kinetica_ctx, tables=[table_ctx], samples=samples_ctx
).build_sql()

print(context_sql)
count_affected = kinetica_llm.kdbc.execute(context_sql)
count_affected
```

```text
CREATE OR REPLACE CONTEXT "demo"."test_llm_ctx" (
    TABLE = "demo"."user_profiles",
    COMMENT = 'Contains user profiles.'
),
(
    SAMPLES = (
        'How many male users are there?' = 'select count(1) as num_users
    from demo.user_profiles
    where sex = ''M'';' )
)
```

```text
1
```

## 使用 LangChain 进行推理

在下面的示例中，我们将根据先前创建的表和 LLM 上下文创建一个链。此链将生成 SQL 并将结果数据作为数据框返回。

### 从 Kinetica 数据库加载聊天提示

`load_messages_from_context()` 函数将从数据库中检索上下文，并将其转换为聊天消息列表，我们用它来创建 `ChatPromptTemplate`。

```python
from langchain_core.prompts import ChatPromptTemplate

# 从数据库加载上下文
ctx_messages = kinetica_llm.load_messages_from_context(kinetica_ctx)

# 添加输入提示。这是输入问题将被替换的地方。
ctx_messages.append(("human", "{input}"))

# 创建提示模板。
prompt_template = ChatPromptTemplate.from_messages(ctx_messages)
prompt_template.pretty_print()
```

```text
================================ System Message ================================

CREATE TABLE demo.user_profiles AS
(
   username VARCHAR (32) NOT NULL,
   name VARCHAR (32) NOT NULL,
   sex VARCHAR (2) NOT NULL,
   address VARCHAR (64) NOT NULL,
   mail VARCHAR (32) NOT NULL,
   birthdate TIMESTAMP NOT NULL
);
COMMENT ON TABLE demo.user_profiles IS 'Contains user profiles.';

================================ Human Message =================================

How many male users are there?

================================== Ai Message ==================================

select count(1) as num_users
    from demo.user_profiles
    where sex = 'M';

================================ Human Message =================================

{input}
```

### 创建链

此链的最后一个元素是 `KineticaSqlOutputParser`，它将执行 SQL 并返回一个数据框。这是可选的，如果我们省略它，则只返回 SQL。

```python
from langchain_community.chat_models.kinetica import (
    KineticaSqlOutputParser,
    KineticaSqlResponse,
)

chain = prompt_template | kinetica_llm | KineticaSqlOutputParser(kdbc=kinetica_llm.kdbc)
```

### 生成 SQL

我们创建的链将接收一个问题作为输入，并返回一个包含生成的 SQL 和数据的 `KineticaSqlResponse`。该问题必须与我们用于创建提示的 LLM 上下文相关。

```python
# 这里您必须提出一个与提示模板中提供的 LLM 上下文相关的问题。
response: KineticaSqlResponse = chain.invoke(
    {"input": "What are the female users ordered by username?"}
)

print(f"SQL: {response.sql}")
print(response.dataframe.head())
```

```text
SQL: SELECT username, name
    FROM demo.user_profiles
    WHERE sex = 'F'
    ORDER BY username;
      username               name
0  alexander40       Tina Ramirez
1      bburton       Paula Kaiser
2      brian12  Stefanie Williams
3    brownanna      Jennifer Rowe
4       carl19       Amanda Potts
```
