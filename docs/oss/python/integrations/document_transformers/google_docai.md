---
title: Google Cloud Document AI
---
Document AI 是 Google Cloud 提供的文档理解平台，可将文档中的非结构化数据转换为结构化数据，使其更易于理解、分析和使用。

了解更多：

- [Document AI 概述](https://cloud.google.com/document-ai/docs/overview)
- [Document AI 视频和实验](https://cloud.google.com/document-ai/docs/videos)
- [立即试用！](https://cloud.google.com/document-ai/docs/drag-and-drop)

该模块包含一个基于 Google Cloud DocAI 的 `PDF` 解析器。

您需要安装两个库才能使用此解析器：

```python
pip install -qU  langchain-google-community[docai]
```

首先，您需要按照此处的说明设置一个 Google Cloud Storage (GCS) 存储桶并创建自己的光学字符识别 (OCR) 处理器：[cloud.google.com/document-ai/docs/create-processor](https://cloud.google.com/document-ai/docs/create-processor)

`GCS_OUTPUT_PATH` 应该是 GCS 上文件夹的路径（以 `gs://` 开头），而 `PROCESSOR_NAME` 应类似于 `projects/PROJECT_NUMBER/locations/LOCATION/processors/PROCESSOR_ID` 或 `projects/PROJECT_NUMBER/locations/LOCATION/processors/PROCESSOR_ID/processorVersions/PROCESSOR_VERSION_ID`。您可以通过编程方式获取它，或从 Google Cloud Console 中 `Processor details` 选项卡的 `Prediction endpoint` 部分复制。

```python
GCS_OUTPUT_PATH = "gs://BUCKET_NAME/FOLDER_PATH"
PROCESSOR_NAME = "projects/PROJECT_NUMBER/locations/LOCATION/processors/PROCESSOR_ID"
```

```python
from langchain_core.document_loaders.blob_loaders import Blob
from langchain_google_community import DocAIParser
```

现在，创建一个 `DocAIParser`。

```python
parser = DocAIParser(
    location="us", processor_name=PROCESSOR_NAME, gcs_output_path=GCS_OUTPUT_PATH
)
```

对于此示例，您可以使用上传到公共 GCS 存储桶的 Alphabet 收益报告。

[2022Q1_alphabet_earnings_release.pdf](https://storage.googleapis.com/cloud-samples-data/gen-app-builder/search/alphabet-investor-pdfs/2022Q1_alphabet_earnings_release.pdf)

将文档传递给 `lazy_parse()` 方法以

```python
blob = Blob(
    path="gs://cloud-samples-data/gen-app-builder/search/alphabet-investor-pdfs/2022Q1_alphabet_earnings_release.pdf"
)
```

我们将获得每个页面一个文档，总共 11 个：

```python
docs = list(parser.lazy_parse(blob))
print(len(docs))
```

```text
11
```

您可以逐个地对 blob 进行端到端解析。如果您有许多文档，更好的方法可能是将它们批量处理在一起，甚至可以将解析与处理解析结果分离开来。

```python
operations = parser.docai_parse([blob])
print([op.operation.name for op in operations])
```

```python
['projects/543079149601/locations/us/operations/16447136779727347991']
```

您可以检查操作是否完成：

```python
parser.is_running(operations)
```

```text
True
```

当它们完成后，您可以解析结果：

```python
parser.is_running(operations)
```

```text
False
```

```python
results = parser.get_results(operations)
print(results[0])
```

```text
DocAIParsingResults(source_path='gs://vertex-pgt/examples/goog-exhibit-99-1-q1-2023-19.pdf', parsed_path='gs://vertex-pgt/test/run1/16447136779727347991/0')
```

现在，我们最终可以从解析结果生成文档：

```python
docs = list(parser.parse_from_results(results))
```

```python
print(len(docs))
```

```text
11
```
