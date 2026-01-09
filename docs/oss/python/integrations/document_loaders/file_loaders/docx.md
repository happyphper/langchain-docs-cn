---
title: Docx 文件
---
`DocxLoader` 允许您从 Microsoft Word 文档中提取文本数据。它支持现代的 `.docx` 格式和传统的 `.doc` 格式。根据文件类型，可能需要额外的依赖项。

---

## 安装设置

要使用 `DocxLoader`，您需要安装 `@langchain/community` 集成包以及 `mammoth` 或 `word-extractor` 包：

- **`mammoth`**：用于处理 `.docx` 文件。
- **`word-extractor`**：用于处理 `.doc` 文件。

### 安装

#### 针对 `.docx` 文件

```bash [npm]
npm install @langchain/community @langchain/core mammoth
```
#### 针对 `.doc` 文件

```bash [npm]
npm install @langchain/community @langchain/core word-extractor
```
## 使用方法

### 加载 `.docx` 文件

对于 `.docx` 文件，初始化加载器时无需显式指定任何参数：

```javascript
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";

const loader = new DocxLoader(
  "src/document_loaders/tests/example_data/attention.docx"
);

const docs = await loader.load();
```
### 加载 `.doc` 文件

对于 `.doc` 文件，初始化加载器时必须将 `type` 显式指定为 `doc`：

```javascript
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";

const loader = new DocxLoader(
  "src/document_loaders/tests/example_data/attention.doc",
  {
    type: "doc",
  }
);

const docs = await loader.load();
```
