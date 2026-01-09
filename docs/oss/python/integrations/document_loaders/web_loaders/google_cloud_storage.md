---
title: Google Cloud Storage
---

<Tip>

<strong>兼容性说明</strong>

仅适用于 Node.js 环境。

</Tip>

本文介绍如何将 Google Cloud Storage 中的文件加载到 LangChain 文档中。

## 环境设置

要使用此加载器，您需要先配置好 Unstructured 服务，并确保其在一个可访问的 URL 端点可用。也可以将其配置为在本地运行。

关于如何设置，请参阅[此文档](/oss/integrations/document_loaders/file_loaders/unstructured)。

您还需要安装官方的 Google Cloud Storage SDK：

```bash [npm]
npm install @langchain/community @langchain/core @google-cloud/storage
```

## 使用方法

配置好 Unstructured 后，您就可以使用 Google Cloud Storage 加载器来加载文件，并将其转换为 Document。

此外，您可以选择性地提供一个 `storageOptions` 参数，不仅可以指定存储选项，还可以指定其他身份验证方式，如果您不希望默认使用应用程序默认凭据 (ADC) 的话。

```typescript
import { GoogleCloudStorageLoader } from "@langchain/community/document_loaders/web/google_cloud_storage";

const loader = new GoogleCloudStorageLoader({
  bucket: "my-bucket-123",
  file: "path/to/file.pdf",
  storageOptions: {
    keyFilename: "/path/to/keyfile.json",
  },
  unstructuredLoaderOptions: {
    apiUrl: "http://localhost:8000/general/v0/general",
    apiKey: "", // 此参数很快将变为必需项
  },
});

const docs = await loader.load();

console.log(docs);
```
