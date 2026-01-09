---
title: Yandex
---
所有与 Yandex Cloud 相关的功能

>[Yandex Cloud](https://cloud.yandex.com/en/) 是一个公共云平台。

## 安装与设置

可以通过 pip 从 PyPI 安装 Yandex Cloud SDK：

::: code-group

```bash [pip]
pip install yandexcloud
```

```bash [uv]
uv add yandexcloud
```

:::

## LLMs

### YandexGPT

查看[使用示例](/oss/integrations/llms/yandex)。

```python
from langchain_community.llms import YandexGPT
```

## 聊天模型

### YandexGPT

查看[使用示例](/oss/integrations/chat/yandex)。

```python
from langchain_community.chat_models import ChatYandexGPT
```

## 嵌入模型

### YandexGPT

查看[使用示例](/oss/integrations/text_embedding/yandex)。

```python
from langchain_community.embeddings import YandexGPTEmbeddings
```

## 解析器

### YandexSTTParser

它转录并解析音频文件。

`YandexSTTParser` 类似于 `OpenAIWhisperParser`。
查看[使用 OpenAIWhisperParser 的示例](/oss/integrations/document_loaders/youtube_audio)。

```python
from langchain_community.document_loaders import YandexSTTParser
```
