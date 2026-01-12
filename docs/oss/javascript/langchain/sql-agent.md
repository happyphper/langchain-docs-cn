---
title: 构建一个 SQL 代理
sidebarTitle: SQL agent
---


## 概述

在本教程中，您将学习如何使用 LangChain [智能体（agents）](/oss/javascript/langchain/agents)构建一个能够回答关于 SQL 数据库问题的智能体。

从高层次来看，该智能体将执行以下步骤：

<Steps>

<Step title="从数据库中获取可用的表和模式（schemas）" />
<Step title="确定哪些表与问题相关" />
<Step title="获取相关表的模式" />
<Step title="根据问题和模式信息生成查询" />
<Step title="使用 LLM 双重检查查询是否存在常见错误" />
<Step title="执行查询并返回结果" />
<Step title="纠正数据库引擎返回的错误，直到查询成功" />
<Step title="根据结果制定响应" />

</Steps>

<Warning>

构建针对 SQL 数据库的问答系统需要执行模型生成的 SQL 查询。这样做存在固有风险。请确保您的数据库连接权限始终根据智能体的需求尽可能缩小范围。这将减轻（尽管不能消除）构建模型驱动系统的风险。

</Warning>

### 概念

我们将涵盖以下概念：

- 用于从 SQL 数据库读取的[工具（Tools）](/oss/javascript/langchain/tools)
- LangChain [智能体（agents）](/oss/javascript/langchain/agents)
- [人工介入（Human-in-the-loop）](/oss/javascript/langchain/human-in-the-loop)流程

## 设置

### 安装

    

::: code-group

```bash [npm]
npm i langchain @langchain/core typeorm sqlite3 zod
```
```bash [yarn]
yarn add langchain @langchain/core typeorm sqlite3 zod
```
```bash [pnpm]
pnpm add langchain @langchain/core typeorm sqlite3 zod
```

:::

    

### LangSmith
设置 [LangSmith](https://smith.langchain.com) 以检查您的链或智能体内部发生的情况。然后设置以下环境变量：

```shell
export LANGSMITH_TRACING="true"
export LANGSMITH_API_KEY="..."
```

## 1. 选择 LLM

选择一个支持[工具调用（tool-calling）](/oss/javascript/integrations/providers/overview)的模型：
<!--@include: @/snippets/javascript/chat-model-tabs-js.md-->

下面示例中显示的输出使用了 OpenAI。

## 2. 配置数据库

您将为本教程创建一个 [SQLite 数据库](https://www.sqlitetutorial.net/sqlite-sample-database/)。SQLite 是一个轻量级数据库，易于设置和使用。我们将加载 `chinook` 数据库，这是一个代表数字媒体商店的示例数据库。

为了方便起见，我们已将数据库 (`Chinook.db`) 托管在一个公共的 GCS 存储桶上。

```typescript
import fs from "node:fs/promises";
import path from "node:path";

const url = "https://storage.googleapis.com/benchmarks-artifacts/chinook/Chinook.db";
const localPath = path.resolve("Chinook.db");

async function resolveDbPath() {
  if (await fs.exists(localPath)) {
    return localPath;
  }
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Failed to download DB. Status code: ${resp.status}`);
  const buf = Buffer.from(await resp.arrayBuffer());
  await fs.writeFile(localPath, buf);
  return localPath;
}
```

## 3. 添加用于数据库交互的工具

使用 `langchain/sql_db` 中可用的 `SqlDatabase` 包装器来与数据库交互。该包装器提供了一个简单的接口来执行 SQL 查询和获取结果：

```typescript
import { SqlDatabase } from "@langchain/classic/sql_db";
import { DataSource } from "typeorm";

let db: SqlDatabase | undefined;
async function getDb() {
  if (!db) {
    const dbPath = await resolveDbFile();
    const datasource = new DataSource({ type: "sqlite", database: dbPath });
    db = await SqlDatabase.fromDataSourceParams({ appDataSource: datasource });
  }
  return db;
}

async function getSchema() {
  const db = await getDb();
  return await db.getTableInfo();
}
```

## 6. 实现人工介入审查

在执行智能体的 SQL 查询之前，检查是否存在任何意外操作或低效之处是审慎的做法。

LangChain 智能体支持内置的[人工介入中间件（human-in-the-loop middleware）](/oss/javascript/langchain/human-in-the-loop)，以增加对智能体工具调用的监督。让我们配置智能体，使其在调用 `sql_db_query` 工具时暂停以进行人工审查：

```python
from langchain.agents import create_agent
from langchain.agents.middleware import HumanInTheLoopMiddleware # [!
