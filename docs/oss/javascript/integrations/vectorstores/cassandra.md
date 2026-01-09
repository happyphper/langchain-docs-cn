---
title: Cassandra
---
<提示>
**兼容性说明**

仅适用于 Node.js 环境。
</提示>

[Apache Cassandra®](https://cassandra.apache.org/_/index.html) 是一个 NoSQL、面向行、高度可扩展且高可用的数据库。

Apache Cassandra 的[最新版本](<https://cwiki.apache.org/confluence/display/CASSANDRA/CEP-30%3A+Approximate+Nearest+Neighbor(ANN)+Vector+Search+via+Storage-Attached+Indexes>)原生支持向量相似性搜索。

## 设置

首先，安装 Cassandra Node.js 驱动程序：

<提示>
有关安装 LangChain 包的通用说明，请参阅[此部分](/oss/langchain/install)。
</提示>

```bash [npm]
npm install cassandra-driver @langchain/community @langchain/openai @langchain/core
```
根据您的数据库提供商，连接到数据库的具体细节会有所不同。我们将创建一个文档 `configConnection`，它将作为向量存储配置的一部分。

### Apache Cassandra®

向量搜索在 [Apache Cassandra® 5.0](https://cassandra.apache.org/_/Apache-Cassandra-5.0-Moving-Toward-an-AI-Driven-Future.html) 及更高版本中受支持。您可以使用标准的连接文档，例如：

```typescript
const configConnection = {
  contactPoints: ['h1', 'h2'],
  localDataCenter: 'datacenter1',
  credentials: {
    username: <...> as string,
    password: <...> as string,
  },
};
```
### Astra DB

Astra DB 是一个云原生的 Cassandra 即服务平台。

1. 创建一个 [Astra DB 账户](https://astra.datastax.com/register)。
2. 创建一个[支持向量的数据库](https://astra.datastax.com/createDatabase)。
3. 为您的数据库创建一个[令牌](https://docs.datastax.com/en/astra/docs/manage-application-tokens.html)。

```typescript
const configConnection = {
  serviceProviderArgs: {
    astra: {
      token: <...> as string,
      endpoint: <...> as string,
    },
  },
};
```
除了 `endpoint:`，您也可以提供属性 `datacenterID:` 和可选的 `regionName:`。

## 索引文档

```typescript
import { CassandraStore } from "@langchain/classic/vectorstores/cassandra";
import { OpenAIEmbeddings } from "@langchain/openai";

// configConnection 文档在上面已定义
const config = {
  ...configConnection,
  keyspace: "test",
  dimensions: 1536,
  table: "test",
  indices: [{ name: "name", value: "(name)" }],
  primaryKey: {
    name: "id",
    type: "int",
  },
  metadataColumns: [
    {
      name: "name",
      type: "text",
    },
  ],
};

const vectorStore = await CassandraStore.fromTexts(
  ["I am blue", "Green yellow purple", "Hello there hello"],
  [
    { id: 2, name: "2" },
    { id: 1, name: "1" },
    { id: 3, name: "3" },
  ],
  new OpenAIEmbeddings(),
  cassandraConfig
);
```
## 查询文档

```typescript
const results = await vectorStore.similaritySearch("Green yellow purple", 1);
```
或带过滤器的查询：

```typescript
const results = await vectorStore.similaritySearch("B", 1, { name: "Bubba" });
```
## 向量类型

Cassandra 支持 `cosine`（默认）、`dot_product` 和 `euclidean` 相似性搜索；这在向量存储首次创建时定义，并在构造函数参数 `vectorType` 中指定，例如：

```typescript
...,
vectorType: "dot_product",
...
```
## 索引

从版本 5 开始，Cassandra 引入了存储附加索引（Storage Attached Indexes，SAI）。这些索引允许在不指定分区键的情况下进行 `WHERE` 过滤，并允许使用其他运算符类型，例如非等值比较。您可以使用 `indices` 参数定义这些索引，该参数接受零个或多个字典，每个字典包含 `name` 和 `value` 条目。

索引是可选的，但如果要在非分区列上使用过滤查询，则需要索引。

- `name` 条目是对象名称的一部分；在名为 `test_table` 的表上，一个 `name: "some_column"` 的索引将被命名为 `idx_test_table_some_column`。
- `value` 条目是创建索引的列，用 `(` 和 `)` 包围。对于上述列 `some_column`，应指定为 `value: "(some_column)"`。
- 可选的 `options` 条目是一个映射，传递给 `CREATE CUSTOM INDEX` 语句的 `WITH OPTIONS =` 子句。此映射上的具体条目取决于索引类型。

```typescript
indices: [{ name: "some_column", value: "(some_column)" }],
```
## 高级过滤

默认情况下，过滤器使用等值 `=` 应用。对于那些有 `indices` 条目的字段，您可以提供一个 `operator`，其字符串值为索引支持的值；在这种情况下，您可以指定一个或多个过滤器，可以是单个对象或列表（它们将被 `AND` 连接在一起）。例如：

```typescript
{ name: "create_datetime", operator: ">", value: some_datetime_variable }
```
或

```typescript
[
  { userid: userid_variable },
  { name: "create_datetime", operator: ">", value: some_date_variable },
];
```
`value` 可以是单个值或数组。如果它不是数组，或者 `value` 中只有一个元素，生成的查询将类似于 `${name} ${operator} ?`，并将 `value` 绑定到 `?`。

如果 `value` 数组中有多个元素，则会计算 `name` 中未加引号的 `?` 的数量，并从 `value` 的长度中减去该数量，然后将这个数量的 `?` 放在运算符的右侧；如果有多个 `?`，它们将被封装在 `(` 和 `)` 中，例如 `(?, ?, ?)`。

这便于在运算符左侧绑定值，这对于某些函数很有用；例如，一个地理距离过滤器：

```typescript
{
  name: "GEO_DISTANCE(coord, ?)",
  operator: "<",
  value: [new Float32Array([53.3730617,-6.3000515]), 10000],
},
```
## 数据分区和复合键

在某些系统中，您可能出于各种原因希望对数据进行分区，例如按用户或会话分区。Cassandra 中的数据总是分区的；默认情况下，此库将按第一个主键字段进行分区。您可以指定构成记录主（唯一）键的多个列，并可选择指示哪些字段应作为分区键的一部分。例如，向量存储可以按 `userid` 和 `collectionid` 分区，附加字段 `docid` 和 `docpart` 使单个条目唯一：

```typescript
...,
primaryKey: [
  {name: "userid", type: "text", partition: true},
  {name: "collectionid", type: "text", partition: true},
  {name: "docid", type: "text"},
  {name: "docpart", type: "int"},
],
...
```
搜索时，您可以在过滤器上包含分区键，而无需为这些列定义 `indices`；您不需要指定所有分区键，但必须首先指定键中的那些。在上面的示例中，您可以指定过滤器 `{userid: userid_variable}` 和 `{userid: userid_variable, collectionid: collectionid_variable}`，但如果您想指定仅包含 `{collectionid: collectionid_variable}` 的过滤器，则必须将 `collectionid` 包含在 `indices` 列表中。

## 其他配置选项

在配置文档中，提供了更多可选参数；它们的默认值为：

```typescript
...,
maxConcurrency: 25,
batchSize: 1,
withClause: "",
...
```

| 参数             | 用途                                                                                                                                                                                                                         |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `maxConcurrency` | 在给定时间内将向 Cassandra 发送多少个并发请求。                                                                                                                                                                              |
| `batchSize`      | 在单个请求中将向 Cassandra 发送多少个文档。当使用值 > 1 时，您应确保您的批次大小不会超过 Cassandra 参数 `batch_size_fail_threshold_in_kb`。批次是未记录的。                                                                  |
| `withClause`     | Cassandra 表可以使用可选的 `WITH` 子句创建；这通常不需要，但为了完整性而提供。                                                                                                                                               |

## 相关链接

- 向量存储[概念指南](/oss/integrations/vectorstores)
- 向量存储[操作指南](/oss/integrations/vectorstores)
