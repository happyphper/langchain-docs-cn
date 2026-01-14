---
title: Oracle Cloud Infrastructure 生成式 AI
---
Oracle Cloud Infrastructure (OCI) Generative AI 是一项全托管服务，提供一套先进的、可定制的大型语言模型 (LLMs)，覆盖广泛的用例，并通过单一 API 提供。
使用 OCI Generative AI 服务，您可以访问开箱即用的预训练模型，也可以在专用的 AI 集群上基于您自己的数据创建和托管您自己微调的自定义模型。该服务和 API 的详细文档可在 __[此处](https://docs.oracle.com/en-us/iaas/Content/generative-ai/home.htm)__ 和 __[此处](https://docs.oracle.com/en-us/iaas/api/#/en/generative-ai/20231130/)__ 找到。

本笔记本解释了如何在 LangChain 中使用 OCI 的 Generative AI 完整模型。

## 设置

确保已安装 oci sdk 和 langchain-community 包

```python
!pip install -U oci langchain-community
```

## 用法

```python
from langchain_community.llms.oci_generative_ai import OCIGenAI

llm = OCIGenAI(
    model_id="cohere.command",
    service_endpoint="https://inference.generativeai.us-chicago-1.oci.oraclecloud.com",
    compartment_id="MY_OCID",
    model_kwargs={"temperature": 0, "max_tokens": 500},
)

response = llm.invoke("Tell me one fact about earth", temperature=0.7)
print(response)
```

#### 与提示模板链式调用

```python
from langchain_core.prompts import PromptTemplate

llm = OCIGenAI(
    model_id="cohere.command",
    service_endpoint="https://inference.generativeai.us-chicago-1.oci.oraclecloud.com",
    compartment_id="MY_OCID",
    model_kwargs={"temperature": 0, "max_tokens": 500},
)

prompt = PromptTemplate(input_variables=["query"], template="{query}")
llm_chain = prompt | llm

response = llm_chain.invoke("what is the capital of france?")
print(response)
```

#### 流式处理

```python
llm = OCIGenAI(
    model_id="cohere.command",
    service_endpoint="https://inference.generativeai.us-chicago-1.oci.oraclecloud.com",
    compartment_id="MY_OCID",
    model_kwargs={"temperature": 0, "max_tokens": 500},
)

for chunk in llm.stream("Write me a song about sparkling water."):
    print(chunk, end="", flush=True)
```

## 身份验证

LlamaIndex 支持的身份验证方法与其他 OCI 服务使用的等效，并遵循 __[标准 SDK 身份验证](https://docs.oracle.com/en-us/iaas/Content/API/Concepts/sdk_authentication_methods.htm)__ 方法，具体包括 API 密钥、会话令牌、实例主体和资源主体。

API 密钥是上述示例中使用的默认身份验证方法。以下示例演示了如何使用不同的身份验证方法（会话令牌）

```python
llm = OCIGenAI(
    model_id="cohere.command",
    service_endpoint="https://inference.generativeai.us-chicago-1.oci.oraclecloud.com",
    compartment_id="MY_OCID",
    auth_type="SECURITY_TOKEN",
    auth_profile="MY_PROFILE",  # 替换为您的配置文件名称
    auth_file_location="MY_CONFIG_FILE_LOCATION",  # 替换为配置文件所在位置
)
```

## 专用 AI 集群

要访问托管在专用 AI 集群中的模型，请 __[创建一个端点](https://docs.oracle.com/en-us/iaas/api/#/en/generative-ai-inference/20231130/)__，其分配的 OCID（当前前缀为 'ocid1.generativeaiendpoint.oc1.us-chicago-1'）将用作您的模型 ID。

当访问托管在专用 AI 集群中的模型时，您需要使用两个额外的必需参数（"provider" 和 "context_size"）来初始化 OCIGenAI 接口。

```python
llm = OCIGenAI(
    model_id="ocid1.generativeaiendpoint.oc1.us-chicago-1....",
    service_endpoint="https://inference.generativeai.us-chicago-1.oci.oraclecloud.com",
    compartment_id="DEDICATED_COMPARTMENT_OCID",
    auth_profile="MY_PROFILE",  # 替换为您的配置文件名称,
    auth_file_location="MY_CONFIG_FILE_LOCATION",  # 替换为配置文件所在位置
    provider="MODEL_PROVIDER",  # 例如，"cohere" 或 "meta"
    context_size="MODEL_CONTEXT_SIZE",  # 例如，128000
)
```
