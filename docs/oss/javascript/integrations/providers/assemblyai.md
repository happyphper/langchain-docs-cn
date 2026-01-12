---
title: AssemblyAI
---
>[AssemblyAI](https://www.assemblyai.com/) 构建用于语音转文本、说话人分离、语音摘要等任务的 `Speech AI` 模型。
> `AssemblyAI` 的 Speech AI 模型包括针对语音数据（如通话、虚拟会议和播客）的精准语音转文本、说话人检测、情感分析、
> 章节检测和 PII 信息脱敏。

## 安装与设置

获取您的 [API 密钥](https://www.assemblyai.com/dashboard/signup)。

安装 `assemblyai` 包。

::: code-group

```bash [pip]
pip install -U assemblyai
```

```bash [uv]
uv add assemblyai
```

:::

## 文档加载器

###  AssemblyAI 音频转录

`AssemblyAIAudioTranscriptLoader` 使用 `AssemblyAI API` 转录音频文件，并将转录后的文本加载到文档中。

查看 [使用示例](/oss/javascript/integrations/document_loaders/assemblyai)。

```python
from langchain_community.document_loaders import AssemblyAIAudioTranscriptLoader
```

###  按 ID 加载 AssemblyAI 音频

`AssemblyAIAudioLoaderById` 使用 AssemblyAI API 获取现有的转录结果，并根据指定的格式将转录文本加载到一个或多个文档中。

```python
from langchain_community.document_loaders import AssemblyAIAudioLoaderById
```
