---
title: Jira
---
<提示>
**兼容性说明**

仅适用于 Node.js 环境。
</提示>

本文档介绍如何从 Jira 项目中的问题（issues）加载文档对象。

## 凭证

- 您需要设置一个访问令牌，并将其与您的 Jira 用户名一起提供，以验证请求。
- 您还需要包含要加载为文档的问题（issues）的项目的项目键（project key）和主机 URL。

## 使用方法

```typescript
import { JiraProjectLoader } from "@langchain/community/document_loaders/web/jira";

const host = process.env.JIRA_HOST || "https://jira.example.com";
const username = process.env.JIRA_USERNAME;
const accessToken = process.env.JIRA_ACCESS_TOKEN;
const projectKey = process.env.JIRA_PROJECT_KEY || "PROJ";

if (username && accessToken) {
  // 过去 30 天内创建的
  const createdAfter = new Date();
  createdAfter.setDate(createdAfter.getDate() - 30);
  const loader = new JiraProjectLoader({
    host,
    projectKey,
    username,
    accessToken,
    createdAfter,
  });

  const documents = await loader.load();
  console.log(`Loaded ${documents.length} Jira document(s)`);
} else {
  console.log(
    "You must provide a username and access token to run this example."
  );
}
```
