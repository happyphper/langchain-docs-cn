---
title: Eden AI
---
>[Eden AI](https://docs.edenai.co/docs/getting-started-with-eden-ai) 用户界面 (UI) 专为处理 AI 项目而设计。通过 `Eden AI Portal`，您可以使用市场上最佳的引擎进行无代码 AI 开发。

## 安装与设置

访问 Eden AI API 需要一个 API 密钥，您可以通过[创建账户](https://app.edenai.run/user/register)并前往[此处](https://app.edenai.run/admin/account/settings)获取。

## 大语言模型 (LLMs)

查看[使用示例](/oss/integrations/llms/edenai)。

```python
from langchain_community.llms import EdenAI
```

## 聊天模型

查看[使用示例](/oss/integrations/chat/edenai)。

```python
from langchain_community.chat_models.edenai import ChatEdenAI
```

## 嵌入模型

查看[使用示例](/oss/integrations/text_embedding/edenai)。

```python
from langchain_community.embeddings.edenai import EdenAiEmbeddings
```

## 工具

Eden AI 提供了一系列工具，赋予您的智能体 (Agent) 执行多种任务的能力，例如：
* 语音转文本
* 文本转语音
* 文本显式内容检测
* 图像显式内容检测
* 对象检测
* OCR 发票解析
* OCR 身份证件解析

查看[使用示例](/oss/integrations/tools/edenai_tools)。

```python
from langchain_community.tools.edenai import (
    EdenAiExplicitImageTool,
    EdenAiObjectDetectionTool,
    EdenAiParsingIDTool,
    EdenAiParsingInvoiceTool,
    EdenAiSpeechToTextTool,
    EdenAiTextModerationTool,
    EdenAiTextToSpeechTool,
)
```
