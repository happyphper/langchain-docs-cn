---
title: AssemblyAI 音频转录
---
`AssemblyAIAudioTranscriptLoader` 允许通过 [AssemblyAI API](https://www.assemblyai.com) 转录音频文件，并将转录后的文本加载到文档中。

要使用它，你需要安装 `assemblyai` Python 包，并设置环境变量 `ASSEMBLYAI_API_KEY` 为你的 API 密钥。或者，API 密钥也可以作为参数传递。

关于 AssemblyAI 的更多信息：

- [网站](https://www.assemblyai.com/)
- [获取免费 API 密钥](https://www.assemblyai.com/dashboard/signup)
- [AssemblyAI API 文档](https://www.assemblyai.com/docs)

## 安装

首先，你需要安装 `assemblyai` Python 包。

你可以在 [assemblyai-python-sdk GitHub 仓库](https://github.com/AssemblyAI/assemblyai-python-sdk) 中找到更多相关信息。

```python
pip install -qU  assemblyai
```

## 示例

`AssemblyAIAudioTranscriptLoader` 至少需要 `file_path` 参数。音频文件可以指定为 URL 或本地文件路径。

```python
from langchain_community.document_loaders import AssemblyAIAudioTranscriptLoader

audio_file = "https://storage.googleapis.com/aai-docs-samples/nbc.mp3"
# 或者本地文件路径: audio_file = "./nbc.mp3"

loader = AssemblyAIAudioTranscriptLoader(file_path=audio_file)

docs = loader.load()
```

注意：调用 `loader.load()` 会阻塞，直到转录完成。

转录文本可在 `page_content` 中获取：

```python
docs[0].page_content
```

```
"Load time, a new president and new congressional makeup. Same old ..."
```

`metadata` 包含完整的 JSON 响应，其中包含更多元信息：

```python
docs[0].metadata
```

```
{'language_code': <LanguageCode.en_us: 'en_us'>,
 'audio_url': 'https://storage.googleapis.com/aai-docs-samples/nbc.mp3',
 'punctuate': True,
 'format_text': True,
  ...
}
```

## 转录格式

你可以指定 `transcript_format` 参数来获取不同格式的转录结果。

根据格式的不同，会返回一个或多个文档。以下是不同的 `TranscriptFormat` 选项：

- `TEXT`：一个包含转录文本的文档
- `SENTENCES`：多个文档，按句子分割转录文本
- `PARAGRAPHS`：多个文档，按段落分割转录文本
- `SUBTITLES_SRT`：一个文档，包含以 SRT 字幕格式导出的转录文本
- `SUBTITLES_VTT`：一个文档，包含以 VTT 字幕格式导出的转录文本

```python
from langchain_community.document_loaders.assemblyai import TranscriptFormat

loader = AssemblyAIAudioTranscriptLoader(
    file_path="./your_file.mp3",
    transcript_format=TranscriptFormat.SENTENCES,
)

docs = loader.load()
```

## 转录配置

你也可以指定 `config` 参数来使用不同的音频智能模型。

请访问 [AssemblyAI API 文档](https://www.assemblyai.com/docs) 以获取所有可用模型的概览！

```python
import assemblyai as aai

config = aai.TranscriptionConfig(
    speaker_labels=True, auto_chapters=True, entity_detection=True
)

loader = AssemblyAIAudioTranscriptLoader(file_path="./your_file.mp3", config=config)
```

## 将 API 密钥作为参数传递

除了将 API 密钥设置为环境变量 `ASSEMBLYAI_API_KEY` 外，也可以将其作为参数传递。

```python
loader = AssemblyAIAudioTranscriptLoader(
    file_path="./your_file.mp3", api_key="YOUR_KEY"
)
```
