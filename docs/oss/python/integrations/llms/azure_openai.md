---
title: Azure OpenAI
---

<Warning>

<strong>您当前正在查阅的是关于 Azure OpenAI 文本补全模型的使用文档。最新且最受欢迎的 Azure OpenAI 模型是 [聊天补全模型](/oss/python/langchain/models)。</strong>

除非您明确在使用 `gpt-3.5-turbo-instruct` 模型，否则您可能正在寻找 [这个页面](/oss/python/integrations/chat/azure_chat_openai/)。

</Warning>

本页将介绍如何在 LangChain 中使用 [Azure OpenAI](https://aka.ms/azure-openai)。

Azure OpenAI API 与 OpenAI 的 API 兼容。`openai` Python 包使得同时使用 OpenAI 和 Azure OpenAI 变得容易。除了下面指出的例外情况，您可以像调用 OpenAI 一样调用 Azure OpenAI。

## API 配置

您可以使用环境变量来配置 `openai` 包以使用 Azure OpenAI。以下是在 `bash` 中的配置示例：

```bash
# 您想使用的 API 版本：对于已发布的版本，请将其设置为 `2023-12-01-preview`。
export OPENAI_API_VERSION=2023-12-01-preview
# 您的 Azure OpenAI 资源的基 URL。您可以在 Azure 门户中您的 Azure OpenAI 资源下找到此信息。
export AZURE_OPENAI_ENDPOINT=https://your-resource-name.openai.azure.com
# 您的 Azure OpenAI 资源的 API 密钥。您可以在 Azure 门户中您的 Azure OpenAI 资源下找到此信息。
export AZURE_OPENAI_API_KEY=<your Azure OpenAI API key>
```

或者，您可以直接在运行的 Python 环境中配置 API：

```python
import os
os.environ["OPENAI_API_VERSION"] = "2023-12-01-preview"
```

## Azure Active Directory 身份验证

有两种方式可以对 Azure OpenAI 进行身份验证：

- API 密钥
- Azure Active Directory (AAD)

使用 API 密钥是最简单的入门方式。您可以在 Azure 门户中您的 Azure OpenAI 资源下找到您的 API 密钥。

但是，如果您有复杂的安全要求，您可能希望使用 Azure Active Directory。您可以在 [这里](https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/managed-identity) 找到有关如何将 AAD 与 Azure OpenAI 结合使用的更多信息。

如果您在本地开发，您需要安装 Azure CLI 并登录。您可以在 [这里](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) 安装 Azure CLI。然后，运行 `az login` 进行登录。

为您的 Azure OpenAI 资源添加一个作用域为该资源的 Azure 角色分配 `Cognitive Services OpenAI User`。这将允许您从 AAD 获取令牌以用于 Azure OpenAI。您可以将此角色分配给用户、组、服务主体或托管标识。有关 Azure OpenAI RBAC 角色的更多信息，请参见 [这里](https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/role-based-access-control)。

要在 Python 的 LangChain 中使用 AAD，请安装 `azure-identity` 包。然后，将 `OPENAI_API_TYPE` 设置为 `azure_ad`。接下来，使用 `DefaultAzureCredential` 类通过调用 `get_token` 从 AAD 获取令牌，如下所示。最后，将 `OPENAI_API_KEY` 环境变量设置为令牌值。

```python
import os
from azure.identity import DefaultAzureCredential

# 获取 Azure 凭据
credential = DefaultAzureCredential()

# 将 API 类型设置为 `azure_ad`
os.environ["OPENAI_API_TYPE"] = "azure_ad"
# 将 API_KEY 设置为从 Azure 凭据获取的令牌
os.environ["OPENAI_API_KEY"] = credential.get_token("https://cognitiveservices.azure.com/.default").token
```

`DefaultAzureCredential` 类是开始使用 AAD 身份验证的简便方法。如果需要，您也可以自定义凭据链。在下面显示的示例中，我们首先尝试托管标识，然后回退到 Azure CLI。如果您在 Azure 中运行代码，但希望在本地开发，这将非常有用。

```python
from azure.identity import ChainedTokenCredential, ManagedIdentityCredential, AzureCliCredential

credential = ChainedTokenCredential(
    ManagedIdentityCredential(),
    AzureCliCredential()
)
```

## 部署

使用 Azure OpenAI 时，您需要自行部署常见的 GPT-3 和 Codex 模型。调用 API 时，您需要指定要使用的部署。

_**注意**：本文档适用于 Azure 文本补全模型。像 GPT-4 这样的模型是聊天模型。它们的接口略有不同，可以通过 <a href="https://reference.langchain.com/python/integrations/langchain_openai/AzureChatOpenAI" target="_blank" rel="noreferrer" class="link"><code>AzureChatOpenAI</code></a> 类访问。有关 Azure 聊天的文档，请参阅 [Azure Chat OpenAI 文档](/oss/python/integrations/chat/azure_chat_openai)。_

假设您的部署名称是 `gpt-35-turbo-instruct-prod`。在 `openai` Python API 中，您可以使用 `engine` 参数指定此部署。例如：

```python
import openai

client = openai.AzureOpenAI(
    api_version="2023-12-01-preview",
)

response = client.completions.create(
    model="gpt-35-turbo-instruct-prod",
    prompt="Test prompt"
)
```

```python
pip install -qU  langchain-openai
```

```python
import os

os.environ["OPENAI_API_VERSION"] = "2023-12-01-preview"
os.environ["AZURE_OPENAI_ENDPOINT"] = "..."
os.environ["AZURE_OPENAI_API_KEY"] = "..."
```

```python
# 导入 Azure OpenAI
from langchain_openai import AzureOpenAI
```

```python
# 创建 Azure OpenAI 实例
# 请将部署名称替换为您自己的
llm = AzureOpenAI(
    deployment_name="gpt-35-turbo-instruct-0914",
)
```

```python
# 运行 LLM
llm.invoke("Tell me a joke")
```

```text
" Why couldn't the bicycle stand up by itself?\n\nBecause it was two-tired!"
```

我们也可以打印 LLM 并查看其自定义打印信息。

```python
print(llm)
```

```text
AzureOpenAI
Params: {'deployment_name': 'gpt-35-turbo-instruct-0914', 'model_name': 'gpt-3.5-turbo-instruct', 'temperature': 0.7, 'top_p': 1, 'frequency_penalty': 0, 'presence_penalty': 0, 'n': 1, 'logit_bias': {}, 'max_tokens': 256}
```

```python

```
