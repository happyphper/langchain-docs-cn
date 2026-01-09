---
title: IPEX-LLM - 在英特尔 CPU 上运行本地 BGE 嵌入模型
---
> [IPEX-LLM](https://github.com/intel-analytics/ipex-llm) 是一个 PyTorch 库，用于在英特尔 CPU 和 GPU（例如，带有集成显卡的本地 PC，或 Arc、Flex 和 Max 等独立显卡）上以极低延迟运行大语言模型（LLM）。

本示例将介绍如何使用 LangChain 在英特尔 CPU 上利用 `ipex-llm` 优化执行嵌入任务。这在 RAG、文档问答等应用中会很有帮助。

## 环境设置

```python
pip install -qU langchain langchain-community
```

安装 IPEX-LLM 以在英特尔 CPU 上获得优化，同时安装 `sentence-transformers`。

```python
pip install --pre --upgrade ipex-llm[all] --extra-index-url https://download.pytorch.org/whl/cpu
pip install sentence-transformers
```

> **注意**
>
> 对于 Windows 用户，安装 `ipex-llm` 时不需要添加 `--extra-index-url https://download.pytorch.org/whl/cpu`。

## 基本用法

```python
from langchain_community.embeddings import IpexLLMBgeEmbeddings

embedding_model = IpexLLMBgeEmbeddings(
    model_name="BAAI/bge-large-en-v1.5",
    model_kwargs={},
    encode_kwargs={"normalize_embeddings": True},
)
```

---

## API 参考

- [IpexLLMBgeEmbeddings](https://python.langchain.com/api_reference/community/embeddings/langchain_community.embeddings.ipex_llm.IpexLLMBgeEmbeddings.html)

```python
sentence = "IPEX-LLM is a PyTorch library for running LLM on Intel CPU and GPU (e.g., local PC with iGPU, discrete GPU such as Arc, Flex and Max) with very low latency."
query = "What is IPEX-LLM?"

text_embeddings = embedding_model.embed_documents([sentence, query])
print(f"text_embeddings[0][:10]: {text_embeddings[0][:10]}")
print(f"text_embeddings[1][:10]: {text_embeddings[1][:10]}")

query_embedding = embedding_model.embed_query(query)
print(f"query_embedding[:10]: {query_embedding[:10]}")
```
