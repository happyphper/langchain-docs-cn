---
title: 应用结构
---
一个 LangGraph 应用由一个或多个图、一个配置文件 (`langgraph.json`)、一个指定依赖项的文件以及一个可选的用于指定环境变量的 `.env` 文件组成。

本指南展示了一个应用的典型结构，并说明如何提供所需的配置，以便通过 [LangSmith 部署](/langsmith/deployments) 来部署应用。

<Info>

LangSmith 部署是一个用于部署和扩展 LangGraph 智能体的托管平台。它处理基础设施、扩展和运维问题，因此您可以直接从代码仓库部署有状态、长时间运行的智能体。在 [部署文档](/langsmith/deployments) 中了解更多信息。

</Info>

## 关键概念

要使用 LangSmith 进行部署，需要提供以下信息：

1. 一个 [LangGraph 配置文件](#configuration-file-concepts) (`langgraph.json`)，用于指定应用的依赖项、图和环境变量。
2. 实现应用逻辑的 [图](#graphs)。
3. 一个指定运行应用所需的 [依赖项](#dependencies) 的文件。
4. 应用运行所需的 [环境变量](#environment-variables)。

## 文件结构

以下是应用目录结构的示例：

```plaintext
my-app/
├── src # 所有项目代码都在这里
│   ├── utils # 图的工具函数（可选）
│   │   ├── tools.ts # 图的工具
│   │   ├── nodes.ts # 图的节点函数
│   │   └── state.ts # 图的状态定义
│   └── agent.ts # 构建图的代码
├── package.json # 包依赖项
├── .env # 环境变量
└── langgraph.json # LangGraph 配置文件
```

<Note>

LangGraph 应用的目录结构可能因使用的编程语言和包管理器而异。

</Note>

<a id="configuration-file-concepts"></a>
## 配置文件

`langgraph.json` 文件是一个 JSON 文件，用于指定部署 LangGraph 应用所需的依赖项、图、环境变量和其他设置。

有关 JSON 文件中所有支持键的详细信息，请参阅 [LangGraph 配置文件参考](/langsmith/cli#configuration-file)。

<Tip>

[LangGraph CLI](/langsmith/cli) 默认使用当前目录下的配置文件 `langgraph.json`。

</Tip>

### 示例

* 依赖项将从本地目录的依赖项文件（例如 `package.json`）加载。
* 将从文件 `./your_package/your_file.js` 中加载一个图，函数名为 `agent`。
* 环境变量 `OPENAI_API_KEY` 是内联设置的。

```json
{
  "dependencies": ["."],
  "graphs": {
    "my_agent": "./your_package/your_file.js:agent"
  },
  "env": {
    "OPENAI_API_KEY": "secret-key"
  }
}
```

## 依赖项

LangGraph 应用可能依赖于其他 TypeScript/JavaScript 库。

通常，您需要指定以下信息以正确设置依赖项：

1. 目录中指定依赖项的文件（例如 `package.json`）。

1. [LangGraph 配置文件](#configuration-file-concepts) 中的 `dependencies` 键，用于指定运行 LangGraph 应用所需的依赖项。
2. 任何额外的二进制文件或系统库都可以使用 [LangGraph 配置文件](#configuration-file-concepts) 中的 `dockerfile_lines` 键来指定。

## 图

使用 [LangGraph 配置文件](#configuration-file-concepts) 中的 `graphs` 键来指定已部署的 LangGraph 应用中可用的图。

您可以在配置文件中指定一个或多个图。每个图由一个名称（应唯一）和一个路径标识，该路径指向：(1) 已编译的图，或 (2) 定义创建图的函数。

## 环境变量

如果您在本地处理已部署的 LangGraph 应用，可以在 [LangGraph 配置文件](#configuration-file-concepts) 的 `env` 键中配置环境变量。

对于生产部署，您通常希望在部署环境中配置环境变量。
