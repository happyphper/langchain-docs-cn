---
title: Epsilla
---
>[Epsilla](https://www.epsilla.com) 是一个开源的向量数据库，它利用先进的并行图遍历技术进行向量索引。Epsilla 采用 GPL-3.0 许可证。

您需要安装 `langchain-community` 包才能使用此集成，命令为 `pip install -qU langchain-community`。

本笔记本展示了如何使用与 `Epsilla` 向量数据库相关的功能。

前提条件是，您需要有一个正在运行的 Epsilla 向量数据库（例如，通过我们的 Docker 镜像），并安装 `pyepsilla` 包。完整文档请查看 [docs](https://epsilla-inc.gitbook.io/epsilladb/quick-start)。

```python
!pip/pip3 install pyepsilla
```

我们希望使用 <a href="https://reference.langchain.com/python/integrations/langchain_openai/OpenAIEmbeddings" target="_blank" rel="noreferrer" class="link"><code>OpenAIEmbeddings</code></a>，因此需要获取 OpenAI API 密钥。

```python
import getpass
import os

if "OPENAI_API_KEY" not in os.environ:
    os.environ["OPENAI_API_KEY"] = getpass.getpass("OpenAI API Key:")
```

OpenAI API Key: ········

```python
from langchain_community.vectorstores import Epsilla
from langchain_openai import OpenAIEmbeddings
```

```python
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import CharacterTextSplitter

loader = TextLoader("../../how_to/state_of_the_union.txt")
documents = loader.load()

documents = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0).split_documents(
    documents
)

embeddings = OpenAIEmbeddings()
```

Epsilla 向量数据库默认运行在主机 "localhost" 和端口 "8888"。我们使用了自定义的数据库路径、数据库名称和集合名称，而非默认值。

```python
from pyepsilla import vectordb

client = vectordb.Client()
vector_store = Epsilla.from_documents(
    documents,
    embeddings,
    client,
    db_path="/tmp/mypath",
    db_name="MyDB",
    collection_name="MyCollection",
)
```

```python
query = "What did the president say about Ketanji Brown Jackson"
docs = vector_store.similarity_search(query)
print(docs[0].page_content)
```

在一个又一个州，新的法律被通过，不仅是为了压制投票，更是为了颠覆整个选举。

我们不能让这种情况发生。

今晚。我呼吁参议院：通过《自由投票法案》。通过《约翰·刘易斯投票权法案》。同时，通过《披露法案》，让美国人知道谁在资助我们的选举。

今晚，我想向一位毕生致力于服务这个国家的人致敬：斯蒂芬·布雷耶大法官——一位陆军退伍军人、宪法学者，也是即将退休的美国最高法院大法官。布雷耶大法官，感谢您的服务。

总统最严肃的宪法职责之一，就是提名某人担任美国最高法院大法官。

我在四天前这样做了，当时我提名了联邦上诉法院法官凯坦吉·布朗·杰克逊。她是我们国家顶尖的法律人才之一，将继续传承布雷耶大法官的卓越传统。
