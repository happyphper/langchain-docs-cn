---
title: SerpApi
---
本页介绍了如何在 LangChain 中使用 [SerpApi 网络搜索 API](https://serpapi.com/)。
内容分为两部分：安装与设置，以及 SerpAPI 包装器的具体使用参考。

## 安装与设置
- 使用 `pip install google-search-results` 安装所需依赖
- 从[此处](https://serpapi.com/manage-api-key)获取 SerpApi API 密钥，并将其设置为环境变量 (`SERPAPI_API_KEY`)

## 包装器

### 实用工具

LangChain 提供了一个封装此 API 的 SerpAPI 实用工具。导入方式如下：

```python
from langchain_community.utilities import SerpAPIWrapper
```

关于此包装器的详细使用指南，请参阅[此笔记本](/oss/integrations/tools/serpapi)。

### 工具

你也可以轻松地将此包装器作为工具加载（以便与智能体配合使用）。
操作方式如下：

```python
from langchain_community.agent_toolkits.load_tools import load_tools
tools = load_tools(["serpapi"])
```

更多相关信息，请查看[此页面](/oss/integrations/tools)
