---
title: 检索器
---
[检索器（retriever）](/oss/python/langchain/retrieval#building-blocks) 是一种接口，它接收一个非结构化查询并返回文档。
它比向量存储（vector store）更通用。
检索器不需要能够存储文档，只需要能够返回（或检索）它们。
检索器可以从向量存储创建，但其范围也足够广泛，包括 [Wikipedia 搜索](/oss/python/integrations/retrievers/wikipedia/) 和 [Amazon Kendra](/oss/python/integrations/retrievers/amazon_kendra_retriever/)。

检索器接受一个字符串查询作为输入，并返回一个 <a href="https://reference.langchain.com/python/langchain_core/documents/#langchain_core.documents.base.Document" target="_blank" rel="noreferrer" class="link"><code>Document</code></a> 对象列表作为输出。

请注意，所有[向量存储](/oss/python/integrations/vectorstores)都可以转换为检索器。可用的向量存储请参考向量存储[集成文档](/oss/python/integrations/vectorstores/)。
本页面列出了通过继承 BaseRetriever 实现的自定义检索器。

## 自带文档

以下检索器允许您索引和搜索自定义文档集。

| 检索器 | 自托管 | 云服务 | 包 |
|-----------|-----------|----------------|---------|
| [`AmazonKnowledgeBasesRetriever`](/oss/python/integrations/retrievers/bedrock) | ❌ | ✅ | [`langchain-aws`](https://python.langchain.com/api_reference/aws/retrievers/langchain_aws.retrievers.bedrock.AmazonKnowledgeBasesRetriever.html) |
| [`AzureAISearchRetriever`](/oss/python/integrations/retrievers/azure_ai_search) | ❌ | ✅ | [`langchain-community`](https://python.langchain.com/api_reference/community/retrievers/langchain_community.retrievers.azure_ai_search.AzureAISearchRetriever.html) |
| [`ElasticsearchRetriever`](/oss/python/integrations/retrievers/elasticsearch_retriever) | ✅ | ✅ | [`langchain-elasticsearch`](https://python.langchain.com/api_reference/elasticsearch/retrievers/langchain_elasticsearch.retrievers.ElasticsearchRetriever.html) |
| [`VertexAISearchRetriever`](/oss/python/integrations/retrievers/google_vertex_ai_search) | ❌ | ✅ | [`langchain-google-community`](https://python.langchain.com/api_reference/google_community/vertex_ai_search/langchain_google_community.vertex_ai_search.VertexAISearchRetriever.html) |

## 外部索引

以下检索器将搜索外部索引（例如，由互联网数据或类似数据构建）。

| 检索器 | 来源 | 包 |
|-----------|---------|---------|
| [`ArxivRetriever`](/oss/python/integrations/retrievers/arxiv) | [arxiv.org](https://arxiv.org/) 上的学术文章 | [`langchain-community`](https://python.langchain.com/api_reference/community/retrievers/langchain_community.retrievers.arxiv.ArxivRetriever.html) |
| [`TavilySearchAPIRetriever`](/oss/python/integrations/retrievers/tavily) | 互联网搜索 | [`langchain-community`](https://python.langchain.com/api_reference/community/retrievers/langchain_community.retrievers.tavily_search_api.TavilySearchAPIRetriever.html) |
| [`WikipediaRetriever`](/oss/python/integrations/retrievers/wikipedia) | [Wikipedia](https://www.wikipedia.org/) 文章 | [`langchain-community`](https://python.langchain.com/api_reference/community/retrievers/langchain_community.retrievers.wikipedia.WikipediaRetriever.html) |

## 所有检索器

<Columns :cols="3">

<Card title="Activeloop Deep Memory" icon="link" href="/oss/integrations/retrievers/activeloop" arrow="true" cta="查看指南" />
<Card title="Amazon Kendra" icon="link" href="/oss/integrations/retrievers/amazon_kendra_retriever" arrow="true" cta="查看指南" />
<Card title="Arcee" icon="link" href="/oss/integrations/retrievers/arcee" arrow="true" cta="查看指南" />
<Card title="Arxiv" icon="link" href="/oss/integrations/retrievers/arxiv" arrow="true" cta="查看指南" />
<Card title="AskNews" icon="link" href="/oss/integrations/retrievers/asknews" arrow="true" cta="查看指南" />
<Card title="Azure AI Search" icon="link" href="/oss/integrations/retrievers/azure_ai_search" arrow="true" cta="查看指南" />
<Card title="Bedrock (Knowledge Bases)" icon="link" href="/oss/integrations/retrievers/bedrock" arrow="true" cta="查看指南" />
<Card title="BM25" icon="link" href="/oss/integrations/retrievers/bm25" arrow="true" cta="查看指南" />
<Card title="Box" icon="link" href="/oss/integrations/retrievers/box" arrow="true" cta="查看指南" />
<Card title="BREEBS (Open Knowledge)" icon="link" href="/oss/integrations/retrievers/breebs" arrow="true" cta="查看指南" />
<Card title="Chaindesk" icon="link" href="/oss/integrations/retrievers/chaindesk" arrow="true" cta="查看指南" />
<Card title="ChatGPT plugin" icon="link" href="/oss/integrations/retrievers/chatgpt-plugin" arrow="true" cta="查看指南" />
<Card title="Cognee" icon="link" href="/oss/integrations/retrievers/cognee" arrow="true" cta="查看指南" />
<Card title="Cohere reranker" icon="link" href="/oss/integrations/retrievers/cohere-reranker" arrow="true" cta="查看指南" />
<Card title="Cohere RAG" icon="link" href="/oss/integrations/retrievers/cohere" arrow="true" cta="查看指南" />
<Card title="Contextual AI Reranker" icon="link" href="/oss/integrations/retrievers/contextual" arrow="true" cta="查看指南" />
<Card title="Dappier" icon="link" href="/oss/integrations/retrievers/dappier" arrow="true" cta="查看指南" />
<Card title="DocArray" icon="link" href="/oss/integrations/retrievers/docarray_retriever" arrow="true" cta="查看指南" />
<Card title="Dria" icon="link" href="/oss/integrations/retrievers/dria_index" arrow="true" cta="查看指南" />
<Card title="ElasticSearch BM25" icon="link" href="/oss/integrations/retrievers/elastic_search_bm25" arrow="true" cta="查看指南" />
<Card title="Elasticsearch" icon="link" href="/oss/integrations/retrievers/elasticsearch_retriever" arrow="true" cta="查看指南" />
<Card title="Embedchain" icon="link" href="/oss/integrations/retrievers/embedchain" arrow="true" cta="查看指南" />
<Card title="FlashRank reranker" icon="link" href="/oss/integrations/retrievers/flashrank-reranker" arrow="true" cta="查看指南" />
<Card title="Fleet AI Context" icon="link" href="/oss/integrations/retrievers/fleet_context" arrow="true" cta="查看指南" />
<Card title="Galaxia" icon="link" href="/oss/integrations/retrievers/galaxia-retriever" arrow="true" cta="查看指南" />
<Card title="Google Drive" icon="link" href="/oss/integrations/retrievers/google_drive" arrow="true" cta="查看指南" />
<Card title="Google Vertex AI Search" icon="link" href="/oss/integrations/retrievers/google_vertex_ai_search" arrow="true" cta="查看指南" />
<Card title="Graph RAG" icon="link" href="/oss/integrations/retrievers/graph_rag" arrow="true" cta="查看指南" />
<Card title="GreenNode" icon="link" href="/oss/integrations/retrievers/greennode_reranker" arrow="true" cta="查看指南" />
<Card title="IBM watsonx.ai" icon="link" href="/oss/integrations/retrievers/ibm_watsonx_ranker" arrow="true" cta="查看指南" />
<Card title="JaguarDB Vector Database" icon="link" href="/oss/integrations/retrievers/jaguar" arrow="true" cta="查看指南" />
<Card title="Kay.ai" icon="link" href="/oss/integrations/retrievers/kay" arrow="true" cta="查看指南" />
<Card title="Kinetica Vectorstore" icon="link" href="/oss/integrations/retrievers/kinetica" arrow="true" cta="查看指南" />
<Card title="kNN" icon="link" href="/oss/integrations/retrievers/knn" arrow="true" cta="查看指南" />
<Card title="LinkupSearchRetriever" icon="link" href="/oss/integrations/retrievers/linkup_search" arrow="true" cta="查看指南" />
<Card title="LLMLingua Document Compressor" icon="link" href="/oss/integrations/retrievers/llmlingua" arrow="true" cta="查看指南" />
<Card title="LOTR (Merger Retriever)" icon="link" href="/oss/integrations/retrievers/merger_retriever" arrow="true" cta="查看指南" />
<Card title="Metal" icon="link" href="/oss/integrations/retrievers/metal" arrow="true" cta="查看指南" />
<Card title="NanoPQ (Product Quantization)" icon="link" href="/oss/integrations/retrievers/nanopq" arrow="true" cta="查看指南" />
<Card title="Nebius" icon="link" href="/oss/integrations/retrievers/nebius" arrow="true" cta="查看指南" />
<Card title="needle" icon="link" href="/oss/integrations/retrievers/needle" arrow="true" cta="查看指南" />
<Card title="Nimble" icon="link" href="/oss/integrations/retrievers/nimble" arrow="true" cta="查看指南" />
<Card title="Outline" icon="link" href="/oss/integrations/retrievers/outline" arrow="true" cta="查看指南" />
<Card title="Permit" icon="link" href="/oss/integrations/retrievers/permit" arrow="true" cta="查看指南" />
<Card title="Pinecone Hybrid Search" icon="link" href="/oss/integrations/retrievers/pinecone_hybrid_search" arrow="true" cta="查看指南" />
<Card title="Pinecone Rerank" icon="link" href="/oss/integrations/retrievers/pinecone_rerank" arrow="true" cta="查看指南" />
<Card title="PubMed" icon="link" href="/oss/integrations/retrievers/pubmed" arrow="true" cta="查看指南" />
<Card title="Qdrant Sparse Vector" icon="link" href="/oss/integrations/retrievers/qdrant-sparse" arrow="true" cta="查看指南" />
<Card title="RAGatouille" icon="link" href="/oss/integrations/retrievers/ragatouille" arrow="true" cta="查看指南" />
<Card title="RePhraseQuery" icon="link" href="/oss/integrations/retrievers/re_phrase" arrow="true" cta="查看指南" />
<Card title="Rememberizer" icon="link" href="/oss/integrations/retrievers/rememberizer" arrow="true" cta="查看指南" />
<Card title="SEC filing" icon="link" href="/oss/integrations/retrievers/sec_filings" arrow="true" cta="查看指南" />
<Card title="SVM" icon="link" href="/oss/integrations/retrievers/svm" arrow="true" cta="查看指南" />
<Card title="TavilySearchAPI" icon="link" href="/oss/integrations/retrievers/tavily" arrow="true" cta="查看指南" />
<Card title="TF-IDF" icon="link" href="/oss/integrations/retrievers/tf_idf" arrow="true" cta="查看指南" />
<Card title="NeuralDB" icon="link" href="/oss/integrations/retrievers/thirdai_neuraldb" arrow="true" cta="查看指南" />
<Card title="ValyuContext" icon="link" href="/oss/integrations/retrievers/valyu" arrow="true" cta="查看指南" />
<Card title="Vectorize" icon="link" href="/oss/integrations/retrievers/vectorize" arrow="true" cta="查看指南" />
<Card title="Vespa" icon="link" href="/oss/integrations/retrievers/vespa" arrow="true" cta="查看指南" />
<Card title="Wikipedia" icon="link" href="/oss/integrations/retrievers/wikipedia" arrow="true" cta="查看指南" />
<Card title="You.com" icon="link" href="/oss/integrations/retrievers/you-retriever" arrow="true" cta="查看指南" />
<Card title="Zep Cloud" icon="link" href="/oss/integrations/retrievers/zep_cloud_memorystore" arrow="true" cta="查看指南" />
<Card title="Zep Open Source" icon="link" href="/oss/integrations/retrievers/zep_memorystore" arrow="true" cta="查看指南" />
<Card title="Zotero" icon="link" href="/oss/integrations/retrievers/zotero" arrow="true" cta="查看指南" />

</Columns>

