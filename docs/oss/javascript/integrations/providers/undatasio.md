---
title: UnDatasIO
---
> `undatasio` 包来自
> [UnDatasIO](https://undatas.io)，它可以从 PDF 等原始源文档中提取干净的文本。
> 本页介绍如何在 LangChain 中使用 `undatasio` 生态系统。

## 安装与设置

- 使用  
  `pip install undatasio`  
  安装 Python SDK，同时安装  
  `pip install langchain-undatasio`  
  以使用 `UnDatasIOLoader` 并通过 UnDatasIO API 进行远程分区处理。
  您需要一个 API 密钥，可以在  
  [undatas.io](https://undatas.io) 免费生成。

- 无需本地系统依赖；所有处理都在云端运行。

## 数据加载器

`UnDatasIO` 的主要用途是通过**文档加载器**。

### UnDatasIOLoader

有关单文件解析和延迟加载，请参阅[使用示例](/oss/integrations/document_loaders/undatasio)。

```python
from langchain_undatasio import UnDatasIOLoader
```
