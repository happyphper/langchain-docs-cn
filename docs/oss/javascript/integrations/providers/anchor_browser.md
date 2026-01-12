---
title: 锚点浏览器
---
[Anchor](https://anchorbrowser.io?utm=langchain) 是用于 AI 智能体（Agentic）浏览器自动化的平台，它解决了为缺乏 API 或 API 覆盖有限的 Web 应用程序自动化工作流的难题。它简化了基于浏览器的自动化的创建、部署和管理，将复杂的 Web 交互转化为简单的 API 端点。

`langchain-anchorbrowser` 提供了 3 个主要工具：
- `AnchorContentTool` - 用于以 Markdown 或 HTML 格式提取网页内容。
- `AnchorScreenshotTool` - 用于网页截图。
- `AnchorWebTaskTools` - 用于执行 Web 任务。

## 快速开始

### 安装

安装包：

::: code-group

```bash [pip]
pip install langchain-anchorbrowser
```

```bash [uv]
uv add langchain-anchorbrowser
```

:::

### 用法

导入并使用你需要的工具。Anchor Browser 所有可用工具的完整列表，请参见 [Anchor Browser 工具页面](/oss/javascript/integrations/tools/anchor_browser) 中的 **工具特性** 表格。

```python
from langchain_anchorbrowser import AnchorContentTool

# 获取 https://www.anchorbrowser.io 的 Markdown 内容
AnchorContentTool().invoke(
    {"url": "https://www.anchorbrowser.io", "format": "markdown"}
)
```

## 其他资源

- [PyPi](https://pypi.org/project/langchain-anchorbrowser)
- [GitHub](https://github.com/anchorbrowser/langchain-anchorbrowser)
- [Anchor Browser 文档](https://docs.anchorbrowser.io/introduction?utm=langchain)
- [Anchor Browser API 参考](https://docs.anchorbrowser.io/api-reference/ai-tools/perform-web-task?utm=langchain)
