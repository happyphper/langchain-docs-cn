---
title: 昇腾
---
>[昇腾](https://https://www.hiascend.com/) 是华为提供的自然处理单元。

本页介绍了如何在 LangChain 中使用昇腾 NPU。

### 安装

使用 torch-npu 进行安装：

::: code-group

```bash [pip]
pip install torch-npu
```

```bash [uv]
uv add torch-npu
```

:::

请按照以下指定的安装说明进行操作：
* 按照[此处](https://www.hiascend.com/document/detail/zh/canncommercial/700/quickstart/quickstart/quickstart_18_0002.html)所示安装 CANN。

### 嵌入模型

查看[使用示例](/oss/integrations/text_embedding/ascend)。

```python
from langchain_community.embeddings import AscendEmbeddings
```
