---
title: Azure OpenAI Whisper 解析器
---
>[Azure OpenAI Whisper 解析器](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/whisper-overview) 是一个封装了 Azure OpenAI Whisper API 的包装器，它利用机器学习将音频文件转录为英文文本。

该解析器支持 `.mp3`、`.mp4`、`.mpeg`、`.mpga`、`.m4a`、`.wav` 和 `.webm` 格式。

当前的实现遵循 LangChain 核心原则，可以与其他加载器（loader）结合使用，以处理音频下载和解析。因此，该解析器将 `yield` 一个 `Iterator[Document]`。

## 先决条件

该服务需要 Azure 凭据、Azure 端点（endpoint）和 Whisper 模型部署（deployment），可以通过遵循[此指南](https://learn.microsoft.com/en-us/azure/ai-services/openai/whisper-quickstart?tabs=command-line%2Cpython-new%2Cjavascript&pivots=programming-language-python)进行设置。此外，必须安装所需的依赖项。

```python
pip install -Uq  langchain langchain-community openai
```

## 示例 1

`AzureOpenAIWhisperParser` 的方法 `.lazy_parse` 接受一个 `Blob` 对象作为参数，该对象包含要转录文件的文件路径。

```python
from langchain_core.documents.base import Blob

audio_path = "path/to/your/audio/file"
audio_blob = Blob(path=audio_path)
```

```python
from langchain_community.document_loaders.parsers.audio import AzureOpenAIWhisperParser

endpoint = "<your_endpoint>"
key = "<your_api_key"
version = "<your_api_version>"
name = "<your_deployment_name>"

parser = AzureOpenAIWhisperParser(
    api_key=key, azure_endpoint=endpoint, api_version=version, deployment_name=name
)
```

```python
documents = parser.lazy_parse(blob=audio_blob)
```

```python
for doc in documents:
    print(doc.page_content)
```

## 示例 2

`AzureOpenAIWhisperParser` 也可以与音频加载器（如 `YoutubeAudioLoader`）结合使用，通过 `GenericLoader` 进行加载。

```python
from langchain_community.document_loaders.blob_loaders.youtube_audio import (
    YoutubeAudioLoader,
)
from langchain_community.document_loaders.generic import GenericLoader
```

```python
# 必须是一个列表
url = ["www.youtube.url.com"]

save_dir = "save/directory/"
```

```python
name = "<your_deployment_name>"

loader = GenericLoader(
    YoutubeAudioLoader(url, save_dir), AzureOpenAIWhisperParser(deployment_name=name)
)

docs = loader.load()
```

```python
for doc in documents:
    print(doc.page_content)
```
