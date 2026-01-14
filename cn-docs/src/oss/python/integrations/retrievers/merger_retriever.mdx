---
title: LOTR（合并检索器）
---
>`检索器之王 (LOTR)`，也称为 `MergerRetriever`，它接收一个检索器列表作为输入，并将它们的 `get_relevant_documents()` 方法的结果合并成一个单一的列表。合并后的结果将是一个与查询相关且已由不同检索器排名的文档列表。

`MergerRetriever` 类可以通过多种方式提高文档检索的准确性。首先，它可以合并多个检索器的结果，这有助于降低结果中的偏见风险。其次，它可以对不同检索器的结果进行排序，这有助于确保首先返回最相关的文档。

```python
import os

import chromadb
from langchain_classic.retrievers import (
    ContextualCompressionRetriever,
    MergerRetriever,
)
from langchain_classic.retrievers.document_compressors import DocumentCompressorPipeline
from langchain_chroma import Chroma
from langchain_community.document_transformers import (
    EmbeddingsClusteringFilter,
    EmbeddingsRedundantFilter,
)
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_openai import OpenAIEmbeddings

# 获取 3 种不同的嵌入模型。
all_mini = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
multi_qa_mini = HuggingFaceEmbeddings(model_name="multi-qa-MiniLM-L6-dot-v1")
filter_embeddings = OpenAIEmbeddings()

ABS_PATH = os.path.dirname(os.path.abspath(__file__))
DB_DIR = os.path.join(ABS_PATH, "db")

# 实例化 2 个不同的 chromadb 索引，每个使用不同的嵌入模型。
client_settings = chromadb.config.Settings(
    is_persistent=True,
    persist_directory=DB_DIR,
    anonymized_telemetry=False,
)
db_all = Chroma(
    collection_name="project_store_all",
    persist_directory=DB_DIR,
    client_settings=client_settings,
    embedding_function=all_mini,
)
db_multi_qa = Chroma(
    collection_name="project_store_multi",
    persist_directory=DB_DIR,
    client_settings=client_settings,
    embedding_function=multi_qa_mini,
)

# 定义 2 个不同的检索器，使用 2 种不同的嵌入模型和不同的搜索类型。
retriever_all = db_all.as_retriever(
    search_type="similarity", search_kwargs={"k": 5, "include_metadata": True}
)
retriever_multi_qa = db_multi_qa.as_retriever(
    search_type="mmr", search_kwargs={"k": 5, "include_metadata": True}
)

# 检索器之王将持有两个检索器的输出，并且可以像任何其他检索器一样用于不同类型的链。
lotr = MergerRetriever(retrievers=[retriever_all, retriever_multi_qa])
```

## 从合并的检索器中移除冗余结果

```python
# 我们可以使用另一个嵌入模型来移除两个检索器中的冗余结果。
# 在不同的步骤中使用多个嵌入模型可能有助于减少偏见。
filter = EmbeddingsRedundantFilter(embeddings=filter_embeddings)
pipeline = DocumentCompressorPipeline(transformers=[filter])
compression_retriever = ContextualCompressionRetriever(
    base_compressor=pipeline, base_retriever=lotr
)
```

## 从合并的检索器中选取有代表性的文档样本

```python
# 此过滤器将把文档向量划分为按意义划分的聚类或"中心"。
# 然后，它将选取最接近该中心的文档作为最终结果。
# 默认情况下，结果文档将按聚类排序/分组。
filter_ordered_cluster = EmbeddingsClusteringFilter(
    embeddings=filter_embeddings,
    num_clusters=10,
    num_closest=1,
)

# 如果你希望最终文档按原始检索器分数排序，
# 则需要添加 "sorted" 参数。
filter_ordered_by_retriever = EmbeddingsClusteringFilter(
    embeddings=filter_embeddings,
    num_clusters=10,
    num_closest=1,
    sorted=True,
)

pipeline = DocumentCompressorPipeline(transformers=[filter_ordered_by_retriever])
compression_retriever = ContextualCompressionRetriever(
    base_compressor=pipeline, base_retriever=lotr
)
```

## 重新排序结果以避免性能下降

无论你的模型架构如何，当你包含 10 个以上的检索文档时，性能都会显著下降。
简而言之：当模型必须在长上下文的中间访问相关信息时，它们往往会忽略提供的文档。
参见：[arxiv.org/abs//2307.03172](https://arxiv.org/abs//2307.03172)

```python
# 你可以在移除冗余后使用额外的文档转换器来重新排序文档。
from langchain_community.document_transformers import LongContextReorder

filter = EmbeddingsRedundantFilter(embeddings=filter_embeddings)
reordering = LongContextReorder()
pipeline = DocumentCompressorPipeline(transformers=[filter, reordering])
compression_retriever_reordered = ContextualCompressionRetriever(
    base_compressor=pipeline, base_retriever=lotr
)
```
