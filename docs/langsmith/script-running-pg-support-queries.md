---
title: 对 PostgreSQL 运行支持查询
sidebarTitle: Run support queries against PostgreSQL
---
该 Helm 仓库包含用于生成 LangSmith UI 当前不直接支持的输出的查询（例如，在单个查询中获取多个组织的追踪数量）。

此命令接收一个包含嵌入式用户名和密码的 PostgreSQL 连接字符串（可从密钥管理器调用中传入），并执行输入文件中的查询。在下面的示例中，我们使用的是 `support_queries/postgres` 目录下的 `pg_get_trace_counts_daily.sql` 输入文件。

## 先决条件

确保已准备好以下工具/项目。

1. kubectl

   * [https://kubernetes.io/docs/tasks/tools/](https://kubernetes.io/docs/tasks/tools/)

2. PostgreSQL 客户端

   * [https://www.postgresql.org/download/](https://www.postgresql.org/download/)

3. PostgreSQL 数据库连接信息：

   * 主机
   * 端口
   * 用户名
 * 如果使用捆绑版本，用户名为 `postgres`
   * 密码
 * 如果使用捆绑版本，密码为 `postgres`
   * 数据库名
 * 如果使用捆绑版本，数据库名为 `postgres`

4. 从您将运行迁移脚本的机器到 PostgreSQL 数据库的网络连通性。

   * 如果您使用的是捆绑版本，可能需要将 postgresql 服务端口转发到本地机器。
   * 运行 `kubectl port-forward svc/langsmith-postgres 5432:5432` 将 postgresql 服务端口转发到本地机器。

5. 运行支持查询的脚本

   * 您可以从[此处](https://github.com/langchain-ai/helm/blob/main/charts/langsmith/scripts/run_support_query_pg.sh)下载该脚本

## 运行查询脚本

运行以下命令来执行所需的查询：

```bash
sh run_support_query_pg.sh <postgres_url> --input path/to/query.sql
```

例如，如果您使用捆绑版本并进行了端口转发，命令可能如下所示：

```bash
sh run_support_query_pg.sh "postgres://postgres:postgres@localhost:5432/postgres" --input support_queries/pg_get_trace_counts_daily.sql
```

这将输出按工作区 ID 和组织 ID 统计的每日追踪数量。要将其提取到文件中，请添加标志 `--output path/to/file.csv`

## 导出使用数据

<Note>

导出使用数据需要运行 Helm chart 版本 0.11.4 或更高版本。

</Note>

### 获取客户信息

在运行导出脚本之前，您需要从 LangSmith API 检索您的客户信息。此信息是导出脚本所需的输入。

```bash
curl https://<langsmith_url>/api/v1/info
# 如果配置了子域名 / 路径前缀：
curl http://<langsmith_url/prefix/api/v1/info
```

这将返回一个包含您客户信息的 JSON 响应：

```json
{
  "version": "0.11.4",
  "license_expiration_time": "2026-08-18T19:14:34Z",
  "customer_info": {
    "customer_id": "<id>",
    "customer_name": "<name>"
  }
}
```

从此响应中提取 `customer_id` 和 `customer_name` 作为导出脚本的输入。

### 使用 jq 处理 API 响应

您可以使用 [jq](https://jqlang.org/download) 来解析 JSON 响应并设置 bash 变量以供脚本使用：

```bash
# 获取 API 响应并提取客户信息
export LANGSMITH_URL="<your_langsmith_url>"
response=$(curl -s $LANGSMITH_URL/api/v1/info)

# 使用 jq 提取 customer_id 和 customer_name
export CUSTOMER_ID=$(echo "$response" | jq -r '.customer_info.customer_id')
export CUSTOMER_NAME=$(echo "$response" | jq -r '.customer_info.customer_name')

# 验证变量是否已设置
echo "Customer ID: $CUSTOMER_ID"
echo "Customer Name: $CUSTOMER_NAME"
```

然后，您可以在导出脚本或其他命令中使用这些环境变量。

如果您没有 `jq`，请运行以下命令根据 curl 输出设置环境变量：

```bash
curl -s $LANGSMITH_URL/api/v1/info
export CUSTOMER_ID="<id>"
export CUSTOMER_NAME="<name>"
```

### 初始导出

这些脚本将使用数据导出到 CSV 文件，以便报告给 LangChain。它们还会通过分配一个回填 ID 和时间戳来跟踪导出。

要导出 LangSmith 追踪使用数据：

```bash
# 从 API 获取客户信息
export LANGSMITH_URL="<your_langsmith_url>"
export response=$(curl -s $LANGSMITH_URL/api/v1/info)
export CUSTOMER_ID=$(echo "$response" | jq -r '.customer_info.customer_id') && echo "Customer ID: $CUSTOMER_ID"
export CUSTOMER_NAME=$(echo "$response" | jq -r '.customer_info.customer_name') && echo "Customer name: $CUSTOMER_NAME"

# 使用客户信息作为变量运行导出脚本
sh run_support_query_pg.sh <postgres_url> \
  --input support_queries/postgres/pg_usage_traces_backfill_export.sql \
  --output ls_export.csv \
  -v customer_id=$CUSTOMER_ID \
  -v customer_name=$CUSTOMER_NAME
```

要导出 LangSmith 使用数据：

```bash
sh run_support_query_pg.sh <postgres_url> \
  --input support_queries/postgres/pg_usage_nodes_backfill_export.sql \
  --output lgp_export.csv \
  -v customer_id=$CUSTOMER_ID \
  -v customer_name=$CUSTOMER_NAME
```

### 状态更新

这些脚本更新您安装中的使用事件状态，以反映这些事件已被 LangChain 成功处理。

脚本需要传入相应的 `backfill_id`，您的 LangChain 代表将确认此 ID。

要更新 LangSmith 追踪使用数据：

```bash
sh run_support_query_pg.sh <postgres_url> --input support_queries/postgres/pg_usage_traces_backfill_update.sql --output export.csv -v backfill_id=<backfill_id>
```

要更新 LangSmith 使用数据：

```bash
sh run_support_query_pg.sh <postgres_url> --input support_queries/postgres/pg_usage_nodes_backfill_update.sql --output export.csv -v backfill_id=<backfill_id>
```
