---
title: 泰加
---
> [Taiga](https://docs.taiga.io/) 是一个专为敏捷团队设计的开源项目管理平台，提供看板（Kanban）、Scrum 和问题跟踪等功能。

## 安装与设置

安装 `langchain-taiga` 包：

::: code-group

```bash [pip]
pip install langchain-taiga
```

```bash [uv]
uv add langchain-taiga
```

:::

你必须通过环境变量提供登录凭据，以便工具进行身份验证。

```bash
export TAIGA_URL="https://taiga.xyz.org/"
export TAIGA_API_URL="https://taiga.xyz.org/"
export TAIGA_USERNAME="username"
export TAIGA_PASSWORD="pw"
export OPENAI_API_KEY="OPENAI_API_KEY"
```

---

## 工具

查看[使用示例](/oss/python/integrations/tools/taiga)

---

## 工具包

`TaigaToolkit` 将多个与 Taiga 相关的工具分组到一个统一的接口中。

```python
from langchain_taiga.toolkits import TaigaToolkit

toolkit = TaigaToolkit()
tools = toolkit.get_tools()
```

---

## 未来集成

更多信息请查阅 [Taiga 开发者文档](https://docs.taiga.io/)，并关注 [langchain_taiga GitHub 仓库](https://github.com/Shikenso-Analytics/langchain-taiga) 中的更新或高级用法示例。
