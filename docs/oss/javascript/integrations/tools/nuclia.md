---
title: Nuclia Understanding
---
>[Nuclia](https://nuclia.com) 能够自动索引来自任何内部和外部来源的非结构化数据，提供优化的搜索结果和生成式答案。它可以处理视频和音频转录、图像内容提取以及文档解析。

`Nuclia Understanding API` 支持处理非结构化数据，包括文本、网页、文档和音频/视频内容。它能提取所有位置的文本（在需要时使用语音转文本或 OCR），识别实体，提取元数据、嵌入文件（如 PDF 中的图像）和网页链接。它还提供内容摘要。

要使用 `Nuclia Understanding API`，您需要拥有一个 `Nuclia` 账户。您可以在 [https://nuclia.cloud](https://nuclia.cloud) 免费创建一个，然后[创建 NUA 密钥](https://docs.nuclia.dev/docs/docs/using/understanding/intro)。

```python
pip install -qU  protobuf
pip install -qU  nucliadb-protos
```

```python
import os

os.environ["NUCLIA_ZONE"] = "<YOUR_ZONE>"  # 例如：europe-1
os.environ["NUCLIA_NUA_KEY"] = "<YOUR_API_KEY>"
```

```python
from langchain_community.tools.nuclia import NucliaUnderstandingAPI

nua = NucliaUnderstandingAPI(enable_ml=False)
```

您可以使用 `push` 操作将文件推送到 Nuclia Understanding API。由于处理是异步进行的，返回结果的顺序可能与文件推送的顺序不同。因此，您需要提供一个 `id` 来将结果与相应的文件匹配。

```python
nua.run({"action": "push", "id": "1", "path": "./report.docx"})
nua.run({"action": "push", "id": "2", "path": "./interview.mp4"})
```

现在，您可以在循环中调用 `pull` 操作，直到获得 JSON 格式的结果。

```python
import time

pending = True
data = None
while pending:
    time.sleep(15)
    data = nua.run({"action": "pull", "id": "1", "path": None})
    if data:
        print(data)
        pending = False
    else:
        print("waiting...")
```

您也可以在 `async` 模式下一步完成，只需执行一次推送，它将等待直到结果被拉取：

```python
import asyncio

async def process():
    data = await nua.arun(
        {"action": "push", "id": "1", "path": "./talk.mp4", "text": None}
    )
    print(data)

asyncio.run(process())
```

## 检索到的信息

Nuclia 返回以下信息：

- 文件元数据
- 提取的文本
- 嵌套文本（如嵌入图像中的文本）
- 摘要（仅在 `enable_ml` 设置为 `True` 时提供）
- 段落和句子分割（由其首尾字符位置定义，对于视频或音频文件还包括开始时间和结束时间）
- 命名实体：人物、日期、地点、组织等（仅在 `enable_ml` 设置为 `True` 时提供）
- 链接
- 缩略图
- 嵌入文件
- 文本的向量表示（仅在 `enable_ml` 设置为 `True` 时提供）

注意：

  生成的文件（缩略图、提取的嵌入文件等）以令牌形式提供。您可以使用 [`/processing/download` 端点](https://docs.nuclia.dev/docs/api#operation/Download_binary_file_processing_download_get) 下载它们。

  此外，在任何层级，如果某个属性超过特定大小，它将被放入可下载文件中，并在文档中被替换为文件指针。这将表现为 `{"file": {"uri": "JWT_TOKEN"}}`。规则是，如果消息的大小超过 1000000 个字符，最大的部分将被移动到可下载文件中。首先，压缩过程将针对向量。如果这还不够，它将针对大型字段元数据，最后将针对提取的文本。
