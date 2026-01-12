---
title: 以撒
---
[Isaacus](https://isaacus.com/) 是一家基础性的法律人工智能研究公司，致力于为法律科技生态系统构建 AI 模型、应用程序和工具。

Isaacus 提供的产品包括 [Kanon 2 Embedder](https://isaacus.com/blog/introducing-kanon-2-embedder)（根据 [Massive Legal Embedding Benchmark](https://isaacus.com/blog/introducing-mleb) 评测，它是全球最佳的法律嵌入模型），以及 [法律零样本分类](https://docs.isaacus.com/models/introduction#universal-classification) 和 [法律抽取式问答模型](https://docs.isaacus.com/models/introduction#answer-extraction)。

Isaacus 为 LangChain 的嵌入接口提供一流的支持，可通过 [`langchain-isaacus`](https://pypi.org/project/langchain-isaacus/) 集成包访问。

## 设置
要开始在 LangChain 中使用 Isaacus 模型，请前往 [Isaacus 平台](https://platform.isaacus.com/accounts/signup/) 并创建一个新账户。

注册后，请 [添加付款方式](https://platform.isaacus.com/billing/)（从而领取您的 [免费额度](https://docs.isaacus.com/pricing/credits)）并 [生成一个 API 密钥](https://platform.isaacus.com/users/api-keys/)。

接下来，安装 [`langchain-isaacus`](https://pypi.org/project/langchain-isaacus/) 集成包：

::: code-group

```bash [pip]
pip install langchain-isaacus
```

```bash [uv]
uv add langchain-isaacus
```

:::

然后，您应该将 `ISAACUS_API_KEY` 环境变量设置为您的 Isaacus API 密钥。

::: code-group

```bash [bash]
export ISAACUS_API_KEY="your_api_key_here"
```

```powershell [powershell]
$env:ISAACUS_API_KEY="your_api_key_here"
```

:::

## 嵌入
下面的代码片段演示了如何使用 Isaacus 的 Kanon 2 Embedder 模型，通过 LangChain 评估法律查询与法律文档之间的语义相似性。关于如何使用 Isaacus LangChain 集成生成嵌入的更详细教程，请参见 [此处](/oss/python/integrations/text_embedding/isaacus)。

```python
import numpy as np # 注意：您可能需要 `pip install numpy`。

from langchain_isaacus import IsaacusEmbeddings

# 为 Kanon 2 Embedder 创建一个 Isaacus API 客户端。
client = IsaacusEmbeddings(
    "kanon-2-embedder",
    # dimensions=1792, # 您可以选择性地指定一个较低的维度。
)

# 嵌入一个示例文档。
document_embedding = client.embed_documents(texts=["These are GitHub's billing policies."])[0]

# 嵌入我们的搜索查询。
relevant_query_embedding = client.embed_query(text="What are GitHub's billing policies?")
irrelevant_query_embedding = client.embed_query(text="What are Microsoft's billing policies?")

# 计算查询与文档之间的相似度。
relevant_similarity = np.dot(relevant_query_embedding, document_embedding)
irrelevant_similarity = np.dot(irrelevant_query_embedding, document_embedding)

# 记录结果。
print(f"Similarity of relevant query to the document: {relevant_similarity * 100:.2f}")
print(f"Similarity of irrelevant query to the document: {irrelevant_similarity * 100:.2f}")
```
