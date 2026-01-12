---
title: CogniSwitch
---
>[CogniSwitch](https://www.cogniswitch.ai/aboutus) 是一个基于 API 的数据平台，它通过提取实体、概念及其关系来增强企业数据，从而将这些数据转换为多维格式，并存储在一个能够容纳这些增强功能的数据库中。在我们的案例中，数据存储在知识图谱中。这些增强后的数据现在可供大型语言模型（LLM）和其他生成式人工智能（GenAI）应用程序使用，确保数据可被消费且上下文得以保持，从而消除幻觉并保证准确性。

## 工具包

请参阅[安装说明和使用示例](/oss/python/integrations/tools/cogniswitch)。

```python
from langchain_community.agent_toolkits import CogniswitchToolkit
```

## 工具

### CogniswitchKnowledgeRequest

> 使用 CogniSwitch 服务来回答问题的工具。

```python
from langchain_community.tools.cogniswitch.tool import CogniswitchKnowledgeRequest
```

### CogniswitchKnowledgeSourceFile

> 使用 CogniSwitch 服务从文件存储数据的工具。

```python
from langchain_community.tools.cogniswitch.tool import CogniswitchKnowledgeSourceFile
```

### CogniswitchKnowledgeSourceURL

> 使用 CogniSwitch 服务从 URL 存储数据的工具。

```python
from langchain_community.tools.cogniswitch.tool import CogniswitchKnowledgeSourceURL
```

### CogniswitchKnowledgeStatus

> 使用 CogniSwitch 服务获取已上传文档或 URL 状态的工具。

```python
from langchain_community.tools.cogniswitch.tool import CogniswitchKnowledgeStatus
```
