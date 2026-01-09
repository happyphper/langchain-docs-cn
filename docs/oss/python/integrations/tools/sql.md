---
title: SqlToolkit
---
这将帮助你开始使用 [SqlToolkit](/oss/langchain/tools#toolkits)。关于 SqlToolkit 所有功能和配置的详细文档，请前往 [API 参考](https://api.js.langchain.com/classes/langchain.agents_toolkits_sql.SqlToolkit.html)。你也可以在此处找到 Python 等效版本的文档。

此工具包包含以下工具：

| 名称              | 描述                                                                                                                                                                                                                               |
|-------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `query-sql`       | 此工具的输入是一个详细且正确的 SQL 查询，输出是数据库的结果。如果查询不正确，将返回错误消息。如果返回错误，请重写查询、检查查询，然后重试。 |
| `info-sql`        | 此工具的输入是一个逗号分隔的表名列表，输出是这些表的模式和示例行。务必先调用 list-tables-sql 来确保这些表确实存在！示例输入："table1, table2, table3"。          |
| `list-tables-sql` | 输入是一个空字符串，输出是数据库中表的逗号分隔列表。                                                                                                                                                     |
| `query-checker`   | 在执行查询之前，使用此工具再次检查你的查询是否正确。在使用 query-sql 执行查询之前，务必先使用此工具！                                                                                                 |

此工具包可用于在 SQL 数据库上提问、执行查询、验证查询等。

## 设置

此示例使用 Chinook 数据库，这是一个可用于 SQL Server、Oracle、MySQL 等的示例数据库。要设置它，请按照[这些说明](https://database.guide/2-sample-databases-sqlite/)操作，将 `.db` 文件放在你的代码所在的目录中。

如果你想从单个工具的运行中获得自动化追踪，也可以通过取消注释以下内容来设置你的 [LangSmith](https://docs.langchain.com/langsmith/home) API 密钥：

```typescript
process.env.LANGSMITH_TRACING="true"
process.env.LANGSMITH_API_KEY="your-api-key"
```

### 安装

此工具包位于 `langchain` 包中。你还需要安装 `typeorm` 对等依赖项。

::: code-group

```bash [npm]
npm install langchain @langchain/core typeorm
```

```bash [yarn]
yarn add langchain @langchain/core typeorm
```

```bash [pnpm]
pnpm add langchain @langchain/core typeorm
```

:::

## 实例化

首先，我们需要定义要在工具包中使用的 LLM。

```typescript
// @lc-docs-hide-cell

import { ChatOpenAI } from "@langchain/openai";

const llm = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0,
})
```

```typescript
import { SqlToolkit } from "@langchain/classic/agents/toolkits/sql"
import { DataSource } from "typeorm";
import { SqlDatabase } from "@langchain/classic/sql_db";

const datasource = new DataSource({
  type: "sqlite",
  database: "../../../../../../Chinook.db", // 替换为你的数据库链接
});
const db = await SqlDatabase.fromDataSourceParams({
  appDataSource: datasource,
});

const toolkit = new SqlToolkit(db, llm);
```

## 工具

查看可用工具：

```typescript
const tools = toolkit.getTools();

console.log(tools.map((tool) => ({
  name: tool.name,
  description: tool.description,
})))
```

```text
[
  {
    name: 'query-sql',
    description: 'Input to this tool is a detailed and correct SQL query, output is a result from the database.\n' +
      '  If the query is not correct, an error message will be returned.\n' +
      '  If an error is returned, rewrite the query, check the query, and try again.'
  },
  {
    name: 'info-sql',
    description: 'Input to this tool is a comma-separated list of tables, output is the schema and sample rows for those tables.\n' +
      '    Be sure that the tables actually exist by calling list-tables-sql first!\n' +
      '\n' +
      '    Example Input: "table1, table2, table3.'
  },
  {
    name: 'list-tables-sql',
    description: 'Input is an empty string, output is a comma-separated list of tables in the database.'
  },
  {
    name: 'query-checker',
    description: 'Use this tool to double check if your query is correct before executing it.\n' +
      '    Always use this tool before executing a query with query-sql!'
  }
]
```

## 在智能体中使用

首先，确保已安装 LangGraph：

::: code-group

```bash [npm]
npm install @langchain/langgraph
```

```bash [yarn]
yarn add @langchain/langgraph
```

```bash [pnpm]
pnpm add @langchain/langgraph
```

:::

```typescript
import { createAgent } from "@langchain/classic"

const agentExecutor = createAgent({ llm, tools });
```

```typescript
const exampleQuery = "Can you list 10 artists from my database?"

const events = await agentExecutor.stream(
  { messages: [["user", exampleQuery]]},
  { streamMode: "values", }
)

for await (const event of events) {
  const lastMsg = event.messages[event.messages.length - 1];
  if (lastMsg.tool_calls?.length) {
    console.dir(lastMsg.tool_calls, { depth: null });
  } else if (lastMsg.content) {
    console.log(lastMsg.content);
  }
}
```

```json
[
  {
    name: 'list-tables-sql',
    args: {},
    type: 'tool_call',
    id: 'call_LqsRA86SsKmzhRfSRekIQtff'
  }
]
Album, Artist, Customer, Employee, Genre, Invoice, InvoiceLine, MediaType, Playlist, PlaylistTrack, Track
[
  {
    name: 'query-checker',
    args: { input: 'SELECT * FROM Artist LIMIT 10;' },
    type: 'tool_call',
    id: 'call_MKBCjt4gKhl5UpnjsMHmDrBH'
  }
]
The SQL query you provided is:

\`\`\`sql
SELECT * FROM Artist LIMIT 10;
\`\`\`

This query is straightforward and does not contain any of the common mistakes listed. It simply selects all columns from the `Artist` table and limits the result to 10 rows.

Therefore, there are no mistakes to correct, and the original query can be reproduced as is:

\`\`\`sql
SELECT * FROM Artist LIMIT 10;
\`\`\`
[
  {
    name: 'query-sql',
    args: { input: 'SELECT * FROM Artist LIMIT 10;' },
    type: 'tool_call',
    id: 'call_a8MPiqXPMaN6yjN9i7rJctJo'
  }
]
[{"ArtistId":1,"Name":"AC/DC"},{"ArtistId":2,"Name":"Accept"},{"ArtistId":3,"Name":"Aerosmith"},{"ArtistId":4,"Name":"Alanis Morissette"},{"ArtistId":5,"Name":"Alice In Chains"},{"ArtistId":6,"Name":"Antônio Carlos Jobim"},{"ArtistId":7,"Name":"Apocalyptica"},{"ArtistId":8,"Name":"Audioslave"},{"ArtistId":9,"Name":"BackBeat"},{"ArtistId":10,"Name":"Billy Cobham"}]
Here are 10 artists from your database:

1. AC/DC
2. Accept
3. Aerosmith
4. Alanis Morissette
5. Alice In Chains
6. Antônio Carlos Jobim
7. Apocalyptica
8. Audioslave
9. BackBeat
10. Billy Cobham
```

---

## API 参考

关于 SqlToolkit 所有功能和配置的详细文档，请前往 [API 参考](https://api.js.langchain.com/classes/langchain.agents_toolkits_sql.SqlToolkit.html)。
