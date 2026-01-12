---
title: Psychic
---
本笔记本介绍了如何从 `Psychic` 加载文档。更多详情请参阅[此处](/oss/javascript/integrations/providers/psychic)。

## 前提条件

1. 请按照[此文档](/oss/javascript/integrations/providers/psychic)中的“快速开始”部分操作。
2. 登录 [Psychic 仪表板](https://dashboard.psychic.dev/) 并获取您的密钥。
3. 将前端 React 库安装到您的 Web 应用中，并让用户验证一个连接。该连接将使用您指定的连接 ID 创建。

## 加载文档

使用 `PsychicLoader` 类从连接中加载文档。每个连接都有一个连接器 ID（对应已连接的 SaaS 应用）和一个连接 ID（您传递给前端库的那个）。

```python
# 如果您尚未安装 psychicapi，请取消注释此行进行安装
!poetry run pip -q install psychicapi langchain-chroma
```

```python
from langchain_community.document_loaders import PsychicLoader
from psychicapi import ConnectorId

# 为 Google Drive 创建一个文档加载器。我们也可以通过将 connector_id 设置为适当的值来从其他连接器加载，例如 ConnectorId.notion.value
# 此加载器使用我们的测试凭据
google_drive_loader = PsychicLoader(
    api_key="7ddb61c1-8b6a-4d31-a58e-30d1c9ea480e",
    connector_id=ConnectorId.gdrive.value,
    connection_id="google-test",
)

documents = google_drive_loader.load()
```

## 将文档转换为嵌入向量

现在我们可以将这些文档转换为嵌入向量，并存储在像 Chroma 这样的向量数据库中。

```python
from langchain_classic.chains import RetrievalQAWithSourcesChain
from langchain_chroma import Chroma
from langchain_openai import OpenAI, OpenAIEmbeddings
from langchain_text_splitters import CharacterTextSplitter
```

```python
text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
texts = text_splitter.split_documents(documents)

embeddings = OpenAIEmbeddings()
docsearch = Chroma.from_documents(texts, embeddings)
chain = RetrievalQAWithSourcesChain.from_chain_type(
    OpenAI(temperature=0), chain_type="stuff", retriever=docsearch.as_retriever()
)
chain({"question": "what is psychic?"}, return_only_outputs=True)
```
