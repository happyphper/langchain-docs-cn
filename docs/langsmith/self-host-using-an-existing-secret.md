---
title: 使用现有密钥进行安装（Kubernetes）
sidebarTitle: Use an existing secret for your installation (Kubernetes)
---
默认情况下，LangSmith 会创建多个 Kubernetes 密钥（secret）来存储敏感信息，例如许可证密钥、盐值和其他配置参数。但是，您可能希望使用已在 Kubernetes 集群中创建的现有密钥（或通过某种密钥操作器配置的密钥）。如果您希望以集中方式管理敏感信息，或者有特定的安全要求，这会很有用。

默认情况下，我们将创建以下与 LangSmith 不同组件对应的密钥：

* `langsmith-secrets`：此密钥包含许可证密钥和其他一些基本配置参数。您可以在此处查看此密钥的模板[here](https://github.com/langchain-ai/helm/blob/main/charts/langsmith/templates/secrets.yaml)
* `langsmith-redis`：此密钥包含 Redis 连接字符串（或使用 Redis 集群时的节点 URI）和密码。您可以在此处查看此密钥的模板[here](https://github.com/langchain-ai/helm/blob/main/charts/langsmith/templates/redis/secrets.yaml)
* `langsmith-postgres`：此密钥包含 Postgres 连接字符串和密码。您可以在此处查看此密钥的模板[here](https://github.com/langchain-ai/helm/blob/main/charts/langsmith/templates/postgres/secrets.yaml)
* `langsmith-clickhouse`：此密钥包含 ClickHouse 连接字符串和密码。您可以在此处查看此密钥的模板[here](https://github.com/langchain-ai/helm/blob/main/charts/langsmith/templates/clickhouse/secrets.yaml)

## 前提条件

* 现有的 Kubernetes 集群
* 在集群中创建 Kubernetes 密钥的方法。这可以使用 `kubectl`、Helm chart 或像 [Sealed Secrets](https://github.com/bitnami-labs/sealed-secrets) 这样的密钥操作器来完成。

## 参数

您需要创建自己的 Kubernetes 密钥，其结构需符合 LangSmith Helm Chart 所配置的密钥结构。

<Warning>

密钥的结构必须与 LangSmith Helm Chart 配置的密钥相同（请参考上面的链接查看具体的密钥）。如果缺少任何必需的键，您的 LangSmith 实例可能无法正常工作。

</Warning>

一个示例密钥可能如下所示：

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: langsmith-existing-secrets
  namespace: langsmith
stringData:
  oauth_client_id: foo
  oauth_client_secret: foo
  oauth_issuer_url: foo
  langsmith_license_key: foo
  langgraph_cloud_license_key: foo
  api_key_salt: foo
  jwt_secret: foo
  initial_org_admin_password: foo
  blob_storage_access_key: foo
  blob_storage_access_key_secret: foo
  azure_storage_account_key: foo
  azure_storage_connection_string: foo
```

## 配置

配置好这些密钥后，您可以配置 LangSmith 实例直接使用这些密钥，以避免通过明文传递密钥值。您可以通过修改 LangSmith Helm Chart 安装的 `langsmith_config.yaml` 文件来实现。

```yaml
config:
  existingSecretName: "langsmith-secrets" # 包含许可证密钥和其他基本配置参数的密钥名称
redis:
  external:
    enabled: true # 设置为 true 以使用外部 Redis 实例。仅在使用外部 Redis 实例时才需要此密钥
    existingSecretName: "langsmith-redis" # 包含 Redis 连接字符串和密码的密钥名称
postgres:
  external:
    enabled: true # 设置为 true 以使用外部 Postgres 实例。仅在使用外部 Postgres 实例时才需要此密钥
    existingSecretName: "langsmith-postgres" # 包含 Postgres 连接字符串和密码的密钥名称
clickhouse:
  external:
    enabled: true # 设置为 true 以使用外部 ClickHouse 实例。仅在使用外部 ClickHouse 实例时才需要此密钥
    existingSecretName: "langsmith-clickhouse" # 包含 ClickHouse 连接字符串和密码的密钥名称
```

配置完成后，您需要更新 LangSmith 安装。您可以按照我们的升级指南[here](/langsmith/self-host-upgrades)进行操作。如果一切配置正确，您的 LangSmith 实例现在应该可以通过 Ingress 访问。您可以运行以下命令来检查您的密钥是否正确使用：

```bash
kubectl describe deployment langsmith-backend | grep -i <secret-name>
```

您应该在输出中看到类似这样的内容：

```bash
POSTGRES_DATABASE_URI:                    <set to the key 'connection_url' in secret <your-secret-name>  Optional: false
CLICKHOUSE_DB:                            <set to the key 'clickhouse_db' in secret <your-secret-name>   Optional: false
```
