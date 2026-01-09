---
title: Nuclia
---
>[Nuclia](https://nuclia.com) 能够自动索引来自任何内部或外部来源的非结构化数据，提供优化的搜索结果和生成式答案。
> 它可以处理视频和音频转录、图像内容提取以及文档解析。

## 安装与设置

我们需要安装 `nucliadb-protos` 包来使用 `Nuclia Understanding API`。

::: code-group

```bash [pip]
pip install nucliadb-protos
```

```bash [uv]
uv add nucliadb-protos
```

:::

我们需要拥有一个 `Nuclia 账户`。
可以在 [https://nuclia.cloud](https://nuclia.cloud) 免费创建一个，
然后 [创建一个 NUA 密钥](https://docs.nuclia.dev/docs/docs/using/understanding/intro)。

## 文档转换器

### Nuclia

>`Nuclia Understanding API` 文档转换器将文本分割为段落和句子，
> 识别实体，提供文本摘要并为所有句子生成嵌入向量。

要使用 Nuclia 文档转换器，我们需要实例化一个 `NucliaUnderstandingAPI`
工具，并将 `enable_ml` 设置为 `True`：

```python
from langchain_community.tools.nuclia import NucliaUnderstandingAPI

nua = NucliaUnderstandingAPI(enable_ml=True)
```

查看 [使用示例](/oss/integrations/document_transformers/nuclia_transformer)。

```python
from langchain_community.document_transformers.nuclia_text_transform import NucliaTextTransformer
```

## 文档加载器

### Nuclea 加载器

查看 [使用示例](/oss/integrations/document_loaders/nuclia)。

```python
from langchain_community.document_loaders.nuclia import NucliaLoader
```

## 向量存储

### NucliaDB

我们需要安装一个 Python 包：

::: code-group

```bash [pip]
pip install nuclia
```

```bash [uv]
uv add nuclia
```

:::

查看 [使用示例](/oss/integrations/vectorstores/nucliadb)。

```python
from langchain_community.vectorstores.nucliadb import NucliaDB
```

## 工具

### Nuclia Understanding

查看 [使用示例](/oss/integrations/tools/nuclia)。

```python
from langchain_community.tools.nuclia import NucliaUnderstandingAPI
```
