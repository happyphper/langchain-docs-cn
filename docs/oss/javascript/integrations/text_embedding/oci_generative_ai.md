---
title: Oracle Cloud Infrastructure 生成式 AI
---
Oracle Cloud Infrastructure (OCI) Generative AI 是一项全托管服务，提供一系列最先进、可定制的大型语言模型 (LLMs)，覆盖广泛的用例，并通过单一 API 提供。
使用 OCI Generative AI 服务，您可以访问开箱即用的预训练模型，也可以在专用的 AI 集群上基于您自己的数据创建和托管您自己微调的自定义模型。该服务和 API 的详细文档可在 __[此处](https://docs.oracle.com/en-us/iaas/Content/generative-ai/home.htm)__ 和 __[此处](https://docs.oracle.com/en-us/iaas/api/#/en/generative-ai/20231130/)__ 找到。

本笔记本将解释如何在 LangChain 中使用 OCI 的 Generative AI 模型。

### 前提条件

我们需要安装 oci SDK。

```python
!pip install -U oci
```

### OCI Generative AI API 端点
[inference.generativeai.us-chicago-1.oci.oraclecloud.com](https://inference.generativeai.us-chicago-1.oci.oraclecloud.com)

## 身份验证

此 LangChain 集成支持的身份验证方法有：

1.  API 密钥
2.  会话令牌
3.  实例主体
4.  资源主体

这些方法遵循标准 SDK 身份验证方法，详细说明见 __[此处](https://docs.oracle.com/en-us/iaas/Content/API/Concepts/sdk_authentication_methods.htm)__。

## 使用方式

```python
from langchain_community.embeddings import OCIGenAIEmbeddings

# 使用默认的 API 密钥身份验证方法
embeddings = OCIGenAIEmbeddings(
    model_id="MY_EMBEDDING_MODEL",
    service_endpoint="https://inference.generativeai.us-chicago-1.oci.oraclecloud.com",
    compartment_id="MY_OCID",
)

query = "This is a query in English."
response = embeddings.embed_query(query)
print(response)

documents = ["This is a sample document", "and here is another one"]
response = embeddings.embed_documents(documents)
print(response)
```

```python
# 使用会话令牌进行身份验证
embeddings = OCIGenAIEmbeddings(
    model_id="MY_EMBEDDING_MODEL",
    service_endpoint="https://inference.generativeai.us-chicago-1.oci.oraclecloud.com",
    compartment_id="MY_OCID",
    auth_type="SECURITY_TOKEN",
    auth_profile="MY_PROFILE",  # 替换为您的配置文件名称
    auth_file_location="MY_CONFIG_FILE_LOCATION",  # 替换为包含配置文件配置的文件位置
)

query = "This is a sample query"
response = embeddings.embed_query(query)
print(response)

documents = ["This is a sample document", "and here is another one"]
response = embeddings.embed_documents(documents)
print(response)
```
