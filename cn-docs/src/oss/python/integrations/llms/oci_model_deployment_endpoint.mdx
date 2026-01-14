---
title: OCI 数据科学模型部署端点
---
[OCI Data Science](https://docs.oracle.com/en-us/iaas/data-science/using/home.htm) 是一个完全托管且无服务器的平台，供数据科学团队在 Oracle 云基础设施 (Oracle Cloud Infrastructure) 中构建、训练和管理机器学习模型。

> 有关最新更新、示例和实验性功能，请参阅 [ADS LangChain 集成](https://accelerated-data-science.readthedocs.io/en/latest/user_guide/large_language_model/langchain_models.html)。

本笔记本将介绍如何使用托管在 [OCI Data Science 模型部署](https://docs.oracle.com/en-us/iaas/data-science/using/model-dep-about.htm) 上的 LLM。

对于身份验证，使用 [oracle-ads](https://accelerated-data-science.readthedocs.io/en/latest/user_guide/cli/authentication.html) 库来自动加载调用端点所需的凭据。

```python
!pip3 install oracle-ads
```

## 前提条件

### 部署模型

您可以使用 OCI Data Science 模型部署上的 [AI 快速操作](https://docs.oracle.com/en-us/iaas/data-science/using/ai-quick-actions.htm) 轻松部署、微调和评估基础模型。有关更多部署示例，请访问 [Oracle GitHub 示例仓库](https://github.com/oracle-samples/oci-data-science-ai-samples/blob/main/ai-quick-actions/llama3-with-smc.md)。

### 策略

确保拥有访问 OCI Data Science 模型部署端点所需的 [策略](https://docs.oracle.com/en-us/iaas/data-science/using/model-dep-policies-auth.htm#model_dep_policies_auth__predict-endpoint)。

## 设置

部署模型后，您需要设置调用所需的以下参数：

- **`endpoint`**: 已部署模型的 HTTP 端点，例如 `https://modeldeployment.<region>.oci.customer-oci.com/<md_ocid>/predict`。

### 身份验证

您可以通过 ads 或环境变量设置身份验证。当您在 OCI Data Science Notebook Session 中工作时，可以利用资源主体 (resource principal) 来访问其他 OCI 资源。请查看 [此处](https://accelerated-data-science.readthedocs.io/en/latest/user_guide/cli/authentication.html) 以查看更多选项。

## 示例

```python
import ads
from langchain_community.llms import OCIModelDeploymentLLM

# 通过 ads 设置身份验证
# 在配置了基于资源主体身份验证的 OCI 服务内操作时，使用资源主体
ads.set_auth("resource_principal")

# 创建 OCI 模型部署端点实例
# 将端点 URI 和模型名称替换为您自己的
# 使用通用类作为入口点，您将能够在实例化期间通过 model_kwargs 传递模型参数。
llm = OCIModelDeploymentLLM(
    endpoint="https://modeldeployment.<region>.oci.customer-oci.com/<md_ocid>/predict",
    model="odsc-llm",
)

# 运行 LLM
llm.invoke("Who is the first president of United States?")
```

```python
import ads
from langchain_community.llms import OCIModelDeploymentVLLM

# 通过 ads 设置身份验证
# 在配置了基于资源主体身份验证的 OCI 服务内操作时，使用资源主体
ads.set_auth("resource_principal")

# 创建 OCI 模型部署端点实例
# 将端点 URI 和模型名称替换为您自己的
# 使用特定框架类作为入口点，您将能够在构造函数中传递模型参数。
llm = OCIModelDeploymentVLLM(
    endpoint="https://modeldeployment.<region>.oci.customer-oci.com/<md_ocid>/predict",
)

# 运行 LLM
llm.invoke("Who is the first president of United States?")
```

```python
import os

from langchain_community.llms import OCIModelDeploymentTGI

# 通过环境变量设置身份验证
# 当您从本地工作站或不支持资源主体的平台工作时，使用 API 密钥设置。
os.environ["OCI_IAM_TYPE"] = "api_key"
os.environ["OCI_CONFIG_PROFILE"] = "default"
os.environ["OCI_CONFIG_LOCATION"] = "~/.oci"

# 通过环境变量设置端点
# 将端点 URI 替换为您自己的
os.environ["OCI_LLM_ENDPOINT"] = (
    "https://modeldeployment.<region>.oci.customer-oci.com/<md_ocid>/predict"
)

# 创建 OCI 模型部署端点实例
# 使用特定框架类作为入口点，您将能够在构造函数中传递模型参数。
llm = OCIModelDeploymentTGI()

# 运行 LLM
llm.invoke("Who is the first president of United States?")
```

### 异步调用

```python
await llm.ainvoke("Tell me a joke.")
```

### 流式调用

```python
for chunk in llm.stream("Tell me a joke."):
    print(chunk, end="", flush=True)
```

---

## API 参考

有关所有功能和配置的完整详细信息，请参阅每个类的 API 参考文档：

- [OCIModelDeploymentLLM](https://python.langchain.com/api_reference/community/llms/langchain_community.llms.oci_data_science_model_deployment_endpoint.OCIModelDeploymentLLM.html)
- [OCIModelDeploymentVLLM](https://python.langchain.com/api_reference/community/llms/langchain_community.llms.oci_data_science_model_deployment_endpoint.OCIModelDeploymentVLLM.html)
- [OCIModelDeploymentTGI](https://python.langchain.com/api_reference/community/llms/langchain_community.llms.oci_data_science_model_deployment_endpoint.OCIModelDeploymentTGI.html)
