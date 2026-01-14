---
title: 批量导出追踪数据
sidebarTitle: Bulk export trace data
---

<Info>

<strong>计划限制适用</strong>

请注意，数据导出功能仅适用于 [LangSmith Plus 或企业版](https://www.langchain.com/pricing-langsmith)。

</Info>

LangSmith 的批量数据导出功能允许您将追踪数据导出到外部目的地。如果您想在 BigQuery、Snowflake、RedShift、Jupyter Notebooks 等工具中离线分析数据，这将非常有用。

可以针对特定的 LangSmith 项目和日期范围启动导出。一旦批量导出启动，系统将处理导出流程的编排和[容错性](#failure-modes-and-retry-policy)。

导出数据可能需要一些时间，具体取决于数据量的大小。LangSmith 还对可以同时运行的导出数量有限制。批量导出的运行超时时间为 72 小时，详情请参阅[自动重试行为](#automatic-retry-behavior)。

## 目的地

目前，我们支持导出到您提供的 S3 存储桶或兼容 S3 API 的存储桶。数据将以 [Parquet](https://parquet.apache.org/docs/overview/) 列式格式导出。这种格式可以让您轻松地将数据导入其他系统。数据导出将包含与[运行数据格式](/langsmith/run-data-format)等效的数据字段。

## 导出数据

### 目的地 - 提供 S3 存储桶

要导出 LangSmith 数据，您需要提供一个 S3 存储桶作为数据导出的目的地。

导出需要以下信息：

- **存储桶名称**：数据将导出到的 S3 存储桶的名称。
- **前缀**：存储桶内数据将导出到的根前缀。
- **S3 区域**：存储桶的区域 - 对于 AWS S3 存储桶是必需的。
- **端点 URL**：S3 存储桶的端点 URL - 对于兼容 S3 API 的存储桶是必需的。
- **访问密钥**：S3 存储桶的访问密钥。
- **密钥**：S3 存储桶的密钥。
- **在路径中包含存储桶名称**（可选）：是否将存储桶名称作为路径前缀的一部分。对于新目的地或路径中已包含存储桶名称的情况，默认为 `false`。为保持向后兼容性或使用需要在路径中包含存储桶名称的存储系统时，请设置为 `true`。

我们支持任何兼容 S3 的存储桶，对于非 AWS 存储桶（如 GCS 或 MinIO），您需要提供端点 URL。

### 准备目的地

<Note>

<strong>对于自托管和欧盟区域部署</strong>

对于自托管安装或欧盟区域的组织，请在下面的请求中适当更新 LangSmith URL。
对于欧盟区域，请使用 `eu.api.smith.langchain.com`。

</Note>

#### 所需权限

`backend` 和 `queue` 服务都需要对目标存储桶具有写入权限：

- `backend` 服务在创建导出目的地时，会尝试向目标存储桶写入一个测试文件。如果具有相应权限，它将删除该测试文件（删除权限是可选的）。
- `queue` 服务负责批量导出的执行以及将文件上传到存储桶。

**AWS S3 权限**

最小的 AWS S3 权限策略依赖于以下权限：

- `s3:PutObject`（必需）：允许向存储桶写入 Parquet 文件。
- `s3:DeleteObject`（可选）：在创建目的地时清理测试文件。如果没有此权限，文件将在目的地创建后留在 `/tmp` 目录下。
- `s3:GetObject`（可选但推荐）：在写入后验证文件大小。
- `s3:AbortMultipartUpload`（可选但推荐）：避免残留的多部分上传。

最小 IAM 策略示例：

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject"
      ],
      "Resource": [
        "arn:aws:s3:::YOUR_BUCKET_NAME/*"
      ]
    }
  ]
}
```

包含额外权限的推荐 IAM 策略示例：

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:GetObject"
      ],
      "Resource": [
        "arn:aws:s3:::YOUR_BUCKET_NAME/*"
      ]
    }
  ]
}
```

**Google Cloud Storage (GCS) 权限**

当将 GCS 与 S3 兼容的 XML API 一起使用时，需要以下 IAM 权限：

- `storage.objects.create` (必需)：允许向存储桶写入文件。
- `storage.objects.delete` (可选)：在创建目标期间清理测试文件。如果缺少此权限，文件将在目标创建后保留在 `/tmp` 目录下。
- `storage.objects.get` (可选但推荐)：在写入后验证文件大小。

这些权限可以通过预定义的“Storage Object Admin”角色或自定义角色授予。

#### 创建目标

以下示例演示了如何使用 cURL 创建目标。请将占位符值替换为您的实际配置详情。
请注意，凭证将以加密形式安全地存储在我们的系统中。

```bash
curl --request POST \
  --url 'https://api.smith.langchain.com/api/v1/bulk-exports/destinations' \
  --header 'Content-Type: application/json' \
  --header 'X-API-Key: YOUR_API_KEY' \
  --header 'X-Tenant-Id: YOUR_WORKSPACE_ID' \
  --data '{
    "destination_type": "s3",
    "display_name": "My S3 Destination",
    "config": {
      "bucket_name": "your-s3-bucket-name",
      "prefix": "root_folder_prefix",
      "region": "your aws s3 region",
      "endpoint_url": "your endpoint url for s3 compatible buckets",
      "include_bucket_in_prefix": true
    },
    "credentials": {
      "access_key_id": "YOUR_S3_ACCESS_KEY_ID",
      "secret_access_key": "YOUR_S3_SECRET_ACCESS_KEY"
    }
  }'
```

使用返回的 `id` 在后续的批量导出操作中引用此目标。

**如果在创建目标时遇到错误，请参阅 [调试目标错误](#debugging-destination-errors) 了解如何调试此问题的详细信息。**

#### 凭证配置

<Note>
<strong>需要 LangSmith Helm 版本 >= `0.10.34` (应用版本 >= `0.10.91`)</strong>
</Note>

除了静态的 `access_key_id` 和 `secret_access_key` 之外，我们还支持以下额外的凭证格式：

- 要使用包含 AWS 会话令牌的 [临时凭证](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp_use-resources.html)，
  在创建批量导出目标时，请额外提供 `credentials.session_token` 键。
- (仅限自托管)：要使用基于环境的凭证，例如配合 [AWS IAM Roles for Service Accounts](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html) (IRSA)，
  在创建批量导出目标时，请从请求中省略 `credentials` 键。
  在这种情况下，将按照库定义的顺序检查 [标准的 Boto3 凭证位置](https://boto3.amazonaws.com/v1/documentation/api/latest/guide/configuration.html#credentials)。

#### AWS S3 存储桶

对于 AWS S3，您可以省略 `endpoint_url`，并提供与您的存储桶区域匹配的区域。

```bash
curl --request POST \
  --url 'https://api.smith.langchain.com/api/v1/bulk-exports/destinations' \
  --header 'Content-Type: application/json' \
  --header 'X-API-Key: YOUR_API_KEY' \
  --header 'X-Tenant-Id: YOUR_WORKSPACE_ID' \
  --data '{
    "destination_type": "s3",
    "display_name": "My AWS S3 Destination",
    "config": {
      "bucket_name": "my_bucket",
      "prefix": "data_exports",
      "region": "us-east-1"
    },
    "credentials": {
      "access_key_id": "YOUR_S3_ACCESS_KEY_ID",
      "secret_access_key": "YOUR_S3_SECRET_ACCESS_KEY"
    }
  }'
```

#### Google GCS XML S3 兼容存储桶

在使用 Google 的 GCS 存储桶时，您需要使用兼容 S3 的 XML API，并提供 `endpoint_url`，通常为 `https://storage.googleapis.com`。
以下是使用与 S3 兼容的 GCS XML API 时的 API 请求示例：

```bash
curl --request POST \
  --url 'https://api.smith.langchain.com/api/v1/bulk-exports/destinations' \
  --header 'Content-Type: application/json' \
  --header 'X-API-Key: YOUR_API_KEY' \
  --header 'X-Tenant-Id: YOUR_WORKSPACE_ID' \
  --data '{
    "destination_type": "s3",
    "display_name": "My GCS Destination",
    "config": {
      "bucket_name": "my_bucket",
      "prefix": "data_exports",
      "endpoint_url": "https://storage.googleapis.com"
      "include_bucket_in_prefix": true
    },
    "credentials": {
      "access_key_id": "YOUR_S3_ACCESS_KEY_ID",
      "secret_access_key": "YOUR_S3_SECRET_ACCESS_KEY"
    }
  }'
```

更多信息请参阅 [Google 文档](https://cloud.google.com/storage/docs/interoperability#xml_api)

### 创建导出任务

要导出数据，您需要创建一个导出任务。此任务将指定要导出的数据的目标、项目、日期范围和筛选表达式。筛选表达式用于缩小导出的运行集合，是可选的。不设置筛选字段将导出所有运行。请参考我们的[筛选查询语言](/langsmith/trace-query-syntax#filter-query-language)和[示例](/langsmith/export-traces#use-filter-query-language)来确定适合您导出的正确筛选表达式。

您可以使用以下 cURL 命令创建任务：

```bash
curl --request POST \
  --url 'https://api.smith.langchain.com/api/v1/bulk-exports' \
  --header 'Content-Type: application/json' \
  --header 'X-API-Key: YOUR_API_KEY' \
  --header 'X-Tenant-Id: YOUR_WORKSPACE_ID' \
  --data '{
    "bulk_export_destination_id": "your_destination_id",
    "session_id": "project_uuid",
    "start_time": "2024-01-01T00:00:00Z",
    "end_time": "2024-01-02T23:59:59Z",
    "filter": "and(eq(run_type, \"llm\"), eq(name, \"ChatOpenAI\"), eq(input_key, \"messages.content\"), like(input_value, \"%messages.content%\"))",
    "format_version": "v2_beta"
  }'
```

<Note>

`session_id` 也称为追踪项目 ID，可以通过点击追踪项目列表中的项目，从单个项目视图中复制。

</Note>

使用返回的 `id` 在后续的批量导出操作中引用此导出。

#### 可导出的字段

默认情况下，批量导出包含每个运行的以下字段。您可以在创建导出时选择性地指定这些字段的子集，以减少文件大小和导出时间。更多详细信息，请参阅[限制导出的字段](#limiting-exported-fields)。

以下字段可供导出：

**标识符与层级结构：**

| 字段 | 描述 |
|-------|-------------|
| `id` | 运行 ID |
| `tenant_id` | 工作空间/租户 ID |
| `session_id` | 项目/会话 ID |
| `trace_id` | 追踪 ID |
| `parent_run_id` | 父运行 ID |
| `parent_run_ids` | 所有父运行 ID 的列表 |
| `reference_example_id` | 如果属于数据集的一部分，则引用示例 |

**基本元数据：**

| 字段 | 描述 |
|-------|-------------|
| `name` | 运行名称 |
| `run_type` | 运行类型（例如，"chain"、"llm"、"tool"） |
| `start_time` | 开始时间戳（UTC） |
| `end_time` | 结束时间戳（UTC） |
| `status` | 运行状态（例如，"success"、"error"） |
| `is_root` | 是否为根级运行 |
| `dotted_order` | 层级排序字符串 |
| `trace_tier` | 追踪层级/保留级别 |

**运行数据：**

| 字段 | 描述 |
|-------|-------------|
| `inputs` | 运行输入（JSON） |
| `outputs` | 运行输出（JSON） |
| `error` | 如果失败，则为错误消息 |
| `extra` | 额外元数据（JSON） |
| `events` | 运行事件（JSON） |

**标签与反馈：**

| 字段 | 描述 |
|-------|-------------|
| `tags` | 标签列表 |
| `feedback_stats` | 反馈统计（JSON） |

**令牌使用量与成本：**

| 字段 | 描述 |
|-------|-------------|
| `total_tokens` | 令牌总数 |
| `prompt_tokens` | 提示令牌数 |
| `completion_tokens` | 补全令牌数 |
| `total_cost` | 总成本 |
| `prompt_cost` | 提示成本 |
| `completion_cost` | 补全成本 |
| `first_token_time` | 首令牌时间 |

#### 限制导出字段

<Note>

需要 LangSmith Helm 版本 >= `0.12.11`（应用版本 >= `0.12.42`）。此功能<strong>受支持</strong>于[计划批量导出](#scheduled-exports)和[标准批量导出](#create-an-export-job)。

</Note>

您可以通过使用 `export_fields` 参数限制导出到 Parquet 文件中的字段，来提高批量导出速度并减少行大小。当提供 `export_fields` 时，只有指定的字段会作为列导出到 Parquet 文件中。当未提供 `export_fields` 时，所有可导出的字段都会被包含。

当您希望排除较大的字段（如 `inputs` 和 `outputs`）时，这尤其有用。

以下示例创建了一个仅包含特定字段的导出任务：

```bash
curl --request POST \
  --url 'https://api.smith.langchain.com/api/v1/bulk-exports' \
  --header 'Content-Type: application/json' \
  --header 'X-API-Key: YOUR_API_KEY' \
  --header 'X-Tenant-Id: YOUR_WORKSPACE_ID' \
  --data '{
    "bulk_export_destination_id": "your_destination_id",
    "session_id": "project_uuid",
    "start_time": "2024-01-01T00:00:00Z",
    "end_time": "2024-01-02T23:59:59Z",
    "export_fields": ["id", "name", "run_type", "start_time", "end_time", "status", "total_tokens", "total_cost"],
    "format_version": "v2_beta"
  }'
```

`export_fields` 参数接受一个字段名称数组。可用字段包括[运行数据格式](/langsmith/run-data-format)字段以及额外的仅导出字段：

- `tenant_id`
- `is_root`

<Tip>

<strong>性能提示</strong>：从导出中排除 `inputs` 和 `outputs` 可以显著提高导出性能并减小文件大小，特别是对于大型运行。仅在分析需要时才包含这些字段。

</Tip>

### 计划导出

<Note>

需要 LangSmith Helm 版本 >= `0.10.42`（应用版本 >= `0.10.109`）

</Note>

计划导出会定期收集运行数据并导出到配置的目标。
要创建计划导出，请包含 `interval_hours` 并移除 `end_time`：

```bash
curl --request POST \
  --url 'https://api.smith.langchain.com/api/v1/bulk-exports' \
  --header 'Content-Type: application/json' \
  --header 'X-API-Key: YOUR_API_KEY' \
  --header 'X-Tenant-Id: YOUR_WORKSPACE_ID' \
  --data '{
    "bulk_export_destination_id": "your_destination_id",
    "session_id": "project_uuid",
    "start_time": "2024-01-01T00:00:00Z",
    "filter": "and(eq(run_type, \"llm\"), eq(name, \"ChatOpenAI\"), eq(input_key, \"messages.content\"), like(input_value, \"%messages.content%\"))",
    "interval_hours": 1,
    "format_version": "v2_beta"
  }'
```

您也可以在计划导出中使用 `export_fields` 来限制导出的字段：

```bash
curl --request POST \
  --url 'https://api.smith.langchain.com/api/v1/bulk-exports' \
  --header 'Content-Type: application/json' \
  --header 'X-API-Key: YOUR_API_KEY' \
  --header 'X-Tenant-Id: YOUR_WORKSPACE_ID' \
  --data '{
    "bulk_export_destination_id": "your_destination_id",
    "session_id": "project_uuid",
    "start_time": "2024-01-01T00:00:00Z",
    "interval_hours": 1,
    "export_fields": ["id", "name", "run_type", "start_time", "end_time", "status", "total_tokens", "total_cost"],
    "format_version": "v2_beta"
  }'
```

**详细信息**

- `interval_hours` 必须介于 1 小时到 168 小时（1 周）之间（含边界值）。
- 对于派生的导出任务，首次导出的时间范围是 `start_time=(scheduled_export_start_time), end_time=(start_time + interval_hours)`。
   随后是 `start_time=(previous_export_end_time), end_time=(this_export_start_time + interval_hours)`，依此类推。
- 对于计划导出任务，必须省略 `end_time`。非计划导出任务仍需提供 `end_time`。
- 可以通过[取消导出任务](#stop-an-export)来停止计划导出。
  - 由计划导出派生的导出任务会填充 `source_bulk_export_id` 属性。
  - 如果需要，这些派生的批量导出任务必须与源计划批量导出分开取消——取消源批量导出**不会**取消派生的批量导出。
- 派生的导出任务在 `end_time + 10 分钟` 时运行，以考虑那些在最近过去提交的、带有 `end_time` 的运行。
- `format_version`（可选）：用于 parquet 文件的格式版本。`"v2_beta"` 版本具有 (1) 增强的列数据类型和 (2) 符合 Hive 规范的文件夹结构。

**示例**

如果创建一个计划批量导出，其 `start_time=2025-07-16T00:00:00Z` 且 `interval_hours=6`：

| 导出 | 开始时间               | 结束时间               | 运行时间              |
| ---- | ---------------------- | ---------------------- | ---------------------- |
| 1    | 2025-07-16T00:00:00Z | 2025-07-16T06:00:00Z | 2025-07-16T06:10:00Z |
| 2    | 2025-07-16T06:00:00Z | 2025-07-16T12:00:00Z | 2025-07-16T12:10:00Z |
| 3    | 2025-07-16T12:00:00Z | 2025-07-16T18:00:00Z | 2025-07-16T18:10:00Z |

## 监控导出任务

### 监控导出状态

要监控导出任务的状态，请使用以下 cURL 命令：

```bash
curl --request GET \
  --url 'https://api.smith.langchain.com/api/v1/bulk-exports/{export_id}' \
  --header 'Content-Type: application/json' \
  --header 'X-API-Key: YOUR_API_KEY' \
  --header 'X-Tenant-Id: YOUR_WORKSPACE_ID'
```

将 `{export_id}` 替换为要监控的导出任务的 ID。此命令将检索指定导出任务的当前状态。

### 列出导出的运行

一个导出任务通常会被分解为多个运行，每个运行对应一个要导出的特定日期分区。
要列出与特定导出任务关联的所有运行，请使用以下 cURL 命令：

```bash
curl --request GET \
  --url 'https://api.smith.langchain.com/api/v1/bulk-exports/{export_id}/runs' \
  --header 'Content-Type: application/json' \
  --header 'X-API-Key: YOUR_API_KEY' \
  --header 'X-Tenant-Id: YOUR_WORKSPACE_ID'
```

此命令获取与指定导出任务相关的所有运行，提供运行 ID、状态、创建时间、导出行数等详细信息。

### 列出所有导出任务

要检索所有导出任务的列表，请使用以下 cURL 命令：

```bash
curl --request GET \
  --url 'https://api.smith.langchain.com/api/v1/bulk-exports' \
  --header 'Content-Type: application/json' \
  --header 'X-API-Key: YOUR_API_KEY' \
  --header 'X-Tenant-Id: YOUR_WORKSPACE_ID'
```

此命令返回所有导出任务的列表及其当前状态和创建时间戳。

### 停止导出任务

要停止现有的导出任务，请使用以下 cURL 命令：

```bash
curl --request PATCH \
  --url 'https://api.smith.langchain.com/api/v1/bulk-exports/{export_id}' \
  --header 'Content-Type: application/json' \
  --header 'X-API-Key: YOUR_API_KEY' \
  --header 'X-Tenant-Id: YOUR_WORKSPACE_ID' \
  --data '{
    "status": "Cancelled"
}'
```

将 `{export_id}` 替换为要取消的导出任务的 ID。请注意，任务一旦取消将无法重新启动，您需要创建一个新的导出任务。

## 分区方案

数据将按照以下 Hive 分区格式导出到您的存储桶中：

```
<bucket>/<prefix>/export_id=<export_id>/tenant_id=<tenant_id>/session_id=<session_id>/runs/year=<year>/month=<month>/day=<day>
```

## 将数据导入其他系统

大多数分析系统通常都支持从 S3 和 Parquet 格式导入数据。请参阅以下文档链接：

### BigQuery

要将数据导入 BigQuery，请参阅 [从 Parquet 加载数据](https://cloud.google.com/bigquery/docs/loading-data-cloud-storage-parquet) 以及 [Hive 分区加载](https://cloud.google.com/bigquery/docs/hive-partitioned-loads-gcs)。

### Snowflake

您可以按照 [从云端加载文档教程](https://docs.snowflake.com/en/user-guide/tutorials/load-from-cloud-tutorial) 从 S3 将数据加载到 Snowflake。

### RedShift

您可以按照 [AWS COPY 命令文档](https://docs.aws.amazon.com/redshift/latest/dg/r_COPY.html) 将数据从 S3 或 Parquet 复制到 Amazon Redshift。

### Clickhouse

您可以直接在 Clickhouse 中查询 S3 / Parquet 格式的数据。例如，如果使用 GCS，可以按如下方式查询数据：

```sql
SELECT count(distinct id) FROM s3('https://storage.googleapis.com/<bucket>/<prefix>/export_id=<export_id>/**',
 'access_key_id', 'access_secret', 'Parquet')
```

更多信息请参阅 [Clickhouse S3 集成文档](https://clickhouse.com/docs/en/engines/table-engines/integrations/s3)。

### DuckDB

您可以使用 DuckDB 通过 SQL 在内存中查询 S3 中的数据。请参阅 [S3 导入文档](https://duckdb.org/docs/guides/network_cloud_storage/s3_import.html)。

## 错误处理

### 调试目标错误

目标 API 端点将验证目标和凭据是否有效，以及是否拥有存储桶的写入权限。

如果您收到错误，并希望调试此错误，可以使用 [AWS CLI](https://aws.amazon.com/cli/) 来测试与存储桶的连接。您应该能够使用与提供给上述目标 API 相同的数据，通过 CLI 写入一个文件。

**AWS S3：**

```bash
aws configure

# 设置与目标相同的访问密钥凭据和区域
> AWS Access Key ID: <access_key_id>
> AWS Secret Access Key: <secret_access_key>
> Default region name [us-east-1]: <region>

# 列出存储桶
aws s3 ls /

# 测试写入权限
touch ./test.txt
aws s3 cp ./test.txt s3://<bucket-name>/tmp/test.txt
```

**GCS 兼容存储桶：**

您需要使用 `--endpoint-url` 选项提供 `endpoint_url`。
对于 GCS，`endpoint_url` 通常是 `https://storage.googleapis.com`：

```bash
aws configure

# 设置与目标相同的访问密钥凭据和区域
> AWS Access Key ID: <access_key_id>
> AWS Secret Access Key: <secret_access_key>
> Default region name [us-east-1]: <region>

# 列出存储桶
aws s3 --endpoint-url=<endpoint_url> ls /

# 测试写入权限
touch ./test.txt
aws s3 --endpoint-url=<endpoint_url> cp ./test.txt s3://<bucket-name>/tmp/test.txt
```

### 监控运行

您可以使用 [列出导出运行 API](#list-runs-for-an-export) 来监控您的运行。如果这是一个已知错误，它将被添加到运行的 `errors` 字段中。

### 常见错误

以下是一些常见错误：

| 错误                              | 描述                                                                                                                                                                                                                                                                                            |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 访问被拒绝                      | Blob 存储凭据或存储桶无效。当提供的访问密钥和秘密密钥组合没有足够的权限访问指定存储桶或执行所需操作时，会发生此错误。                                                                |
| 存储桶无效                | 指定的 Blob 存储桶无效。当存储桶不存在或没有足够的访问权限在存储桶上执行写入操作时，会抛出此错误。                                                                                                                                        |
| 提供的密钥 ID 不存在 | 提供的 Blob 存储凭据无效。当用于身份验证的访问密钥 ID 不是有效密钥时，会发生此错误。                                                                                                                                                                |
| 无效的端点                   | 提供的 endpoint_url 无效。当指定的端点是一个无效端点时，会引发此错误。仅支持 S3 兼容端点，例如 GCS 的 `https://storage.googleapis.com`，minio 的 `https://play.min.io` 等。如果使用 AWS，则应省略 endpoint_url。 |

## 故障模式和重试策略

LangSmith 批量导出会自动处理瞬时故障和基础设施问题，以确保弹性。

每个批量导出被划分为多个 _运行_，其中每个运行处理一个[特定日期分区](#partitioning-scheme)的数据（通常按天组织）。运行是独立处理的，这使得：

- 可以并行处理不同的时间段。
- 每个运行具有独立的重试逻辑。
- 如果中断，可以从特定的检查点恢复。

导出中的每个运行（日期范围）都有其自己的[故障处理](#failure-scenarios)和[重试预算](#automation-retry-behavior)。如果一个运行在耗尽所有重试次数后失败，则整个导出将被标记为 `FAILED`。

### 自动重试行为

导出作业会自动重试瞬时故障，行为如下：

- **最大重试尝试次数**：每个运行最多 20 次重试（可能更改）。
- **重试延迟**：尝试之间延迟 30 秒（固定，无指数退避）。
- **运行超时**：每个运行最长 4 小时。
- **整体工作流超时**：整个导出最长 72 小时。

### 故障场景

| 失败类型 | 原因 | 自动重试？ | 需采取的行动 |
|--------------|-------|------------------|-----------------|
| **基础设施中断** | [部署](/langsmith/deployments)、服务器重启、工作进程崩溃 | 是，自动重新排队，保留剩余重试次数。 | 无，作业会自动恢复。 |
| **运行超时** | 单次运行超过 4 小时限制 | 是，最多重试 20 次（可能变更）。 | 如果持续发生，请缩小日期范围、添加过滤器或[限制导出的字段](#limiting-exported-fields)。 |
| **工作流超时** | 整个导出超过 72 小时 | 否 | 减少导出范围（日期范围、过滤器）或拆分为多个较小的导出。 |
| **存储/目标错误** | [凭据无效](#credentials-configuration)、[存储桶缺失](#destinations-providing-an-s3-bucket)、[权限问题](#permissions-required) | 否 | 修复目标配置并创建新的导出。 |
| **目标被删除** | 导出期间存储桶被移除 | 否 | 重新创建目标并重启导出。 |
| **终端处理错误** | 数据序列化问题、资源耗尽 | 是，最多重试 20 次（可能变更）。 | 检查运行错误详情；可能需要调查。 |

<Note>

任何单次运行失败（在所有重试次数用尽后）都会导致整个导出失败。

</Note>

### 导出状态生命周期

导出可以有以下状态：

| 状态 | 描述 |
|--------|-------------|
| `CREATED` | 导出已创建但尚未开始处理。 |
| `RUNNING` | 导出正在主动处理运行。 |
| `COMPLETED` | 所有运行已成功导出。 |
| `FAILED` | 一个或多个运行在重试用尽后失败。 |
| `CANCELLED` | 导出被用户手动取消。 |
| `TIMEDOUT` | 导出超过了 48 小时的工作流超时限制。 |

单个运行可以具有相同的可能状态：`CREATED`、`RUNNING`、`COMPLETED`、`FAILED`、`CANCELLED` 或 `TIMEDOUT`。

### 并发和速率限制

为确保系统稳定性，导出受以下限制：

- **每次导出的最大并发运行数**：45
- **每个工作空间的最大并发导出数**：15

如果您有多个导出正在运行，新的运行作业将排队，直到有可用容量。

### 进度跟踪和可恢复性

导出系统为每次运行维护详细的进度元数据：
- 数据流中的最新游标位置。
- 已导出的行数。
- 已写入的 Parquet 文件列表。

此进度跟踪支持：
- **优雅恢复**：如果运行被中断（例如，由于部署），它会从最后一个检查点恢复，而不是重新开始。
- **进度监控**：通过 API 跟踪已导出的数据量。
- **高效重试**：失败的运行不会重新导出已成功写入的数据。

### 排查导出失败问题

如果您的导出失败，请按照以下步骤操作：

1.  **检查导出状态**：使用 [`GET /api/v1/bulk-exports/{export_id}` 端点](https://api.smith.langchain.com/redoc#tag/bulk-exports) 检索导出详情和状态。
2.  **查看运行错误**：每次运行都包含一个 [`errors` 字段](#error-handling)，其中包含按重试尝试（例如 `retry_0`、`retry_1`）索引的详细错误消息。
3.  **验证目标访问权限**：确保您的[目标存储桶](#preparing-the-destination)仍然存在且[凭据](#credentials-configuration)有效。
4.  **检查运行大小**：如果看到超时错误，您的日期分区可能包含过多数据。[限制导出的字段](#limiting-exported-fields)可能会有所帮助。
5.  **检查系统限制**：确保未达到[并发限制](#concurrency-and-rate-limits)（每次导出 5 个运行，每个工作空间 3 个导出）。

要监控您的导出作业，请参阅[监控导出作业](#monitoring-the-export-job)。

对于存储相关的错误，您可以在重试导出之前使用 AWS CLI 或 gsutil 测试您的目标配置。
