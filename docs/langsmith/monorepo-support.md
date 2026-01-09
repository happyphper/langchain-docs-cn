---
title: Monorepo 支持
sidebarTitle: Monorepo support
---
LangSmith 支持从单体仓库（monorepo）设置中部署智能体，其中您的智能体代码可能依赖于仓库中其他位置的共享包。本指南展示了如何构建您的单体仓库并配置 `langgraph.json` 文件以处理共享依赖。

## 仓库结构

完整的可运行示例，请参阅：
- [Python 单体仓库示例](https://github.com/langchain-ai/python-langraph-monorepo-example)
- [JS 单体仓库示例](https://github.com/langchain-ai/js-langraph-monorepo-example)

::: code-group

```plaintext [Python]
my-monorepo/
├── shared-utils/           # 共享 Python 包
│   ├── __init__.py
│   ├── common.py
│   └── pyproject.toml      # 或 setup.py
├── agents/
│   └── customer-support/   # 智能体目录
│       ├── agent/
│       │   ├── __init__.py
│       │   └── graph.py
│       ├── langgraph.json  # 智能体目录中的配置文件
│       ├── .env
│       └── pyproject.toml  # 智能体依赖项
└── other-service/
    └── ...
```

```plaintext [JS]
my-monorepo/
├── package.json            # 包含工作区的根 package.json
├── shared-utils/           # 共享 TypeScript 包
│   ├── package.json
│   ├── src/
│   │   └── index.ts
│   └── tsconfig.json
├── agents/
│   └── customer-support/   # 智能体目录
│       ├── src/
│       │   └── agent.ts
│       ├── langgraph.json  # 智能体目录中的配置文件
│       ├── package.json    # 智能体依赖项
│       ├── .env
│       └── tsconfig.json
└── other-service/
    └── ...
```

:::

## LangGraph.json 配置

将 `langgraph.json` 文件放在您的智能体目录中（而不是单体仓库的根目录）。确保文件遵循所需的结构：

::: code-group

```json [Python]
{
  "dependencies": [
    ".",                    # 当前智能体包
    "../../shared-utils"    # 指向共享包的相对路径
  ],
  "graphs": {
    "customer_support": "./agent/graph.py:graph"
  },
  "env": ".env"
}
```

```json [JS]
{
  "node_version": "20",
  "graphs": {
    "customer_support": "./src/agent.ts:graph"
  },
  "env": ".env"
}
```

:::

Python 实现通过以下方式自动处理父目录中的包：
- 检测以 `"."` 开头的相对路径。
- 根据需要将父目录添加到 Docker 构建上下文。
- 支持真实的包（带有 `pyproject.toml`/`setup.py`）和简单的 Python 模块。

对于 JavaScript 单体仓库：
- 共享工作区依赖项由您的包管理器自动解析。
- 您的 `package.json` 应使用工作区语法引用共享包。

智能体目录中的 `package.json` 示例：

```json
{
  "name": "customer-support-agent",
  "dependencies": {
    "@company/shared-utils": "workspace:*",
    "@langchain/langgraph": "^0.2.0"
  }
}
```

## 构建应用程序

运行 `langgraph build`：

::: code-group

```bash [Python]
cd agents/customer-support
langgraph build -t my-customer-support-agent
```

```bash [JS]
# 从单体仓库的根目录运行
langgraph build -t my-customer-support-agent -c agents/customer-support/langgraph.json --build-command "yarn run turbo build" --install-command "yarn install"
```

:::

Python 构建过程：
1. 自动检测相对依赖路径。
2. 将共享包复制到 Docker 构建上下文中。
3. 按正确顺序安装所有依赖项。
4. 无需特殊标志或命令。

JavaScript 构建过程：
1. 使用您调用 `langgraph build` 的目录（本例中为单体仓库根目录）作为构建上下文。
2. 自动检测您的包管理器（yarn、npm、pnpm、bun）。
3. 运行相应的安装命令。
    - 如果您有一个或两个自定义构建/安装命令，它将从您调用 `langgraph build` 的目录运行。
    - 否则，它将从 `langgraph.json` 文件所在的目录运行。
4. （可选）从 `langgraph.json` 文件所在的目录运行自定义构建命令（仅在您传递 `--build-command` 标志时）。

## 技巧与最佳实践

1.  **将智能体配置保存在智能体目录中**：将 `langgraph.json` 文件放在特定的智能体目录中，而不是单体仓库的根目录。这允许您在同一单体仓库中支持多个智能体，而无需将它们全部部署在同一个 LangSmith 部署中。

2.  **对 Python 使用相对路径**：对于 Python 单体仓库，在 `dependencies` 数组中使用像 `"../../shared-package"` 这样的相对路径。

3.  **对 JS 利用工作区特性**：对于 JavaScript/TypeScript，使用包管理器的工作区特性来管理包之间的依赖关系。

4.  **首先在本地测试**：在部署之前，始终在本地测试您的构建，以确保所有依赖项都正确解析。

5.  **环境变量**：将环境文件（`.env`）保存在您的智能体目录中，用于特定环境的配置。
