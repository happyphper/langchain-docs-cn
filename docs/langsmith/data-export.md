---
title: 批量导出追踪数据
sidebarTitle: Bulk export trace data
---

<Info>

<strong>计划限制适用</strong>

请注意，数据导出功能仅适用于 [LangSmith Plus 或企业版](https://www.langchain.com/pricing-langsmith)。

</Info>

LangSmith 的批量数据导出功能允许您将追踪数据导出到外部目标位置。如果您想在 BigQuery、Snowflake、RedShift、Jupyter Notebooks 等工具中离线分析数据，这将非常有用。

可以针对特定的 LangSmith 项目和日期范围启动导出。一旦批量导出启动，我们的系统将处理导出流程的编排和容错。
请注意，导出数据可能需要一些时间，具体取决于数据量的大小。我们还对同时运行的导出任务数量有限制。
批量导出还有 24 小时的运行时超时限制。

## 目标位置

目前我们支持导出到您提供的 S3 存储桶或兼容 S3 API 的存储桶。数据将以 [Parquet](https://parquet.apache.org/docs/overview/) 列式格式导出。这种格式可以让您轻松地将数据导入其他系统。数据导出将包含与 [运行数据格式](/langsmith/run-data-format) 等效的数据字段。

## 导出数据

### 目标位置 - 提供 S3 存储桶

要导出 LangSmith 数据，您需要提供一个 S3 存储桶作为数据导出的目标位置。

导出需要以下信息：

- **存储桶名称**：数据将导出到的 S3 存储桶的名称。
- **前缀**：存储桶内数据将导出到的根前缀。
- **S3 区域**：存储桶的区域 - 对于 AWS S3 存储桶是必需的。
- **端点 URL**：S3 存储桶的端点 URL - 对于兼容 S3 API 的存储桶是必需的。
- **访问密钥**：S3 存储桶的访问密钥。
- **密钥**：S3 存储桶的密钥。
- **在前缀中包含存储桶**（可选）：是否将存储桶名称作为路径前缀的一部分。对于新目标位置或路径中已包含存储桶名称时，默认为 `false`。为保持向后兼容性或使用需要在路径中包含存储桶名称的存储系统时，设置为 `true`。

我们支持任何兼容 S3 的存储桶，对于非 AWS 存储桶（如 GCS 或 MinIO），您需要提供端点 URL。

### 准备目标位置

<Note>

<strong>对于自托管和欧盟区域部署</strong>

对于自托管安装或欧盟区域的组织，请在下面的请求中适当更新 LangSmith URL。
对于欧盟区域，请使用 `eu.api.smith.langchain.com`。

</Note>

#### 所需权限

`backend` 和 `queue` 服务都需要对目标存储桶具有写入权限：

- 创建导出目标时，`backend` 服务会尝试向目标存储桶写入一个测试文件。如果具有权限，它将删除该测试文件（删除权限是可选的）。
- `queue` 服务负责批量导出的执行以及将文件上传到存储桶。

**AWS S3 权限**

最小的 AWS S3 权限策略依赖于以下权限：

- `s3:PutObject`（必需）：允许向存储桶写入 Parquet 文件。
- `s3:DeleteObject`（可选）：在创建目标位置时清理测试文件。如果没有此权限，文件将在目标位置创建后留在 `/tmp` 目录下。
- `s3:GetObject`（可选但推荐）：写入后验证文件大小。
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

推荐包含额外权限的 IAM 策略示例：

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

当使用 GCS 的 S3 兼容 XML API 时，需要以下 IAM 权限：

- `storage.objects.create`（必需）：允许向存储桶写入文件。
- `storage.objects.delete`（可选）：在创建目标位置时清理测试文件。如果没有此权限，文件将在目标位置创建后留在 `/tmp` 目录下。
- `storage.objects.get`（可选但推荐）：写入后验证文件大小。

这些权限可以通过预定义的“存储对象管理员”角色或自定义角色授予。

#### 创建目标位置

以下示例演示了如何使用 cURL 创建目标位置。请将占位符值替换为您的实际配置详情。
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

使用返回的 `id` 在后续的批量导出操作中引用此目标位置。

**如果在创建目标位置时收到错误，请参阅 [调试目标位置错误](#debugging-destination-errors) 了解如何调试此问题。**

#### 凭证配置

<Note>
<strong>需要 LangSmith Helm 版本 >= `0.10.34`（应用版本 >= `0.10.91`）</strong>
</Note>

除了静态的 `access_key_id` 和 `secret_access_key` 之外，我们还支持以下额外的凭证格式：

- 要使用包含 AWS 会话令牌的 [临时凭证](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp_use-resources.html)，
  在创建批量导出目标位置时，额外提供 `credentials.session_token` 键。
- （仅限自托管）：要使用基于环境的凭证，例如使用 [AWS IAM Roles for Service Accounts](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html) (IRSA)，
  在创建批量导出目标位置时，从请求中省略 `credentials` 键。
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

使用 Google 的 GCS 存储桶时，您需要使用 XML S3 兼容 API，并提供 `endpoint_url`，
通常是 `https://storage.googleapis.com`。
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

要导出数据，您需要创建一个导出任务。此任务将指定目标位置、项目、日期范围以及要导出数据的筛选表达式。筛选表达式用于缩小导出的运行集合，是可选的。不设置筛选字段将导出所有运行。请参阅我们的 [筛选查询语言](/langsmith/trace-query-syntax#filter-query-language) 和 [示例](/langsmith/export-traces#use-filter-query-language) 来确定适合您导出的正确筛选表达式。

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

`session_id` 也称为追踪项目 ID，可以通过在追踪项目列表中点击进入项目，从单个项目视图中复制。

</Note>

使用返回的 `id` 在后续的批量导出操作中引用此导出。

#### 限制导出的字段

<Note>

需要 LangSmith Helm 版本 >= `0.12.11`（应用版本 >= `0.12.42`）。此功能在 [计划批量导出](#scheduled-exports) 和 [标准批量导出](#create-an-export-job) 中 <strong>受支持</strong>。

</Note>

您可以通过使用 `export_fields` 参数限制 Parquet 文件中包含的字段，来提高批量导出速度并减少行大小。当提供 `export_fields` 时，只有指定的字段会作为列导出到 Parquet 文件中。当未提供 `export_fields` 时，将包含所有可导出的字段。

当您想要排除较大的字段（如 `inputs` 和 `outputs`）时，这尤其有用。

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

`export_fields` 参数接受一个字段名称数组。可用字段包括 [运行数据格式](/langsmith/run-data-format) 字段以及额外的仅导出字段：

- `tenant_id`
- `is_root`

<Tip>

<strong>性能提示</strong>：从导出中排除 `inputs` 和 `outputs` 可以显著提高导出性能并减小文件大小，特别是对于大型运行。仅在分析需要时才包含这些字段。

</Tip>

### 计划导出

<Note>

需要 LangSmith Helm 版本 >= `0.10.42`（应用版本 >= `0.10.109`）

</Note>

计划导出会定期收集运行并导出到配置的目标位置。
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

您也可以将 `export_fields` 与计划导出一起使用，以限制导出的字段：

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

**详情**

- `interval_hours` 必须在 1 小时到 168 小时（1 周）之间（含边界）。
- 对于衍生的导出，导出的第一个时间范围是 `start_time=(scheduled_export_start_time), end_time=(start_time + interval_hours)`。
  然后是 `start_time=(previous_export_end_time), end_time=(this_export_start_time + interval_hours)`，依此类推。
- 计划导出必须省略 `end_time`。非计划导出仍然需要 `end_time`。
- 可以通过 [取消导出](#stop-an-export) 来停止计划导出。
  - 由计划导出衍生的导出具有已填充的 `source_bulk_export_id` 属性。
  - 如果需要，这些衍生的批量导出必须与源计划批量导出分开取消 -
取消源批量导出 **不会** 取消衍生的批量导出。
- 衍生的导出在 `end_time + 10 分钟` 运行，以考虑任何在最近过去提交的带有 `end_time` 的运行。
- `format_version`（可选）：用于 Parquet 文件的格式版本。`"v2_beta"` 具有 (1) 增强的列数据类型和 (2) Hive 兼容的文件夹结构。

**示例**

如果创建了一个 `start_time=2025-07-16T00:00:00Z` 且 `interval_hours=6` 的计划批量导出：

| 导出 | 开始时间             | 结束时间             | 运行时间             |
| ---- | -------------------- | -------------------- | -------------------- |
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

将 `{export_id}` 替换为您要监控的导出的 ID。此命令检索指定导出任务的当前状态。

### 列出导出的运行

一个导出通常被分解为多个运行，每个运行对应一个要导出的特定日期分区。
要列出与特定导出关联的所有运行，请使用以下 cURL 命令：

```bash
curl --request GET \
  --url 'https://api.smith.langchain.com/api/v1/bulk-exports/{export_id}/runs' \
  --header 'Content-Type: application/json'
