---
title: ElevenLabs
---
>[ElevenLabs](https://elevenlabs.io/about) 是一家语音 AI 研究与部署公司，其使命是让内容能以任何语言和声音在全球范围内无障碍访问。

`ElevenLabs` 创造了最逼真、最通用且最具上下文感知能力的 AI 音频，能够使用 29 种语言中的数百种新老声音生成语音。

## 安装与设置

首先，你需要创建一个 ElevenLabs 账户。你可以按照[此处的说明](https://docs.elevenlabs.io/welcome/introduction)进行操作。

安装 Python 包：

::: code-group

```bash [pip]
pip install elevenlabs
```

```bash [uv]
uv add elevenlabs
```

:::

## 工具

查看[使用示例](/oss/javascript/integrations/tools/eleven_labs_tts)。

```python
from langchain_community.tools import ElevenLabsText2SpeechTool
```
