---
title: Vespa 检索器
---
本文展示了如何将 Vespa.ai 用作 LangChain 的检索器。
Vespa.ai 是一个用于高效结构化文本和向量搜索的平台。
更多信息请参阅 [Vespa.ai](https://vespa.ai)。

以下设置了一个从 Vespa 文档搜索中获取结果的检索器：

```typescript
import { VespaRetriever } from "@langchain/community/retrievers/vespa";

export const run = async () => {
  const url = "https://doc-search.vespa.oath.cloud";
  const query_body = {
    yql: "select content from paragraph where userQuery()",
    hits: 5,
    ranking: "documentation",
    locale: "en-us",
  };
  const content_field = "content";

  const retriever = new VespaRetriever({
    url,
    auth: false,
    query_body,
    content_field,
  });

  const result = await retriever.invoke("what is vespa?");
  console.log(result);
};
```

在此示例中，使用 `documentation` 作为排序方法，从 `paragraph` 文档类型的 `content` 字段中检索最多 5 个结果。`userQuery()` 会被替换为从 LangChain 传递的实际查询。

更多信息请参阅 [pyvespa 文档](https://pyvespa.readthedocs.io/en/latest/getting-started-pyvespa.html#Query)。

URL 是 Vespa 应用程序的端点。
您可以连接到任何 Vespa 端点，无论是远程服务还是使用 Docker 的本地实例。
但是，大多数 Vespa Cloud 实例都通过 mTLS 进行保护。
如果这是您的情况，您可以设置一个 [CloudFlare Worker](https://cloud.vespa.ai/en/security/cloudflare-workers)，其中包含连接到实例所需的凭据。

现在，您可以返回结果并在 LangChain 中继续使用它们。

## 相关链接

- [检索指南](/oss/python/langchain/retrieval)
