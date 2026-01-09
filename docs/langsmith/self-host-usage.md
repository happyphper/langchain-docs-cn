---
title: 与您自托管的 LangSmith 实例进行交互
sidebarTitle: Interact with an installation
---
本指南将引导您完成使用自托管 LangSmith 实例的过程。

<Info>

本指南假设您已经部署了自托管的 LangSmith 实例。如果尚未部署，请参考 [Kubernetes 部署指南](/langsmith/kubernetes) 或 [Docker 部署指南](/langsmith/docker)。

</Info>

### 配置要与 LangSmith 一起使用的应用程序

LangSmith 提供了一个统一的 API，用于与 hub 和 LangSmith 后端进行交互。

1. 部署实例后，您可以通过 `http(s)://<主机地址>` 访问 LangSmith 用户界面。
2. LangSmith API 将在 `http(s)://<主机地址>/api/v1` 地址可用。
3. LangSmith 控制平面将在 `http(s)://<主机地址>/api-host` 地址可用。

要使用您实例的 API，您需要在应用程序中设置以下环境变量：

```bash
LANGSMITH_ENDPOINT=http://<host>/api/v1
LANGSMITH_API_KEY=foo # 如果使用 OAuth，请设置为合法的 API 密钥
```

您也可以在 LangSmith SDK 客户端中直接配置这些变量：

```python
import langsmith
langsmith_client = langsmith.Client(
    api_key='<api_key>',
    api_url='http(s)://<host>/api/v1',
)
```

完成上述设置后，您应该能够运行代码并在您的自托管实例中看到结果。我们建议您运行一遍 [*快速入门指南*](https://docs.smith.langchain.com/#quick-start) 来熟悉如何使用 LangSmith。

### 自签名证书

如果您为自托管的 LangSmith 实例使用了自签名证书，这可能会带来问题，因为 Python 自带其信任的证书集，其中可能不包含您的自签名证书。要解决此问题，您可能需要使用类似 `truststore` 的工具将系统证书加载到您的 Python 环境中。

您可以按如下方式操作：

1. 使用 pip 安装 truststore（或根据您使用的包管理器选择类似工具）

然后使用以下代码加载系统证书：

```python
import truststore
truststore.inject_into_ssl()
# 您的其余代码
import langsmith
langsmith_client = langsmith.Client(
    api_key='<api_key>',
    api_url='http(s)://<host>/api/v1',
)
```

---

## API 参考

要访问 API 参考文档，请在浏览器中导航至 `http://<主机地址>/api/docs`。
