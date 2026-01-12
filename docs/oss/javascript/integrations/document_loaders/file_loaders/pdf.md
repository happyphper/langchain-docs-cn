---
title: PDFLoader
---

<Tip>

<strong>兼容性</strong>：仅在 Node.js 环境下可用。

</Tip>

本笔记本提供了 `PDFLoader` [文档加载器](/oss/javascript/integrations/document_loaders) 的快速入门概述。有关 `PDFLoader` 所有功能和配置的详细文档，请参阅 [API 参考](https://api.js.langchain.com/classes/langchain_community_document_loaders_fs_pdf.PDFLoader.html)。

## 概述

### 集成详情

| 类 | 包 | 兼容性 | 本地 | Python 支持 |
| :--- | :--- | :---: | :---: |  :---: |
| [PDFLoader](https://api.js.langchain.com/classes/langchain_community_document_loaders_fs_pdf.PDFLoader.html) | [@langchain/community](https://api.js.langchain.com/modules/langchain_community_document_loaders_fs_pdf.html) | 仅限 Node.js | ✅ | 🟠 (参见下方说明) |

## 设置

要使用 `PDFLoader` 文档加载器，你需要安装 `@langchain/community` 集成包以及 `pdf-parse` 包。

### 凭证

### 安装

LangChain PDFLoader 集成位于 `@langchain/community` 包中：

::: code-group

```bash [npm]
npm install @langchain/community @langchain/core pdf-parse
```

```bash [yarn]
yarn add @langchain/community @langchain/core pdf-parse
```

```bash [pnpm]
pnpm add @langchain/community @langchain/core pdf-parse
```

:::

## 实例化

现在我们可以实例化模型对象并加载文档：

```typescript
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"

const nike10kPdfPath = "../../../../data/nke-10k-2023.pdf"

const loader = new PDFLoader(nike10kPdfPath)
```

## 加载

```typescript
const docs = await loader.load()
docs[0]
```

```javascript
Document {
  pageContent: 'Table of Contents\n' +
    'UNITED STATES\n' +
    'SECURITIES AND EXCHANGE COMMISSION\n' +
    'Washington, D.C. 20549\n' +
    'FORM 10-K\n' +
    '(Mark One)\n' +
    '☑ ANNUAL REPORT PURSUANT TO SECTION 13 OR 15(D) OF THE SECURITIES EXCHANGE ACT OF 1934\n' +
    'FOR THE FISCAL YEAR ENDED MAY 31, 2023\n' +
    'OR\n' +
    '☐ TRANSITION REPORT PURSUANT TO SECTION 13 OR 15(D) OF THE SECURITIES EXCHANGE ACT OF 1934\n' +
    'FOR THE TRANSITION PERIOD FROM                         TO                         .\n' +
    'Commission File No. 1-10635\n' +
    'NIKE, Inc.\n' +
    '(Exact name of Registrant as specified in its charter)\n' +
    'Oregon93-0584541\n' +
    '(State or other jurisdiction of incorporation)(IRS Employer Identification No.)\n' +
    'One Bowerman Drive, Beaverton, Oregon 97005-6453\n' +
    '(Address of principal executive offices and zip code)\n' +
    '(503) 671-6453\n' +
    "(Registrant's telephone number, including area code)\n" +
    'SECURITIES REGISTERED PURSUANT TO SECTION 12(B) OF THE ACT:\n' +
    'Class B Common StockNKENew York Stock Exchange\n' +
    '(Title of each class)(Trading symbol)(Name of each exchange on which registered)\n' +
    'SECURITIES REGISTERED PURSUANT TO SECTION 12(G) OF THE ACT:\n' +
    'NONE\n' +
    'Indicate by check mark:YESNO\n' +
    '•if the registrant is a well-known seasoned issuer, as defined in Rule 405 of the Securities Act.þ ̈\n' +
    '•if the registrant is not required to file reports pursuant to Section 13 or Section 15(d) of the Act. ̈þ\n' +
    '•whether the registrant (1) has filed all reports required to be filed by Section 13 or 15(d) of the Securities Exchange Act of 1934 during the preceding\n' +
    '12 months (or for such shorter period that the registrant was required to file such reports), and (2) has been subject to such filing requirements for the\n' +
    'past 90 days.\n' +
    'þ ̈\n' +
    '•whether the registrant has submitted electronically every Interactive Data File required to be submitted pursuant to Rule 405 of Regulation S-T\n' +
    '(§232.405 of this chapter) during the preceding 12 months (or for such shorter period that the registrant was required to submit such files).\n' +
    'þ ̈\n' +
    '•whether the registrant is a large accelerated filer, an accelerated filer, a non-accelerated filer, a smaller reporting company or an emerging growth company. See the definitions of “large accelerated filer,”\n' +
    '“accelerated filer,” “smaller reporting company,” and “emerging growth company” in Rule 12b-2 of the Exchange Act.\n' +
    'Large accelerated filerþAccelerated filer☐Non-accelerated filer☐Smaller reporting company☐Emerging growth company☐\n' +
    '•if an emerging growth company, if the registrant has elected not to use the extended transition period for complying with any new or revised financial\n' +
    'accounting standards provided pursuant to Section 13(a) of the Exchange Act.\n' +
    ' ̈\n' +
    "•whether the registrant has filed a report on and attestation to its management's assessment of the effectiveness of its internal control over financial\n" +
    'reporting under Section 404(b) of the Sarbanes-Oxley Act (15 U.S.C. 7262(b)) by the registered public accounting firm that prepared or issued its audit\n' +
    'report.\n' +
    'þ\n' +
    '•if securities are registered pursuant to Section 12(b) of the Act, whether the financial statements of the registrant included in the filing reflect the\n' +
    'correction of an error to previously issued financial statements.\n' +
    ' ̈\n' +
    '•whether any of those error corrections are restatements that required a recovery analysis of incentive-based compensation received by any of the\n' +
    "registrant's executive officers during the relevant recovery period pursuant to § 240.10D-1(b).\n" +
    ' ̈\n' +
    '•\n' +
    'whether the registrant is a shell company (as defined in Rule 12b-2 of the Act).☐þ\n' +
    "As of November 30, 2022, the aggregate market values of the Registrant's Common Stock held by non-affiliates were:\n" +
    'Class A$7,831,564,572 \n' +
    'Class B136,467,702,472 \n' +
    '$144,299,267,044 ',
  metadata: {
    source: '../../../../data/nke-10k-2023.pdf',
    pdf: {
      version: '1.10.100',
      info: [Object],
      metadata: null,
      totalPages: 107
    },
    loc: { pageNumber: 1 }
  },
  id: undefined
}
```

```typescript
console.log(docs[0].metadata)
```

```javascript
{
  source: '../../../../data/nke-10k-2023.pdf',
  pdf: {
    version: '1.10.100',
    info: {
      PDFFormatVersion: '1.4',
      IsAcroFormPresent: false,
      IsXFAPresent: false,
      Title: '0000320187-23-000039',
      Author: 'EDGAR Online, a division of Donnelley Financial Solutions',
      Subject: 'Form 10-K filed on 2023-07-20 for the period ending 2023-05-31',
      Keywords: '0000320187-23-000039; ; 10-K',
      Creator: 'EDGAR Filing HTML Converter',
      Producer: 'EDGRpdf Service w/ EO.Pdf 22.0.40.0',
      CreationDate: "D:20230720162200-04'00'",
      ModDate: "D:20230720162208-04'00'"
    },
    metadata: null,
    totalPages: 107
  },
  loc: { pageNumber: 1 }
}
```

## 用法，每个文件一个文档

```typescript
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

const singleDocPerFileLoader = new PDFLoader(nike10kPdfPath, {
  splitPages: false,
});

const singleDoc = await singleDocPerFileLoader.load();
console.log(singleDoc[0].pageContent.slice(0, 100))
```

```text
Table of Contents
UNITED STATES
SECURITIES AND EXCHANGE COMMISSION
Washington, D.C. 20549
FORM 10-K
```

## 用法，自定义 `pdfjs` 构建

默认情况下，我们使用 `pdf-parse` 捆绑的 `pdfjs` 构建，它与大多数环境兼容，包括 Node.js 和现代浏览器。如果你想使用更新版本的 `pdfjs-dist`，或者想使用自定义构建的 `pdfjs-dist`，可以通过提供一个自定义的 `pdfjs` 函数来实现，该函数返回一个解析为 `PDFJS` 对象的 Promise。

在下面的示例中，我们使用了 `pdfjs-dist` 的“遗留”版本（参见 [pdfjs 文档](https://github.com/mozilla/pdf.js/wiki/Frequently-Asked-Questions#which-browsersenvironments-are-supported)），该版本包含了一些默认构建中没有的 polyfill。

::: code-group

```bash [npm]
npm install pdfjs-dist
```

```bash [yarn]
yarn add pdfjs-dist
```

```bash [pnpm]
pnpm add pdfjs-dist
```

:::

```typescript
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

const customBuildLoader = new PDFLoader(nike10kPdfPath, {
  // 你可能需要在导入语句末尾添加 `.then(m => m.default)`
  // @lc-ts-ignore
  pdfjs: () => import("pdfjs-dist/legacy/build/pdf.js"),
});
```

## 消除多余空格

PDF 文件种类繁多，这使得读取它们成为一项挑战。加载器默认解析单个文本元素并用空格将它们连接起来，但如果你看到过多的空格，这可能不是期望的行为。在这种情况下，你可以像这样用空字符串覆盖分隔符：

```typescript
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

const noExtraSpacesLoader = new PDFLoader(nike10kPdfPath, {
  parsedItemSeparator: "",
});

const noExtraSpacesDocs = await noExtraSpacesLoader.load();
console.log(noExtraSpacesDocs[0].pageContent.slice(100, 250))
```

```text
(Mark One)
☑ ANNUAL REPORT PURSUANT TO SECTION 13 OR 15(D) OF THE SECURITIES EXCHANGE ACT OF 1934
FOR THE FISCAL YEAR ENDED MAY 31, 2023
OR
☐ TRANSITI
```

## 加载目录

```typescript
import { DirectoryLoader } from "@langchain/classic/document_loaders/fs/directory";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const exampleDataPath = "../../../../../../examples/src/document_loaders/example_data/";

/* 加载指定目录内的所有 PDF 文件 */
const directoryLoader = new DirectoryLoader(
  exampleDataPath,
  {
    ".pdf": (path: string) => new PDFLoader(path),
  }
);

const directoryDocs = await directoryLoader.load();

console.log(directoryDocs[0]);

/* 附加步骤：使用任何 TextSplitter 将文本分割成块。然后你可以将其用作上下文或之后保存到内存中。 */
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});

const splitDocs = await textSplitter.splitDocuments(directoryDocs);
console.log(splitDocs[0]);
```

```text
Unknown file type: Star_Wars_The_Clone_Wars_S06E07_Crisis_at_the_Heart.srt
Unknown file type: example.txt
Unknown file type: notion.md
Unknown file type: bad_frontmatter.md
Unknown file type: frontmatter.md
Unknown file type: no_frontmatter.md
Unknown file type: no_metadata.md
Unknown file type: tags_and_frontmatter.md
Unknown file type: test.mp3
```

```javascript
Document {
  pageContent: 'Bitcoin: A Peer-to-Peer Electronic Cash System\n' +
'Satoshi Nakamoto\n' +
'satoshin@gmx.com\n' +
'www.bitcoin.org\n' +
'Abstract.   A  purely   peer-to-peer   version   of   electronic   cash   would   allow   online \n' +
'payments   to   be   sent   directly   from   one   party   to   another   without   going   through   a \n' +
'financial institution.   Digital signatures provide part of the solution, but the main \n' +
'benefits are lost if a trusted third party is still required to prevent double-spending. \n' +
'We propose a solution to the double-spending problem using a peer-to-peer network. \n' +
'The   network   timestamps   transactions   by   hashing   them   into   an   ongoing   chain   of \n' +
'hash-based proof-of-work, forming a record that cannot be changed without redoing \n' +
'the proof-of-work.   The longest chain not only serves as proof of the sequence of \n' +
'events witnessed, but proof that it came from the largest pool of CPU power.   As \n' +
'long as a majority of CPU power is controlled by nodes that are not cooperating to \n' +
"attack the network,  they'll  generate the  longest  chain  and  outpace attackers.   The \n" +
'network itself requires minimal structure.   Messages are broadcast on a best effort \n' +
'basis,   and   nodes   can   leave   and   rejoin   the   network   at   will,   accepting   the   longest \n' +
'proof-of-work chain as proof of what happened while they were gone.\n' +
'1.Introduction\n' +
'Commerce on the Internet has come to rely almost exclusively on financial institutions serving as \n' +
'trusted third  parties  to process electronic payments.   While the  system works  well enough for \n' +
'most   transactions,   it   still   suffers   from   the   inherent   weaknesses   of   the   trust   based   model. \n' +
'Completely non-reversible transactions are not really possible, since financial institutions cannot \n' +
'avoid   mediating   disputes.     The   cost   of   mediation   increases   transaction   costs,   limiting   the \n' +
'minimum practical transaction size and cutting off the possibility for small casual transactions, \n' +
'and   there   is   a   broader   cost   in   the   loss   of   ability   to   make   non-reversible   payments   for   non-\n' +
'reversible services.  With the possibility of reversal, the need for trust spreads.  Merchants must \n' +
'be wary of their customers, hassling them for more information than they would otherwise need. \n' +
'A certain percentage of fraud is accepted as unavoidable.  These costs and payment uncertainties \n' +
'can be avoided in person by using physical currency, but no mechanism exists to make payments \n' +
'over a communications channel without a trusted party.\n' +
'What is needed is an electronic payment system based on cryptographic proof instead of trust, \n' +
'allowing any two willing parties to transact directly with each other without the need for a trusted \n' +
'third  party.    Transactions  that  are  computationally  impractical  to   reverse   would  protect  sellers \n' +
'from fraud, and routine escrow mechanisms could easily be implemented to protect buyers.   In \n' +
'this paper, we propose a solution to the double-spending problem using a peer-to-peer distributed \n' +
'timestamp server to generate computational proof of the chronological order of transactions.  The \n' +
'system   is   secure   as   long   as   honest   nodes   collectively   control   more   CPU   power   than   any \n' +
'cooperating group of attacker nodes.\n' +
'1',
  metadata: {
source: '/Users/bracesproul/code/lang-chain-ai/langchainjs/examples/src/document_loaders/example_data/bitcoin.pdf',
pdf: {
version: '1.10.100',
info: [Object],
metadata: null,
totalPages: 9
},
loc: { pageNumber: 1 }
  },
  id: undefined
}
Document {
  pageContent: 'Bitcoin: A Peer-to-Peer Electronic Cash System\n' +
'Satoshi Nakamoto\n' +
'satoshin@gmx.com\n' +
'www.bitcoin.org\n' +
'Abstract.   A  purely   peer-to-peer   version   of   electronic   cash   would   allow   online \n' +
'payments   to   be   sent   directly   from   one   party   to   another   without   going   through   a \n' +
'financial institution.   Digital signatures provide part of the solution, but the main \n' +
'benefits are lost if a trusted third party is still required to prevent double-spending. \n' +
'We propose a solution to the double-spending problem using a peer-to-peer network. \n' +
'The   network   timestamps   transactions   by  
