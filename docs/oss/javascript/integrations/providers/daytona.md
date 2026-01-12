---
title: Daytona
---
>[Daytona](https://www.daytona.io/) 致力于通过提供一个安全、极速的运行时来加速 AI 创新，该运行时消除了执行障碍，并使开发者和 AI 系统都能专注于真正重要的事情——将智能代码转化为现实世界的解决方案。
>Daytona 是开源的。查看 [GitHub 仓库](https://github.com/daytonaio/daytona) 以了解更多信息并参与贡献。

## 安装与设置

安装 `langchain-daytona-data-analysis` 包。详细的安装说明，请参阅 [工具使用指南](/oss/javascript/integrations/tools/daytona_data_analysis)。

## 先决条件

- Python 3.10+
- Daytona API 密钥 ([从 Daytona 仪表板获取](https://app.daytona.io/dashboard/keys))
- 设置 `DAYTONA_API_KEY` 环境变量

## 工具

`DaytonaDataAnalysisTool` 使 LangChain 代理能够在由 Daytona 基础设施支持的隔离沙箱环境中执行安全的 Python 数据分析。

```python
from langchain_daytona_data_analysis import DaytonaDataAnalysisTool
```

有关该工具及其用法的更多详细信息，请参阅 [Daytona 工具指南](https://www.daytona.io/docs/en/langchain-data-analysis)。
