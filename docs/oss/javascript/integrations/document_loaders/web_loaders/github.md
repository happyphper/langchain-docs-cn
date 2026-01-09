---
title: GitHub
---
本示例演示了如何从 GitHub 仓库加载数据。
你可以设置 `GITHUB_ACCESS_TOKEN` 环境变量为 GitHub 访问令牌，以提高速率限制并访问私有仓库。

## 设置

GitHub 加载器需要 [ignore npm 包](https://www.npmjs.com/package/ignore) 作为对等依赖。请按如下方式安装：

```bash [npm]
npm install @langchain/community @langchain/core ignore
```

## 用法

```typescript
import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";

export const run = async () => {
  const loader = new GithubRepoLoader(
    "https://github.com/langchain-ai/langchainjs",
    {
      branch: "main",
      recursive: false,
      unknown: "warn",
      maxConcurrency: 5, // 默认为 2
    }
  );
  const docs = await loader.load();
  console.log({ docs });
};
```

加载器将忽略图像等二进制文件。

### 使用 .gitignore 语法

要忽略特定文件，你可以向构造函数传入一个 `ignorePaths` 数组：

```typescript
import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";

export const run = async () => {
  const loader = new GithubRepoLoader(
    "https://github.com/langchain-ai/langchainjs",
    { branch: "main", recursive: false, unknown: "warn", ignorePaths: ["*.md"] }
  );
  const docs = await loader.load();
  console.log({ docs });
  // 将不包含任何 .md 文件
};
```

### 使用不同的 GitHub 实例

你可能希望指向 `github.com` 以外的其他 GitHub 实例，例如，如果你公司有 GitHub Enterprise 实例。
为此，你需要两个额外的参数：

- `baseUrl` - 你的 GitHub 实例的基础 URL，这样 githubUrl 就匹配 `<baseUrl>/<owner>/<repo>/...`
- `apiUrl` - 你的 GitHub 实例的 API 端点 URL

```typescript
import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";

export const run = async () => {
  const loader = new GithubRepoLoader(
    "https://github.your.company/org/repo-name",
    {
      baseUrl: "https://github.your.company",
      apiUrl: "https://github.your.company/api/v3",
      accessToken: "ghp_A1B2C3D4E5F6a7b8c9d0",
      branch: "main",
      recursive: true,
      unknown: "warn",
    }
  );
  const docs = await loader.load();
  console.log({ docs });
};
```

### 处理子模块

如果你的仓库包含子模块，你需要决定加载器是否应该跟随它们。你可以通过布尔参数 `processSubmodules` 来控制这一点。默认情况下，子模块不会被处理。
请注意，处理子模块仅在与将 `recursive` 参数设置为 true 结合使用时才有效。

```typescript
import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";

export const run = async () => {
  const loader = new GithubRepoLoader(
    "https://github.com/langchain-ai/langchainjs",
    {
      branch: "main",
      recursive: true,
      processSubmodules: true,
      unknown: "warn",
    }
  );
  const docs = await loader.load();
  console.log({ docs });
};
```

请注意，加载器不会跟随位于与当前仓库不同的 GitHub 实例上的子模块。

### 流式处理大型仓库

对于需要以内存高效的方式处理大型仓库的情况，你可以使用 `loadAsStream` 方法从整个 GitHub 仓库异步流式传输文档。

```typescript
import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";

export const run = async () => {
  const loader = new GithubRepoLoader(
    "https://github.com/langchain-ai/langchainjs",
    {
      branch: "main",
      recursive: false,
      unknown: "warn",
      maxConcurrency: 3, // 默认为 2
    }
  );

  const docs = [];
  for await (const doc of loader.loadAsStream()) {
    docs.push(doc);
  }

  console.log({ docs });
};
```
