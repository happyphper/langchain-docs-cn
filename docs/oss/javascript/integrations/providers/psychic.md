---
title: Psychic
---

<Warning>

该提供商已不再维护，可能无法正常工作。请谨慎使用。

</Warning>

>[Psychic](https://www.psychic.dev/) 是一个平台，用于通过 OAuth 与 `Notion`、`Zendesk`、`Confluence` 和 `Google Drive` 等 SaaS 工具集成，并将这些应用程序中的文档同步到您的 SQL 或向量数据库中。您可以将其视为非结构化数据领域的 Plaid。

## 安装与设置

::: code-group

```bash [pip]
pip install psychicapi
```

```bash [uv]
uv add psychicapi
```

:::

Psychic 易于设置 - 您导入 `react` 库并使用从 [Psychic 仪表板](https://dashboard.psychic.dev/) 获取的 `Sidekick API` 密钥进行配置。当您连接应用程序时，可以从仪表板查看这些连接，并使用服务器端库检索数据。

1.  在 [仪表板](https://dashboard.psychic.dev/) 中创建一个账户。
2.  使用 [react 库](https://docs.psychic.dev/sidekick-link) 将 Psychic 链接模态框添加到您的前端 React 应用中。您将使用它来连接 SaaS 应用。
3.  创建连接后，您可以按照 [示例笔记本](/oss/integrations/document_loaders/psychic) 使用 `PsychicLoader`。

## 与其他文档加载器的优势

1.  **通用 API：** 无需为每个 SaaS 应用构建 OAuth 流程并学习其 API，您只需集成 Psychic 一次，即可利用我们的通用 API 来检索数据。
2.  **数据同步：** 客户 SaaS 应用中的数据可能很快过时。使用 Psychic，您可以配置 Webhook，以每日或实时方式保持文档更新。
3.  **简化的 OAuth：** Psychic 端到端处理 OAuth，因此您无需花费时间为每个集成创建 OAuth 客户端、保持访问令牌新鲜以及处理 OAuth 重定向逻辑。
