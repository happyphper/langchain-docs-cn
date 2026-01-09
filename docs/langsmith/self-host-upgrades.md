---
title: 升级安装
sidebarTitle: Upgrade an installation
---
关于通用升级说明，请遵循以下指南。某些特定版本可能有专门的升级说明，这些将在更具体的升级指南中详细说明。

## Kubernetes(Helm)

如果尚未添加仓库，请运行以下命令添加：

```bash
helm repo add langchain https://langchain-ai.github.io/helm/
```

更新本地 Helm 仓库

```bash
helm repo update
```

根据新版本的要求，更新您的 Helm 图表配置文件。这些更新将在新版本的发布说明中详细说明。

运行以下命令来升级图表（将 `<version>` 替换为您想要升级到的版本号）：

<Note>

如果您使用的命名空间不是默认命名空间，则需要在 `helm` 和 `kubectl` 命令中使用 `-n <namespace>` 标志来指定命名空间。

</Note>

查找图表的最新版本。您可以在 [LangSmith Helm Chart GitHub 仓库](https://github.com/langchain-ai/helm/releases) 中找到，或者运行以下命令：

```bash
helm search repo langchain/langsmith --versions
```

您应该会看到类似以下的输出：

```bash
langchain/langsmith     0.10.14         0.10.32         Helm chart to deploy the langsmith application ...
langchain/langsmith     0.10.13         0.10.32         Helm chart to deploy the langsmith application ...
langchain/langsmith     0.10.12         0.10.32         Helm chart to deploy the langsmith application ...
langchain/langsmith     0.10.11         0.10.29         Helm chart to deploy the langsmith application ...
langchain/langsmith     0.10.10         0.10.29         Helm chart to deploy the langsmith application ...
langchain/langsmith     0.10.9          0.10.29         Helm chart to deploy the langsmith application ...
```

选择您想要升级到的版本（通常建议使用最新版本）并记下版本号。

```bash
helm upgrade <release-name> langchain/langsmith --version <version> --values <path-to-values-file> --wait --debug
```

验证升级是否成功：

```bash
helm status <release-name>
```

所有 Pod 都应处于 `Running` 状态。验证 clickhouse 是否正在运行，并且两个 `migrations` 作业是否已完成。

```bash
kubectl get pods
NAME                                     READY   STATUS      RESTARTS   AGE
langsmith-backend-95b6d54f5-gz48b        1/1     Running     0          15h
langsmith-pg-migrations-d2z6k            0/1     Completed   0          5h48m
langsmith-ch-migrations-gasvk            0/1     Completed   0          5h48m
langsmith-clickhouse-0                   1/1     Running     0          26h
langsmith-frontend-84687d9d45-6cg4r      1/1     Running     0          15h
langsmith-hub-backend-66ffb75fb4-qg6kl   1/1     Running     0          15h
langsmith-playground-85b444d8f7-pl589    1/1     Running     0          15h
langsmith-queue-d58cb64f7-87d68          1/1     Running     0          15h
```

### 验证您的部署：

1. 运行 `kubectl get services`

   输出应类似于：

```bash
NAME                         TYPE           CLUSTER-IP       EXTERNAL-IP     PORT(S)                      AGE
kubernetes                   ClusterIP      172.20.0.1       <none>          443/TCP                      27d
langsmith-backend            ClusterIP      172.20.22.34     <none>          1984/TCP                     21d
langsmith-clickhouse         ClusterIP      172.20.117.62    <none>          8123/TCP,9000/TCP            21d
langsmith-frontend           LoadBalancer   172.20.218.30    <external ip>   80:30093/TCP,443:31130/TCP   21d
langsmith-platform-backend   ClusterIP      172.20.232.183   <none>          1986/TCP                     21d
langsmith-playground         ClusterIP      172.20.167.132   <none>          3001/TCP                     21d
langsmith-postgres           ClusterIP      172.20.59.63     <none>          5432/TCP                     21d
langsmith-redis              ClusterIP      172.20.229.98    <none>          6379/TCP                     20d
```

2. 对 `langsmith-frontend` 服务的外部 IP 执行 curl 命令：

```bash
curl <external ip>/api/info
{"version":"0.5.7","license_expiration_time":"2033-05-20T20:08:06","batch_ingest_config":{"scale_up_qsize_trigger":1000,"scale_up_nthreads_limit":16,"scale_down_nempty_trigger":4,"size_limit":100,"size_limit_bytes":20971520}}
```

检查版本是否与您升级到的版本匹配。

3. 在浏览器中访问 `langsmith-frontend` 服务的外部 IP

   LangSmith 用户界面应该可见/可操作

   ![LangSmith UI](/langsmith/images/langsmith-ui.png)

## Docker

升级 LangSmith 的 Docker 版本比 Helm 版本稍微复杂一些，可能需要短暂的停机时间。请按照以下说明升级您的 LangSmith Docker 版本。

1. 将您的 `docker-compose.yml` 文件更新为最新版本中使用的文件。您可以在 [LangSmith SDK GitHub 仓库](https://github.com/langchain-ai/langsmith-sdk/blob/main/python/langsmith/cli/docker-compose.yaml) 中找到。
2. 根据新版本所需的任何新环境变量更新您的 `.env` 文件。这些将在新版本的发布说明中详细说明。
3. 运行以下命令停止当前的 LangSmith 实例：

```bash
docker-compose down
```

4. 运行以下命令在后台启动新的 LangSmith 实例：

```bash
docker-compose up -d
```

如果一切运行成功，您应该看到所有 LangSmith 容器都在运行且状态健康。

```bash
CONTAINER ID   IMAGE                                  COMMAND                  CREATED        STATUS                        PORTS                                                      NAMES
e1c8f01a4ffc   langchain/langsmith-frontend:0.5.7     "/entrypoint.sh ngin…"   10 hours ago   Up 40 seconds                 0.0.0.0:80->80/tcp, 8080/tcp                               cli-langchain-frontend-1
39e1394846b9   langchain/langsmith-backend:0.5.7      "/bin/sh -c 'exec uv…"   10 hours ago   Up 40 seconds                 0.0.0.0:1984->1984/tcp                                     cli-langchain-backend-1
f8688dd58f2f   langchain/langsmith-go-backend:0.5.7   "./smith-go"             10 hours ago   Up 40 seconds                 0.0.0.0:1986->1986/tcp                                     cli-langchain-platform-backend-1
006f1303b04d   langchain/langsmith-backend:0.5.7      "saq app.workers.que…"   10 hours ago   Up 40 seconds                                                                            cli-langchain-queue-1
73a90242ed3a   redis:7                                "docker-entrypoint.s…"   10 hours ago   Up About a minute (healthy)   0.0.0.0:63791->6379/tcp                                    cli-langchain-redis-1
eecf75ca672b   postgres:14.7                          "docker-entrypoint.s…"   10 hours ago   Up About a minute (healthy)   0.0.0.0:5433->5432/tcp                                     cli-langchain-db-1
3aa5652a864d   clickhouse/clickhouse-server:23.9      "/entrypoint.sh"         10 hours ago   Up About a minute (healthy)   9009/tcp, 0.0.0.0:8124->8123/tcp, 0.0.0.0:9001->9000/tcp   cli-langchain-clickhouse-1
84edc329a37f   langchain/langsmith-playground:0.5.7   "docker-entrypoint.s…"   10 hours ago   Up About a minute             0.0.0.0:3001->3001/tcp                                     cli-langchain-playground-1
```

### 验证您的部署：

1. 对 `cli-langchain-frontend-1` 容器暴露的端口执行 curl 命令：

```bash
curl localhost:80/info
{"version":"0.5.7","license_expiration_time":"2033-05-20T20:08:06","batch_ingest_config":{"scale_up_qsize_trigger":1000,"scale_up_nthreads_limit":16,"scale_down_nempty_trigger":4,"size_limit":100,"size_limit_bytes":20971520}}
```

2. 在浏览器中访问 `cli-langchain-frontend-1` 容器暴露的端口

LangSmith 用户界面应该可见/可操作

![LangSmith UI](/langsmith/images/langsmith-ui.png)
