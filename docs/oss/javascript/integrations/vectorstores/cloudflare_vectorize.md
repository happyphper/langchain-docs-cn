---
title: Cloudflare Vectorize
---
如果你将项目部署在 Cloudflare Worker 中，可以将 [Cloudflare Vectorize](https://developers.cloudflare.com/vectorize/) 与 LangChain.js 结合使用。这是一个功能强大且便捷的选项，直接内置于 Cloudflare 平台。

## 设置

<Tip>

<strong>兼容性说明</strong>

Cloudflare Vectorize 目前处于公开测试阶段，需要使用付费计划的 Cloudflare 账户才能使用。

</Tip>

在[完成项目设置](https://developers.cloudflare.com/vectorize/get-started/intro/#prerequisites)后，运行以下 Wrangler 命令来创建索引：

```bash
$ npx wrangler vectorize create <index_name> --preset @cf/baai/bge-small-en-v1.5
```

你可以在[官方文档](https://developers.cloudflare.com/workers/wrangler/commands/#vectorize)中查看 `vectorize` 命令的完整选项列表。

接下来，你需要更新 `wrangler.toml` 文件，添加 `[[vectorize]]` 条目：

```toml
[[vectorize]]
binding = "VECTORIZE_INDEX"
index_name = "<index_name>"
```

最后，你需要安装 LangChain Cloudflare 集成包：

<Tip>

关于安装 LangChain 包的通用说明，请参阅[此部分](/oss/javascript/langchain/install)。

</Tip>

```bash [npm]
npm install @langchain/cloudflare @langchain/core
```

## 使用

下面是一个示例 Worker，它根据使用的路径向向量存储添加文档、查询或清空数据。它还使用了 [Cloudflare Workers AI Embeddings](/oss/javascript/integrations/text_embedding/cloudflare_ai)。

<Note>

如果在本地运行，请确保以 `npx wrangler dev --remote` 方式运行 wrangler！

</Note>

```toml
name = "langchain-test"
main = "worker.ts"
compatibility_date = "2024-01-10"

[[vectorize]]
binding = "VECTORIZE_INDEX"
index_name = "langchain-test"

[ai]
binding = "AI"
```

```typescript
// @ts-nocheck

import type {
  VectorizeIndex,
  Fetcher,
  Request,
} from "@cloudflare/workers-types";

import {
  CloudflareVectorizeStore,
  CloudflareWorkersAIEmbeddings,
} from "@langchain/cloudflare";

export interface Env {
  VECTORIZE_INDEX: VectorizeIndex;
  AI: Fetcher;
}

export default {
  async fetch(request: Request, env: Env) {
    const { pathname } = new URL(request.url);
    const embeddings = new CloudflareWorkersAIEmbeddings({
      binding: env.AI,
      model: "@cf/baai/bge-small-en-v1.5",
    });
    const store = new CloudflareVectorizeStore(embeddings, {
      index: env.VECTORIZE_INDEX,
    });
    if (pathname === "/") {
      const results = await store.similaritySearch("hello", 5);
      return Response.json(results);
    } else if (pathname === "/load") {
      // 支持按 ID 进行 Upsert 操作
      await store.addDocuments(
        [
          {
            pageContent: "hello",
            metadata: {},
          },
          {
            pageContent: "world",
            metadata: {},
          },
          {
            pageContent: "hi",
            metadata: {},
          },
        ],
        { ids: ["id1", "id2", "id3"] }
      );

      return Response.json({ success: true });
    } else if (pathname === "/clear") {
      await store.delete({ ids: ["id1", "id2", "id3"] });
      return Response.json({ success: true });
    }

    return Response.json({ error: "Not Found" }, { status: 404 });
  },
};
```

你也可以传递一个 `filter` 参数来根据先前加载的元数据进行过滤。关于所需格式的信息，请参阅[官方文档](https://developers.cloudflare.com/vectorize/learning/metadata-filtering/)。

## 相关链接

- 向量存储 [概念指南](/oss/javascript/integrations/vectorstores)
- 向量存储 [操作指南](/oss/javascript/integrations/vectorstores)
