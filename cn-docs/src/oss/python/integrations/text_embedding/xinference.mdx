---
title: Xorbits inference (Xinference)
---
本笔记本将介绍如何在 LangChain 中使用 Xinference 嵌入模型。

## 安装

通过 PyPI 安装 `Xinference`：

```python
pip install -qU  "xinference[all]"
```

## 本地或分布式集群部署 Xinference

对于本地部署，运行 `xinference` 命令。

要在集群中部署 Xinference，首先使用 `xinference-supervisor` 启动一个 Xinference 管理节点。你也可以使用 `-p` 选项指定端口，使用 `-H` 选项指定主机。默认端口为 9997。

然后，在每台要运行工作节点的服务器上使用 `xinference-worker` 启动 Xinference 工作节点。

更多信息请查阅 [Xinference](https://github.com/xorbitsai/inference) 的 README 文件。

## 封装器

要在 LangChain 中使用 Xinference，首先需要启动一个模型。你可以使用命令行界面（CLI）来完成：

```python
!xinference launch -n vicuna-v1.3 -f ggmlv3 -q q4_0
```

```text
模型 UID: 915845ee-2a04-11ee-8ed4-d29396a3f064
```

系统会返回一个模型 UID 供你使用。现在你可以在 LangChain 中使用 Xinference 嵌入模型了：

```python
from langchain_community.embeddings import XinferenceEmbeddings

xinference = XinferenceEmbeddings(
    server_url="http://0.0.0.0:9997", model_uid="915845ee-2a04-11ee-8ed4-d29396a3f064"
)
```

```python
query_result = xinference.embed_query("这是一个测试查询")
```

```python
doc_result = xinference.embed_documents(["文本 A", "文本 B"])
```

最后，当你不再需要使用该模型时，请将其终止：

```python
!xinference terminate --model-uid "915845ee-2a04-11ee-8ed4-d29396a3f064"
```
