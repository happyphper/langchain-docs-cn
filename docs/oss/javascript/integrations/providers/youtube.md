---
title: YouTube
---
>[YouTube](https://www.youtube.com/) 是由 Google 运营的在线视频分享和社交媒体平台。
> 我们下载 `YouTube` 的字幕和视频信息。

## 安装与设置

::: code-group

```bash [pip]
pip install youtube-transcript-api
pip install pytube
```

```bash [uv]
uv add youtube-transcript-api
uv add pytube
```

:::

查看[使用示例](/oss/integrations/document_loaders/youtube_transcript)。

## 文档加载器

查看[使用示例](/oss/integrations/document_loaders/youtube_transcript)。

```python
from langchain_community.document_loaders import YoutubeLoader
from langchain_community.document_loaders import GoogleApiYoutubeLoader
```
