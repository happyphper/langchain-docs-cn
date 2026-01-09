---
title: 英特尔® Transformers 量化文本嵌入扩展
---
加载由 [Intel® Extension for Transformers](https://github.com/intel/intel-extension-for-transformers) (ITREX) 生成的量化 BGE 嵌入模型，并使用 ITREX 的 [Neural Engine](https://github.com/intel/intel-extension-for-transformers/blob/main/intel_extension_for_transformers/llm/runtime/deprecated/docs/Installation.md)（一个高性能的 NLP 后端）来加速模型推理，同时不损失精度。

更多详细信息，请参考我们的博客文章 [Efficient Natural Language Embedding Models with Intel Extension for Transformers](https://medium.com/intel-analytics-software/efficient-natural-language-embedding-models-with-intel-extension-for-transformers-2b6fcd0f8f34) 以及 [BGE 优化示例](https://github.com/intel/intel-extension-for-transformers/tree/main/examples/huggingface/pytorch/text-embedding/deployment/mteb/bge)。

```python
from langchain_community.embeddings import QuantizedBgeEmbeddings

model_name = "Intel/bge-small-en-v1.5-sts-int8-static-inc"
encode_kwargs = {"normalize_embeddings": True}  # 设置为 True 以计算余弦相似度

model = QuantizedBgeEmbeddings(
    model_name=model_name,
    encode_kwargs=encode_kwargs,
    query_instruction="Represent this sentence for searching relevant passages: ",
)
```

```text
/home/yuwenzho/.conda/envs/bge/lib/python3.9/site-packages/tqdm/auto.py:21: TqdmWarning: IProgress not found. Please update jupyter and ipywidgets. See https://ipywidgets.readthedocs.io/en/stable/user_install.html
  from .autonotebook import tqdm as notebook_tqdm
2024-03-04 10:17:17 [INFO] Start to extarct onnx model ops...
2024-03-04 10:17:17 [INFO] Extract onnxruntime model done...
2024-03-04 10:17:17 [INFO] Start to implement Sub-Graph matching and replacing...
2024-03-04 10:17:18 [INFO] Sub-Graph match and replace done...
```

## 使用方法

```python
text = "This is a test document."
query_result = model.embed_query(text)
doc_result = model.embed_documents([text])
```
