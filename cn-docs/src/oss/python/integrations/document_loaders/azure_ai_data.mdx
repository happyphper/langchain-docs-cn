---
title: Azure AI 数据
---
>[Azure AI Foundry（原 Azure AI Studio）](https://ai.azure.com/) 提供了将数据资产上传到云存储以及从以下来源注册现有数据资产的能力：
>
>- `Microsoft OneLake`
>- `Azure Blob Storage`
>- `Azure Data Lake gen 2`

与 `AzureBlobStorageContainerLoader` 和 `AzureBlobStorageFileLoader` 相比，这种方法的优势在于能够无缝处理云存储的身份验证。您可以使用*基于身份*的数据访问控制或*基于凭证*（例如 SAS 令牌、账户密钥）的数据访问控制。对于基于凭证的数据访问，您无需在代码中指定密钥或设置密钥保管库——系统会为您处理这些。

本笔记本介绍如何从 AI Studio 中的数据资产加载文档对象。

```python
pip install -qU azureml-fsspec azure-ai-generative
```

```python
from azure.ai.resources.client import AIClient
from azure.identity import DefaultAzureCredential
from langchain_community.document_loaders import AzureAIDataLoader
```

```python
# 创建到您项目的连接
client = AIClient(
    credential=DefaultAzureCredential(),
    subscription_id="<subscription_id>",
    resource_group_name="<resource_group_name>",
    project_name="<project_name>",
)
```

```python
# 获取数据资产的最新版本
data_asset = client.data.get(name="<data_asset_name>", label="latest")
```

```python
# 加载数据资产
loader = AzureAIDataLoader(url=data_asset.path)
```

```python
loader.load()
```

```python
[Document(page_content='Lorem ipsum dolor sit amet.', lookup_str='', metadata={'source': '/var/folders/y6/8_bzdg295ld6s1_97_12m4lr0000gn/T/tmpaa9xl6ch/fake.docx'}, lookup_index=0)]
```

## 指定 glob 模式

您还可以指定一个 glob 模式，以便更精细地控制要加载的文件。在下面的示例中，只会加载扩展名为 `pdf` 的文件。

```python
loader = AzureAIDataLoader(url=data_asset.path, glob="*.pdf")
```

```python
loader.load()
```

```python
[Document(page_content='Lorem ipsum dolor sit amet.', lookup_str='', metadata={'source': '/var/folders/y6/8_bzdg295ld6s1_97_12m4lr0000gn/T/tmpujbkzf_l/fake.docx'}, lookup_index=0)]
```
