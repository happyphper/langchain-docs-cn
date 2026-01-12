---
title: 检索器
---
[检索器（retriever）](/oss/javascript/langchain/retrieval) 是一种接口，它接收非结构化查询并返回文档。
它比向量存储（vector store）更通用。
检索器不需要能够存储文档，只需要能够返回（或检索）它们。

检索器接受一个字符串查询作为输入，并返回一个 `Document` 对象列表。

关于如何使用检索器的具体细节，请参阅[相关的操作指南](/oss/javascript/langchain/retrieval)。

请注意，所有[向量存储](/oss/javascript/integrations/vectorstores)都可以[转换为检索器](/oss/javascript/langchain/retrieval)。
有关可用的向量存储检索器，请参阅向量存储的[集成文档](/oss/javascript/integrations/vectorstores/)。

## 所有检索器

<Columns :cols="3">

<Card
title="Alchemyst AI Retriever"
icon="link"
href="/oss/integrations/retrievers/alchemystai-retriever"
arrow="true"
cta="查看指南"
/>
<Card
title="ArxivRetriever"
icon="link"
href="/oss/integrations/retrievers/arxiv-retriever"
arrow="true"
cta="查看指南"
/>
<Card
title="Azion EdgeSQL"
icon="link"
href="/oss/integrations/retrievers/azion-edgesql"
arrow="true"
cta="查看指南"
/>
<Card
title="Knowledge Bases for Amazon Bedrock"
icon="link"
href="/oss/integrations/retrievers/bedrock-knowledge-bases"
arrow="true"
cta="查看指南"
/>
<Card
title="BM25"
icon="link"
href="/oss/integrations/retrievers/bm25"
arrow="true"
cta="查看指南"
/>
<Card
title="Chaindesk Retriever"
icon="link"
href="/oss/integrations/retrievers/chaindesk-retriever"
arrow="true"
cta="查看指南"
/>
<Card
title="Dria Retriever"
icon="link"
href="/oss/integrations/retrievers/dria"
arrow="true"
cta="查看指南"
/>
<Card
title="Exa"
icon="link"
href="/oss/integrations/retrievers/exa"
arrow="true"
cta="查看指南"
/>
<Card
title="HyDE Retriever"
icon="link"
href="/oss/integrations/retrievers/hyde"
arrow="true"
cta="查看指南"
/>
<Card
title="Amazon Kendra Retriever"
icon="link"
href="/oss/integrations/retrievers/kendra-retriever"
arrow="true"
cta="查看指南"
/>
<Card
title="Metal Retriever"
icon="link"
href="/oss/integrations/retrievers/metal-retriever"
arrow="true"
cta="查看指南"
/>
<Card
title="Supabase Hybrid Search"
icon="link"
href="/oss/integrations/retrievers/supabase-hybrid"
arrow="true"
cta="查看指南"
/>
<Card
title="Tavily Search API"
icon="link"
href="/oss/integrations/retrievers/tavily"
arrow="true"
cta="查看指南"
/>
<Card
title="Time-Weighted Retriever"
icon="link"
href="/oss/integrations/retrievers/time-weighted-retriever"
arrow="true"
cta="查看指南"
/>
<Card
title="Vespa Retriever"
icon="link"
href="/oss/integrations/retrievers/vespa-retriever"
arrow="true"
cta="查看指南"
/>
<Card
title="Zep Cloud Retriever"
icon="link"
href="/oss/integrations/retrievers/zep-cloud-retriever"
arrow="true"
cta="查看指南"
/>
<Card
title="Zep Open Source Retriever"
icon="link"
href="/oss/integrations/retrievers/zep-retriever"
arrow="true"
cta="查看指南"
/>

</Columns>

<Info>

如果您想贡献一个集成，请参阅[贡献集成](/oss/contributing#add-a-new-integration)。

</Info>

