---
sidebar_position: 0
sidebarTitle: Document loaders
---

文档加载器为从不同数据源（如 Slack、Notion 或 Google Drive）读取数据到 LangChain 的 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.documents.Document.html" target="_blank" rel="noreferrer" class="link">Document</a> 格式提供了一个**标准接口**。
这确保了无论数据来源如何，都能以一致的方式处理数据。

所有文档加载器都实现了 <a href="https://reference.langchain.com/javascript/classes/_langchain_core.document_loaders_base.BaseDocumentLoader.html" target="_blank" rel="noreferrer" class="link">BaseLoader</a> 接口。

## Interface

每个文档加载器可以定义自己的参数，但它们共享一个通用的 API：

- `load()`: 一次性加载所有文档。
- `loadAndSplit()`: 一次性加载所有文档并将其拆分为更小的文档。

```typescript
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";

const loader = new CSVLoader(
  ...  // <-- Integration specific parameters here
);
const data = await loader.load();
```

## By category

LangChain.js 以两种不同的方式对文档加载器进行分类：

- [File loaders](/oss/javascript/integrations/document_loaders/file_loaders/)，用于从本地文件系统将数据加载至 LangChain 格式。
- [Web loaders](/oss/javascript/integrations/document_loaders/web_loaders/)，用于从远程源加载数据。

### File loaders

<Info>

如果您想贡献集成，请参阅[贡献集成](/oss/contributing#add-a-new-integration)。

</Info>

#### PDFs

| Document Loader | Description | Package/API |
|----------------|-------------|-------------|
| [PDFLoader](/oss/javascript/integrations/document_loaders/file_loaders/pdf) | 使用 pdf-parse 加载并解析 PDF 文件 | Package |

#### Common file types

| Document Loader | Description | Package/API |
|----------------|-------------|-------------|
| [CSV](/oss/javascript/integrations/document_loaders/file_loaders/csv) | 从 CSV 文件加载数据，支持可配置的列提取 | Package |
| [JSON](/oss/javascript/integrations/document_loaders/file_loaders/json) | 使用 JSON 指针加载 JSON 文件以定位特定键 | Package |
| [JSONLines](/oss/javascript/integrations/document_loaders/file_loaders/jsonlines) | 从 JSONLines/JSONL 文件加载数据 | Package |
| [Text](/oss/javascript/integrations/document_loaders/file_loaders/text) | 加载纯文本文件 | Package |
| [DOCX](/oss/javascript/integrations/document_loaders/file_loaders/docx) | 加载 Microsoft Word 文档（.docx 和 .doc 格式） | Package |
| [EPUB](/oss/javascript/integrations/document_loaders/file_loaders/epub) | 加载 EPUB 文件，支持可选的章节拆分 | Package |
| [PPTX](/oss/javascript/integrations/document_loaders/file_loaders/pptx) | 加载 PowerPoint 演示文稿 | Package |
| [Subtitles](/oss/javascript/integrations/document_loaders/file_loaders/subtitles) | 加载字幕文件（.srt 格式） | Package |

#### Specialized file loaders

| Document Loader | Description | Package/API |
|----------------|-------------|-------------|
| [`DirectoryLoader`](/oss/javascript/integrations/document_loaders/file_loaders/directory) | 使用自定义加载器映射从目录加载所有文件 | Package |
| [`UnstructuredLoader`](/oss/javascript/integrations/document_loaders/file_loaders/unstructured) | 使用 Unstructured API 加载多种文件类型 | API |
| [`MultiFileLoader`](/oss/javascript/integrations/document_loaders/file_loaders/multi_file) | 从多个独立文件路径加载数据 | Package |
| [`ChatGPT`](/oss/javascript/integrations/document_loaders/file_loaders/chatgpt) | 加载 ChatGPT 对话导出文件 | Package |
| [Notion Markdown](/oss/javascript/integrations/document_loaders/file_loaders/notion_markdown) | 加载导出为 Markdown 的 Notion 页面 | Package |
| [OpenAI Whisper Audio](/oss/javascript/integrations/document_loaders/file_loaders/openai_whisper_audio) | 使用 OpenAI Whisper API 转录音频文件 | API |

### Web loaders

#### Webpages

| Document Loader | Description | Web Support | Package/API |
|----------------|-------------|:-----------:|-------------|
| [`Cheerio`](/oss/javascript/integrations/document_loaders/web_loaders/web_cheerio) | 使用 Cheerio 加载网页（轻量级，不执行 JavaScript） | ✅ | Package |
| [`Playwright`](/oss/javascript/integrations/document_loaders/web_loaders/web_playwright) | 使用 Playwright 加载动态网页（支持 JavaScript 渲染） | ❌ | Package |
| [`Puppeteer`](/oss/javascript/integrations/document_loaders/web_loaders/web_puppeteer) | 使用 Puppeteer 加载动态网页（无头 Chrome） | ❌ | Package |
| [`FireCrawl`](/oss/javascript/integrations/document_loaders/web_loaders/firecrawl) | 爬取网站并将其转换为适合 LLM 的 Markdown | ✅ | API |
| [`Spider`](/oss/javascript/integrations/document_loaders/web_loaders/spider) | 将网站快速爬取为 HTML、Markdown 或文本 | ✅ | API |
| [`RecursiveUrlLoader`](/oss/javascript/integrations/document_loaders/web_loaders/recursive_url_loader) | 递归加载网页，跟随链接 | ❌ | Package |
| [`Sitemap`](/oss/javascript/integrations/document_loaders/web_loaders/sitemap) | 从 sitemap.xml 加载所有页面 | ✅ | Package |
| [`Browserbase`](/oss/javascript/integrations/document_loaders/web_loaders/browserbase) | 使用托管的无头浏览器（隐身模式）加载网页 | ✅ | API |
| [`WebPDFLoader`](/oss/javascript/integrations/document_loaders/web_loaders/pdf) | 在网络环境中加载 PDF 文件 | ✅ | Package |

#### Cloud providers

| Document Loader | Description | Web Support | Package/API |
|----------------|-------------|:-----------:|-------------|
| [S3](/oss/javascript/integrations/document_loaders/web_loaders/s3) | 从 AWS S3 存储桶加载文件 | ❌ | Package |
| [Azure Blob Storage Container](/oss/javascript/integrations/document_loaders/web_loaders/azure_blob_storage_container) | 从 Azure Blob Storage 容器加载所有文件 | ❌ | Package |
| [Azure Blob Storage File](/oss/javascript/integrations/document_loaders/web_loaders/azure_blob_storage_file) | 从 Azure Blob Storage 加载单个文件 | ❌ | Package |
| [Google Cloud Storage](/oss/javascript/integrations/document_loaders/web_loaders/google_cloud_storage) | 从 Google Cloud Storage 存储桶加载文件 | ❌ | Package |
| [Google Cloud SQL for PostgreSQL](/oss/javascript/integrations/document_loaders/web_loaders/google_cloudsql_pg) | 从 Cloud SQL PostgreSQL 数据库加载文档 | ✅ | Package |

#### Productivity tools

| Document Loader | Description | Web Support | Package/API |
|----------------|-------------|:-----------:|-------------|
| [Notion API](/oss/javascript/integrations/document_loaders/web_loaders/notionapi) | 通过 API 加载 Notion 页面和数据库 | ✅ | API |
| [Figma](/oss/javascript/integrations/document_loaders/web_loaders/figma) | 加载 Figma 文件数据 | ✅ | API |
| [Confluence](/oss/javascript/integrations/document_loaders/web_loaders/confluence) | 从 Confluence 空间加载页面 | ❌ | API |
| [GitHub](/oss/javascript/integrations/document_loaders/web_loaders/github) | 从 GitHub 仓库加载文件 | ✅ | API |
| [GitBook](/oss/javascript/integrations/document_loaders/web_loaders/gitbook) | 加载 GitBook 文档页面 | ✅ | Package |
| [Jira](/oss/javascript/integrations/document_loaders/web_loaders/jira) | 从 Jira 项目加载问题 | ❌ | API |
| [Airtable](/oss/javascript/integrations/document_loaders/web_loaders/airtable) | 从 Airtable 基础库加载记录 | ✅ | API |
| [Taskade](/oss/javascript/integrations/document_loaders/web_loaders/taskade) | 加载 Taskade 项目数据 | ✅ | API |

#### Search & data APIs

| Document Loader | Description | Web Support | Package/API |
|----------------|-------------|:-----------:|-------------|
| [SearchAPI](/oss/javascript/integrations/document_loaders/web_loaders/searchapi) | 从 SearchAPI 加载网络搜索结果（Google、YouTube 等） | ✅ | API |
| [SerpApi](/oss/javascript/integrations/document_loaders/web_loaders/serpapi) | 从 SerpApi 加载网络搜索结果 | ✅ | API |
| [Apify Dataset](/oss/javascript/integrations/document_loaders/web_loaders/apify_dataset) | 从 Apify 平台加载抓取的数据 | ✅ | API |

#### Audio & video

| Document Loader | Description | Web Support | Package/API |
|----------------|-------------|:-----------:|-------------|
| [YouTube](/oss/javascript/integrations/document_loaders/web_loaders/youtube) | 加载 YouTube 视频字幕 | ✅ | Package |
| [AssemblyAI](/oss/javascript/integrations/document_loaders/web_loaders/assemblyai_audio_transcription) | 使用 AssemblyAI API 转录音频和视频文件 | ✅ | API |
| [Sonix](/oss/javascript/integrations/document_loaders/web_loaders/sonix_audio_transcription) | 使用 Sonix API 转录音频文件 | ❌ | API |

#### Other

| Document Loader | Description | Web Support | Package/API |
|----------------|-------------|:-----------:|-------------|
| [Couchbase](/oss/javascript/integrations/document_loaders/web_loaders/couchbase) | 使用 SQL++ 查询从 Couchbase 数据库加载文档 | ✅ | Package |
| [LangSmith](/oss/javascript/integrations/document_loaders/web_loaders/langsmith) | 从 LangSmith 加载数据集和追踪记录 | ✅ | API |
| [Hacker News](/oss/javascript/integrations/document_loaders/web_loaders/hn) | 加载 Hacker News 主题和评论 | ✅ | Package |
| [IMSDB](/oss/javascript/integrations/document_loaders/web_loaders/imsdb) | 从互联网电影剧本数据库加载电影剧本 | ✅ | Package |
| [College Confidential](/oss/javascript/integrations/document_loaders/web_loaders/college_confidential) | 从 College Confidential 加载大学信息 | ✅ | Package |
| [Blockchain Data](/oss/javascript/integrations/document_loaders/web_loaders/sort_xyz_blockchain) | 通过 Sort.xyz API 加载区块链数据（NFT、交易） | ✅ | API |

## All document loaders

<Columns :cols="3">

<Card title="Airtable" icon="link" href="/oss/integrations/document_loaders/web_loaders/airtable" arrow="true" cta="View guide" />
<Card title="Apify Dataset" icon="link" href="/oss/integrations/document_loaders/web_loaders/apify_dataset" arrow="true" cta="View guide" />
<Card title="AssemblyAI Audio Transcript" icon="link" href="/oss/integrations/document_loaders/web_loaders/assemblyai_audio_transcription" arrow="true" cta="View guide" />
<Card title="Azure Blob Storage Container" icon="link" href="/oss/integrations/document_loaders/web_loaders/azure_blob_storage_container" arrow="true" cta="View guide" />
<Card title="Azure Blob Storage File" icon="link" href="/oss/integrations/document_loaders/web_loaders/azure_blob_storage_file" arrow="true" cta="View guide" />
<Card title="Blockchain Data" icon="link" href="/oss/integrations/document_loaders/web_loaders/sort_xyz_blockchain" arrow="true" cta="View guide" />
<Card title="Browserbase" icon="link" href="/oss/integrations/document_loaders/web_loaders/browserbase" arrow="true" cta="View guide" />
<Card title="ChatGPT" icon="link" href="/oss/integrations/document_loaders/file_loaders/chatgpt" arrow="true" cta="View guide" />
<Card title="Cheerio" icon="link" href="/oss/integrations/document_loaders/web_loaders/web_cheerio" arrow="true" cta="View guide" />
<Card title="College Confidential" icon="link" href="/oss/integrations/document_loaders/web_loaders/college_confidential" arrow="true" cta="View guide" />
<Card title="Confluence" icon="link" href="/oss/integrations/document_loaders/web_loaders/confluence" arrow="true" cta="View guide" />
<Card title="Couchbase" icon="link" href="/oss/integrations/document_loaders/web_loaders/couchbase" arrow="true" cta="View guide" />
<Card title="CSV" icon="link" href="/oss/integrations/document_loaders/file_loaders/csv" arrow="true" cta="View guide" />
<Card title="DirectoryLoader" icon="link" href="/oss/integrations/document_loaders/file_loaders/directory" arrow="true" cta="View guide" />
<Card title="DOCX" icon="link" href="/oss/integrations/document_loaders/file_loaders/docx" arrow="true" cta="View guide" />
<Card title="EPUB" icon="link" href="/oss/integrations/document_loaders/file_loaders/epub" arrow="true" cta="View guide" />
<Card title="Figma" icon="link" href="/oss/integrations/document_loaders/web_loaders/figma" arrow="true" cta="View guide" />
<Card title="FireCrawl" icon="link" href="/oss/integrations/document_loaders/web_loaders/firecrawl" arrow="true" cta="View guide" />
<Card title="GitHub" icon="link" href="/oss/integrations/document_loaders/web_loaders/github" arrow="true" cta="View guide" />
<Card title="GitBook" icon="link" href="/oss/integrations/document_loaders/web_loaders/gitbook" arrow="true" cta="View guide" />
<Card title="Google Cloud SQL for PostgreSQL" icon="link" href="/oss/integrations/document_loaders/web_loaders/google_cloudsql_pg" arrow="true" cta="View guide" />
<Card title="Google Cloud Storage" icon="link" href="/oss/integrations/document_loaders/web_loaders/google_cloud_storage" arrow="true" cta="View guide" />
<Card title="Hacker News" icon="link" href="/oss/integrations/document_loaders/web_loaders/hn" arrow="true" cta="View guide" />
<Card title="IMSDB" icon="link" href="/oss/integrations/document_loaders/web_loaders/imsdb" arrow="true" cta="View guide" />
<Card title="Jira" icon="link" href="/oss/integrations/document_loaders/web_loaders/jira" arrow="true" cta="View guide" />
<Card title="JSON" icon="link" href="/oss/integrations/document_loaders/file_loaders/json" arrow="true" cta="View guide" />
<Card title="JSONLines" icon="link" href="/oss/integrations/document_loaders/file_loaders/jsonlines" arrow="true" cta="View guide" />
<Card title="LangSmith" icon="link" href="/oss/integrations/document_loaders/web_loaders/langsmith" arrow="true" cta="View guide" />
<Card title="MultiFileLoader" icon="link" href="/oss/integrations/document_loaders/file_loaders/multi_file" arrow="true" cta="View guide" />
<Card title="Notion API" icon="link" href="/oss/integrations/document_loaders/web_loaders/notionapi" arrow="true" cta="View guide" />
<Card title="Notion Markdown" icon="link" href="/oss/integrations/document_loaders/file_loaders/notion_markdown" arrow="true" cta="View guide" />
<Card title="OpenAI Whisper Audio" icon="link" href="/oss/integrations/document_loaders/file_loaders/openai_whisper_audio" arrow="true" cta="View guide" />
<Card title="PDFLoader" icon="link" href="/oss/integrations/document_loaders/file_loaders/pdf" arrow="true" cta="View guide" />
<Card title="Playwright" icon="link" href="/oss/integrations/document_loaders/web_loaders/web_playwright" arrow="true" cta="View guide" />
<Card title="PPTX" icon="link" href="/oss/integrations/document_loaders/file_loaders/pptx" arrow="true" cta="View guide" />
<Card title="Puppeteer" icon="link" href="/oss/integrations/document_loaders/web_loaders/web_puppeteer" arrow="true" cta="View guide" />
<Card title="RecursiveUrlLoader" icon="link" href="/oss/integrations/document_loaders/web_loaders/recursive_url_loader" arrow="true" cta="View guide" />
<Card title="S3" icon="link" href="/oss/integrations/document_loaders/web_loaders/s3" arrow="true" cta="View guide" />
<Card title="SearchAPI" icon="link" href="/oss/integrations/document_loaders/web_loaders/searchapi" arrow="true" cta="View guide" />
<Card title="SerpApi" icon="link" href="/oss/integrations/document_loaders/web_loaders/serpapi" arrow="true" cta="View guide" />
<Card title="Sitemap" icon="link" href="/oss/integrations/document_loaders/web_loaders/sitemap" arrow="true" cta="View guide" />
<Card title="Sonix Audio" icon="link" href="/oss/integrations/document_loaders/web_loaders/sonix_audio_transcription" arrow="true" cta="View guide" />
<Card title="Spider" icon="link" href="/oss/integrations/document_loaders/web_loaders/spider" arrow="true" cta="View guide" />
<Card title="Subtitles" icon="link" href="/oss/integrations/document_loaders/file_loaders/subtitles" arrow="true" cta="View guide" />
<Card title="Taskade" icon="link" href="/oss/integrations/document_loaders/web_loaders/taskade" arrow="true" cta="View guide" />
<Card title="Text" icon="link" href="/oss/integrations/document_loaders/file_loaders/text" arrow="true" cta="View guide" />
<Card title="UnstructuredLoader" icon="link" href="/oss/integrations/document_loaders/file_loaders/unstructured" arrow="true" cta="View guide" />
<Card title="WebPDFLoader" icon="link" href="/oss/integrations/document_loaders/web_loaders/pdf" arrow="true" cta="View guide" />
<Card title="YouTube" icon="link" href="/oss/integrations/document_loaders/web_loaders/youtube" arrow="true" cta="View guide" />

</Columns>

