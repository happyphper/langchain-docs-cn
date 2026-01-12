---
title: 阿里云
---
>[阿里巴巴集团（Alibaba Group Holding Limited） (Wikipedia)](https://en.wikipedia.org/wiki/Alibaba_Group)，或 `Alibaba`
> (中文：阿里巴巴)，是一家专注于电子商务、零售、互联网和技术的中国跨国科技公司。
>
> [阿里云（Alibaba Cloud） (Wikipedia)](https://en.wikipedia.org/wiki/Alibaba_Cloud)，也称为 `Aliyun`
> (中文：阿里云；拼音：Ālǐyún；字面意思：'阿里云')，是一家云计算公司，是 `Alibaba Group` 的子公司。`Alibaba Cloud` 为在线业务和阿里巴巴自身的电子商务生态系统提供云计算服务。

## 大语言模型 (LLMs)

### 阿里云 PAI EAS

查看[安装说明和使用示例](/oss/python/integrations/llms/alibabacloud_pai_eas_endpoint)。

```python
from langchain_community.llms.pai_eas_endpoint import PaiEasEndpoint
```

### 通义千问 (Tongyi Qwen)

查看[安装说明和使用示例](/oss/python/integrations/llms/tongyi)。

```python
from langchain_community.llms import Tongyi
```

## 聊天模型 (Chat Models)

### 阿里云 PAI EAS

查看[安装说明和使用示例](/oss/python/integrations/chat/alibaba_cloud_pai_eas)。

```python
from langchain_community.chat_models import PaiEasChatEndpoint
```

### 通义千问聊天 (Tongyi Qwen Chat)

查看[安装说明和使用示例](/oss/python/integrations/chat/tongyi)。

```python
from langchain_community.chat_models.tongyi import ChatTongyi
```

### Qwen QwQ 聊天

查看[安装说明和使用示例](/oss/python/integrations/chat/qwq)

```python
from langchain_qwq import ChatQwQ
```

### Qwen 模型聊天

查看[安装说明和使用示例](/oss/python/integrations/chat/qwen)

```python
from langchain_qwq import ChatQwen
```

## 文档加载器 (Document loaders)

### 阿里云 MaxCompute

查看[安装说明和使用示例](/oss/python/integrations/document_loaders/alibaba_cloud_maxcompute)。

```python
from langchain_community.document_loaders import MaxComputeLoader
```

## 向量存储 (Vector stores)

### 阿里云 OpenSearch

查看[安装说明和使用示例](/oss/python/integrations/vectorstores/alibabacloud_opensearch)。

```python
from langchain_community.vectorstores import AlibabaCloudOpenSearch, AlibabaCloudOpenSearchSettings
```

### 阿里云 Tair

查看[安装说明和使用示例](/oss/python/integrations/vectorstores/tair)。

```python
from langchain_community.vectorstores import Tair
```

### AnalyticDB

查看[安装说明和使用示例](/oss/python/integrations/vectorstores/analyticdb)。

```python
from langchain_community.vectorstores import AnalyticDB
```

### Hologres

查看[安装说明和使用示例](/oss/python/integrations/vectorstores/hologres)。

```python
from langchain_community.vectorstores import Hologres
```

### Tablestore

查看[安装说明和使用示例](/oss/python/integrations/vectorstores/tablestore)。

```python
from langchain_community.vectorstores import TablestoreVectorStore
```
