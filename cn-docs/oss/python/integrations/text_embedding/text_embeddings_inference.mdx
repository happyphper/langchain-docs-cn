---
title: 文本嵌入推理
---
>[Hugging Face 文本嵌入推理（TEI）](https://huggingface.co/docs/text-embeddings-inference/index) 是一个用于部署和服务开源文本嵌入及序列分类模型的工具包。`TEI` 为最流行的模型（包括 `FlagEmbedding`、`Ember`、`GTE` 和 `E5`）提供了高性能的嵌入提取功能。

要在 LangChain 中使用它，首先需要安装 `huggingface-hub`。

```python
pip install -U huggingface-hub
```

然后使用 TEI 来部署一个嵌入模型。例如，使用 Docker，你可以按如下方式部署 `BAAI/bge-large-en-v1.5`：

```bash
model=BAAI/bge-large-en-v1.5
revision=refs/pr/5
volume=$PWD/data # 与 Docker 容器共享一个卷，以避免每次运行都下载权重

docker run --gpus all -p 8080:80 -v $volume:/data --pull always ghcr.io/huggingface/text-embeddings-inference:0.6 --model-id $model --revision $revision
```

Docker 使用的具体细节可能因底层硬件而异。例如，要在 Intel Gaudi/Gaudi2 硬件上部署模型，请参考 [tei-gaudi 仓库](https://github.com/huggingface/tei-gaudi) 获取相关的 docker run 命令。

最后，实例化客户端并对文本进行嵌入。

```python
from langchain_huggingface.embeddings import HuggingFaceEndpointEmbeddings
```

```python
embeddings = HuggingFaceEndpointEmbeddings(model="http://localhost:8080")
```

```python
text = "What is deep learning?"
```

```python
query_result = embeddings.embed_query(text)
query_result[:3]
```

```text
[0.018113142, 0.00302585, -0.049911194]
```

```python
doc_result = embeddings.embed_documents([text])
```

```python
doc_result[0][:3]
```

```text
[0.018113142, 0.00302585, -0.049911194]
```
