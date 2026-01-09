---
title: LangSmith 安装的镜像镜像
sidebarTitle: Mirror images for your installation
---
默认情况下，LangSmith 会从我们的公共 Docker 镜像仓库拉取镜像。但是，如果您在无法访问互联网的环境中运行 LangSmith，或者希望使用私有 Docker 镜像仓库，您可以将镜像复制到您自己的镜像仓库，然后配置您的 LangSmith 安装以使用这些镜像。

## 要求

*   对您的 Kubernetes 集群/机器可以访问的 Docker 镜像仓库拥有经过身份验证的访问权限。
*   在本地机器或可以访问 Docker 镜像仓库的机器上安装 Docker。
*   一个可以运行 LangSmith 的 Kubernetes 集群或机器。

## 复制镜像

为了方便起见，我们提供了一个脚本来为您复制镜像。您可以在 [LangSmith Helm Chart 仓库](https://github.com/langchain-ai/helm/blob/main/charts/langsmith/scripts/mirror_langsmith_images.sh) 中找到该脚本。

要使用该脚本，您需要使用以下命令运行脚本，并指定您的镜像仓库和平台：

```bash
bash mirror_images.sh <your-registry> [<platform>]
```

其中 `<your-registry>` 是您的 Docker 镜像仓库的 URL（例如 `myregistry.com`），`<platform>` 是您使用的平台（例如 `linux/amd64`、`linux/arm64` 等）。如果您未指定平台，则默认为 `linux/amd64`。

例如，如果您的镜像仓库是 `myregistry.com`，您的平台是 `linux/arm64`，并且您想使用最新版本的镜像，您将运行：

```bash
bash mirror_langsmith_images.sh --registry myregistry --platform linux/arm64 --version 0.10.66
```

请注意，此脚本假定您已安装 Docker 并且已通过身份验证访问您的镜像仓库。它还会将镜像推送到指定的镜像仓库，并使用与原始镜像相同的仓库/标签。

或者，您可以手动拉取、复制和推送镜像。您需要复制的镜像可以在 LangSmith Helm Chart 的 `values.yaml` 文件中找到。这些文件位于：[LangSmith Helm Chart values.yaml](https://github.com/langchain-ai/helm/blob/main/charts/langsmith/values.yaml#L14)

以下是如何使用 Docker 复制镜像的示例：

```bash
# 从公共镜像仓库拉取镜像
docker pull langchain/langsmith-backend:latest
docker tag langchain/langsmith-backend:latest <your-registry>/langsmith-backend:latest
docker push <your-registry>/langsmith-backend:latest
```

您需要对每个想要复制的镜像重复此操作。

## 配置

镜像复制完成后，您需要配置您的 LangSmith 安装以使用复制的镜像。您可以通过修改 LangSmith Helm Chart 安装的 `values.yaml` 文件或 Docker 安装的 `.env` 文件来实现。将标签替换为您要使用的版本，例如，在撰写本文时，最新版本为 `0.10.66`。

::: code-group

```yaml [Helm]
images:
  imagePullSecrets: [] # 如果需要，请在此处添加您的镜像拉取密钥
  registry: "" # 如果您使用我们的脚本将所有镜像复制到同一个镜像仓库，请将此设置为您的镜像仓库 URL。然后，您可以删除下面镜像中的仓库前缀。
  aceBackendImage:
    repository: "(your-registry)/langchain/langsmith-ace-backend"
    pullPolicy: IfNotPresent
    tag: "0.10.66"
  backendImage:
    repository: "(your-registry)/langchain/langsmith-backend"
    pullPolicy: IfNotPresent
    tag: "0.10.66"
  frontendImage:
    repository: "(your-registry)/langchain/langsmith-frontend"
    pullPolicy: IfNotPresent
    tag: "0.10.66"
  hostBackendImage:
    repository: "(your-registry)/langchain/hosted-langserve-backend"
    pullPolicy: IfNotPresent
    tag: "0.10.66"
  operatorImage:
    repository: "(your-registry)/langchain/langgraph-operator"
    pullPolicy: IfNotPresent
    tag: "6cc83a8"
  platformBackendImage:
    repository: "(your-registry)/langchain/langsmith-go-backend"
    pullPolicy: IfNotPresent
    tag: "0.10.66"
  playgroundImage:
    repository: "(your-registry)/langchain/langsmith-playground"
    pullPolicy: IfNotPresent
    tag: "0.10.66"
  postgresImage:
    repository: "(your-registry)/postgres"
    pullPolicy: IfNotPresent
    tag: "14.7"
  redisImage:
    repository: "(your-registry)/redis"
    pullPolicy: IfNotPresent
    tag: "7"
  clickhouseImage:
    repository: "(your-registry)/clickhouse/clickhouse-server"
    pullPolicy: Always
    tag: "24.8"
```

```bash [Docker]
# 在您的 .env 文件中
_REGISTRY=your-registry # 如果您使用我们的脚本将所有镜像复制到同一个镜像仓库，请将此设置为您的镜像仓库 URL。否则，您将需要在 compose 文件中手动设置每个镜像的仓库。
```

:::

配置完成后，您需要更新您的 LangSmith 安装。您可以按照我们的升级指南进行操作：[升级 LangSmith](/langsmith/self-host-upgrades)。如果升级成功，您的 LangSmith 实例现在应该正在使用来自您 Docker 镜像仓库的复制镜像。
