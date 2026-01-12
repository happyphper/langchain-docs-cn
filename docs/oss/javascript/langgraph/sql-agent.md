---
title: 构建自定义 SQL 代理
sidebarTitle: Custom SQL agent
---


在本教程中，我们将使用 LangGraph 构建一个能够回答关于 SQL 数据库问题的自定义智能体（agent）。

LangChain 提供了内置的[智能体](/oss/javascript/langchain/agents)实现，这些实现使用了 [LangGraph](/oss/javascript/langgraph/overview) 的原语。如果需要更深度的定制，可以直接在 LangGraph 中实现智能体。本指南演示了一个 SQL 智能体的示例实现。你也可以查看[这里](/oss/javascript/langchain/sql-agent)的教程，它使用更高层级的 LangChain 抽象来构建 SQL 智能体。

<Warning>

构建基于 SQL 数据库的问答系统需要执行模型生成的 SQL 查询。这样做存在固有的风险。请确保你的数据库连接权限始终根据智能体的需求被限制在尽可能小的范围内。这将减轻（尽管不能完全消除）构建模型驱动系统的风险。

</Warning>

[预构建的智能体](/oss/javascript/langchain/sql-agent)让我们能够快速开始，但我们依赖系统提示（system prompt）来约束其行为——例如，我们指示智能体总是从“列出表”工具开始，并且在执行查询之前总是运行查询检查器工具。

在 LangGraph 中，我们可以通过自定义智能体来实施更高程度的控制。在这里，我们实现一个简单的 ReAct 智能体设置，为特定的工具调用设置专用节点。我们将使用与预构建智能体相同的[状态（state）](/oss/javascript/langgraph/state)。

### 概念

我们将涵盖以下概念：

- 用于从 SQL 数据库读取的[工具（Tools）](/oss/javascript/langchain/tools)
- LangGraph 的[图 API（Graph API）](/oss/javascript/langgraph/graph-api)，包括状态（state）、节点（nodes）、边（edges）和条件边（conditional edges）。
- [人工介入（Human-in-the-loop）](/oss/javascript/langgraph/interrupts)流程

## 设置

### 安装

    

::: code-group

```bash [npm]
npm i langchain @langchain/core @langchain/classic @langchain/langgraph @langchain/openai typeorm sqlite3 zod
```
```bash [yarn]
yarn add langchain @langchain/core @langchain/classic @langchain/langgraph @langchain/openai typeorm sqlite3 zod
```
```bash [pnpm]
pnpm add langchain @langchain/core @langchain/classic @langchain/langgraph @langchain/openai typeorm sqlite3 zod
```

:::

    

### LangSmith
设置 [LangSmith](https://smith.langchain.com) 以检查你的链（chain）或智能体内部发生的情况。然后设置以下环境变量：

```shell
export LANGSMITH_TRACING="true"
export LANGSMITH_API_KEY="..."
```

## 1. 选择 LLM

选择一个支持[工具调用（tool-calling）](/oss/javascript/integrations/providers/overview)的模型：

<!--@include: @/snippets/javascript/chat-model-tabs-js.md-->

下面示例中显示的输出使用了 OpenAI。

## 2. 配置数据库

你将为本教程创建一个 [SQLite 数据库](https://www.sqlitetutorial.net/sqlite-sample-database/)。SQLite 是一个轻量级数据库，易于设置和使用。我们将加载 `chinook` 数据库，这是一个代表数字媒体商店的示例数据库。

为了方便起见，我们已将数据库 (`Chinook.db`) 托管在一个公共的 GCS 存储桶上。

```typescript
import fs from "node:fs/promises";
import path from "node:path";

const url = "https://storage.googleapis.com/benchmarks-artifacts/chinook/Chinook.db";
const localPath = path.resolve("Chinook.db");

async function resolveDbPath() {
  const exists = await fs.access(localPath).then(() => true).catch(() => false);
  if (exists) {
    console.log(`${localPath} already exists, skipping download.`);
    return localPath;
  }
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Failed to download DB. Status code: ${resp.status}`);
  const buf = Buffer.from(await resp.arrayBuffer());
  await fs.writeFile(localPath, buf);
  console.log(`File downloaded and saved as ${localPath}`);
  return localPath;
}
```

我们将使用 `@langchain/classic/sql_db` 模块中一个方便的 SQL 数据库包装器来与数据库交互。该包装器提供了一个简单的接口来执行 SQL 查询和获取结果：

```typescript
import { SqlDatabase } from "@langchain/classic/sql_db";
import { DataSource } from "typeorm";

const dbPath = await resolveDbPath();
const datasource = new DataSource({ type: "sqlite", database: dbPath });
const db = await SqlDatabase.fromDataSourceParams({ appDataSource: datasource });
const dialect = db.appDataSourceOptions.type;

console.log(`Dialect: ${dialect}`);
const tableNames = db.allTables.map(t => t.tableName);
console.log(`Available tables: ${tableNames.join(", ")}`);
const sampleResults = await db.run("SELECT * FROM Artist LIMIT 5;");
console.log(`Sample output: ${sampleResults}`);
```
```
Dialect: sqlite
Available tables: Album, Artist, Customer, Employee, Genre, Invoice, InvoiceLine, MediaType, Playlist, PlaylistTrack, Track
Sample output: [{"ArtistId":1,"Name":"AC/DC"},{"ArtistId":2,"Name":"Accept"},{"ArtistId":3,"Name":"Aerosmith"},{"ArtistId":4,"Name":"Alanis Morissette"},{"ArtistId":5,"Name":"Alice In Chains"}]
```

## 3. 添加用于数据库交互的工具

我们将创建自定义工具来与数据库交互：

```typescript
import { tool } from "langchain";
import { z } from "zod";

// 列出所有表的工具
const listTablesTool = tool(
  async () => {
    const tableNames = db.allTables.map(t => t.tableName);
    return tableNames.join(", ");
  },
  {
    name: "sql_db_list_tables",
    description: "输入是一个空字符串，输出是数据库中表的逗号分隔列表。",
    schema: z.object({}),
  }
);

// 获取特定表模式的工具
const getSchemaTool = tool(
  async ({ table_names }) => {
    const tables = table_names.split(",").map(t => t.trim());
    return await db.getTableInfo(tables);
  },
  {
    name: "sql_db_schema",
    description: "此工具的输入是一个逗号分隔的表名列表，输出是这些表的模式和示例行。务必先调用 sql_db_list_tables 来确认这些表确实存在！示例输入：table1, table2, table3",
    schema: z.object({
      table_names: z.string().describe("逗号分隔的表名列表"),
    }),
  }
);

// 执行 SQL 查询的工具
const queryTool = tool(
  async ({ query }) => {
    try {
      const result = await db.run(query);
      return typeof result === "string" ? result : JSON.stringify(result);
    } catch (error) {
      return `Error: ${error.message}`;
    }
  },
  {
    name: "sql_db_query",
    description: "此工具的输入是一个详细且正确的 SQL 查询，输出是数据库的结果。如果查询不正确，将返回错误信息。如果返回错误，请重写查询、检查查询，然后重试。",
    schema: z.object({
      query: z.string().describe("要执行的 SQL 查询"),
    }),
  }
);

const tools = [listTablesTool, getSchemaTool, queryTool];

for (const tool of tools) {
  console.log(`${tool.name}: ${tool.description}\n`);
}
```
```
sql_db_list_tables: 输入是一个空字符串，输出是数据库中表的逗号分隔列表。

sql_db_schema: 此工具的输入是一个逗号分隔的表名列表，输出是这些表的模式和示例行。务必先调用 sql_db_list_tables 来确认这些表确实存在！示例输入：table1, table2, table3

sql_db_query: 此工具的输入是一个详细且正确的 SQL 查询，输出是数据库的结果。如果查询不正确，将返回错误信息。如果返回错误，请重写查询、检查查询，然后重试。
```

## 4. 定义应用步骤

我们为以下步骤构建专用节点：

- 列出数据库表
- 调用“获取模式”工具
- 生成查询
- 检查查询

将这些步骤放在专用节点中，让我们能够（1）在需要时强制进行工具调用，以及（2）自定义与每个步骤关联的提示（prompt）。

:::js

```typescript

// 为模式和查询执行创建工具节点
const getSchemaNode = new ToolNode([getSchemaTool]);
const runQueryNode = new ToolNode([queryTool]);

// 示例：创建一个预定的工具调用
async function listTables(state: typeof MessagesAnnotation.State) {
  const toolCall = {
name: "sql_db_list_tables",
args: {},
id: "abc123",
type: "tool_call" as const,
  };
  const toolCallMessage = new AIMessage({
content: "",
tool_calls: [toolCall],
  });

  const toolMessage = await listTablesTool.invoke({});
  const response = new AIMessage(`Available tables: ${toolMessage}`);

  return { messages: [toolCallMessage, new ToolMessage({ content: toolMessage, tool_call_id: "abc123" }), response] };
}

// 示例：强制模型创建一个工具调用
async function callGetSchema(state: typeof MessagesAnnotation.State) {
  const llmWithTools = model.bindTools([getSchemaTool], {
tool_choice: "any",
  });
  const response = await llmWithTools.invoke(state.messages);

  return { messages: [response] };
}

const topK = 5;

const generateQuerySystemPrompt = `
You are an agent designed to interact with a SQL database.
Given an input question, create a syntactically correct ${dialect}
query to run, then look at the results of the query and return the answer. Unless
the user specifies a specific number of examples they wish to obtain, always limit
your query to at most ${topK} results.

You can order the results by a relevant column to return the most interesting
examples in the database. Never query for all the columns from a specific table,
only ask for the relevant columns given the question.

DO NOT make any DML statements (INSERT, UPDATE, DELETE, DROP etc.) to the database.
`;

async function generateQuery(state: typeof MessagesAnnotation.State) {
  const systemMessage = new SystemMessage(generateQuerySystemPrompt);
  // 我们在这里不强制进行工具调用，以允许模型在获得解决方案时自然响应。
  const llmWithTools = model.bindTools([queryTool]);
  const response = await llmWithTools.invoke([
