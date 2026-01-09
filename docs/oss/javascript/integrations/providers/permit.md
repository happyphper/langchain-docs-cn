---
title: 许可
---
[Permit.io](https://permit.io/) 提供细粒度的访问控制和策略执行。通过 LangChain，您可以集成 Permit 检查，以确保在您的 LLM 应用程序中，只有经过授权的用户才能访问或检索数据。

## 安装与设置

::: code-group

```bash [pip]
pip install langchain-permit
pip install permit
```

```bash [uv]
uv add langchain-permit
uv add permit
```

:::

为您的 Permit PDP 和凭据设置环境变量：

```python
export PERMIT_API_KEY="your_permit_api_key"
export PERMIT_PDP_URL="http://localhost:7766"   # 或您真实的 PDP 端点
```

确保您的 PDP 正在运行并已配置。有关策略设置，请参阅 [Permit 文档](https://docs.permit.io/sdk/python/quickstart-python/#2-setup-your-pdp-policy-decision-point-container)。

## 工具

有关可用工具的详细信息，请参见[此处](/oss/integrations/tools/permit)。

## 检索器

有关可用检索器的详细信息，请参见[此处](/oss/integrations/retrievers/permit)。
