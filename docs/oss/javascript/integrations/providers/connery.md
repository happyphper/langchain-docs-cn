---
title: 康纳利
---
>[Connery SDK](https://github.com/connery-io/connery-sdk) 是一个 NPM 包，它同时包含一个 SDK 和一个 CLI，专为开发插件和操作（actions）而设计。

CLI 可以自动化开发过程中的许多任务。SDK 则提供了一个 JavaScript API，用于定义插件和操作，并将它们打包成一个插件服务器（plugin server）。该服务器具有一个根据元数据生成的标准化 REST API，并负责处理授权、输入验证和日志记录。这样，您就可以专注于实现操作的核心逻辑。

有关使用案例和示例，请参阅 [Connery SDK 文档](https://sdk.connery.io/docs/use-cases/)。

## 工具包

请参阅[使用示例](/oss/javascript/integrations/tools/connery)。

```python
from langchain_community.agent_toolkits.connery import ConneryToolkit
```

## 工具

### ConneryAction

```python
from langchain_community.tools.connery import ConneryService
```
