---
title: Deep Agents CLI
sidebarTitle: Use the CLI
description: 用于构建深度代理的交互式命令行界面
---
一个用于构建具有持久记忆的智能体（agent）的终端界面。智能体能够在会话间保持上下文，学习项目惯例，并在审批控制下执行代码。

Deep Agents CLI 具备以下内置功能：

* <Icon icon="file" :size="16" /> **文件操作** - 使用工具读取、写入和编辑项目中的文件，使智能体能够管理和修改代码及文档。
* <Icon icon="terminal" :size="16" /> **Shell 命令执行** - 执行 shell 命令以运行测试、构建项目、管理依赖项以及与版本控制系统交互。
* <Icon icon="magnifying-glass" :size="16" /> **网络搜索** - 搜索网络以获取最新信息和文档（需要 Tavily API 密钥）。
* <Icon icon="globe" :size="16" /> **HTTP 请求** - 向 API 和外部服务发起 HTTP 请求，用于数据获取和集成任务。
* <Icon icon="list-check" :size="16" /> **任务规划与跟踪** - 将复杂任务分解为离散步骤，并通过内置的待办事项系统跟踪进度。
* <Icon icon="brain" :size="16" /> **记忆存储与检索** - 跨会话存储和检索信息，使智能体能够记住项目惯例和学习到的模式。
* <Icon icon="head-side" :size="16" /> **人在回路** - 对敏感的工具操作要求人工批准。

<Tip>

[观看演示视频](https://youtu.be/IrnacLa9PJc?si=3yUnPbxnm2yaqVQb) 了解 Deep Agents CLI 的工作原理。

</Tip>

## 快速开始

<Steps>

<Step title="设置您的 API 密钥" icon="key">

导出为环境变量：

```bash
export ANTHROPIC_API_KEY="your-api-key"
```

或者在项目根目录创建一个 `.env` 文件：

```bash
ANTHROPIC_API_KEY=your-api-key
```

</Step>

<Step title="运行 CLI" icon="terminal">

```bash
uvx deepagents-cli
```

</Step>

<Step title="给智能体一个任务" icon="message">

```txt
> 创建一个打印 "Hello, World!" 的 Python 脚本
```

智能体会在修改文件前，通过差异对比（diff）的方式提出更改建议供您批准。

</Step>

</Steps>

:::: details 其他安装和配置选项

如有需要，可本地安装：

::: code-group

```bash [pip]
pip install deepagents-cli
```

```bash [uv]
uv add deepagents-cli
```

:::

CLI 默认使用 Anthropic Claude Sonnet 4。要使用 OpenAI：

```bash
export OPENAI_API_KEY="your-key"
```

启用网络搜索（可选）：

```bash
export TAVILY_API_KEY="your-key"
```

API 密钥可以设置为环境变量或放在 `.env` 文件中。

::::

## 配置

:::: details <Icon icon="flag" style="margin-right: 8px; vertical-align: middle;" /> 命令行选项

| 选项                 | 描述                                                 |
|------------------------|-------------------------------------------------------------|
| `--agent NAME`         | 使用具有独立记忆的命名智能体                        |
| `--auto-approve`       | 跳过工具确认提示（可通过 `Ctrl+T` 切换）       |
| `--sandbox TYPE`       | 在远程沙箱中执行：`modal`、`daytona` 或 `runloop` |
| `--sandbox-id ID`      | 重用现有沙箱                                      |
| `--sandbox-setup PATH` | 在沙箱中运行设置脚本                                 |

::::

:::: details <Icon icon="terminal" style="margin-right: 8px; vertical-align: middle;" /> CLI 命令

| 命令                              | 描述                            |
|--------------------------------------|----------------------------------------|
| `deepagents list`                    | 列出所有智能体                        |
| `deepagents help`                    | 显示帮助                              |
| `deepagents reset --agent NAME`      | 清除智能体记忆并重置为默认值|
| `deepagents reset --agent NAME --target SOURCE` | 从另一个智能体复制记忆 |

::::

## 交互模式

:::: details <Icon icon="slash" style="margin-right: 8px; vertical-align: middle;" /> 斜杠命令

在 CLI 会话中使用这些命令：

- `/tokens` - 显示令牌使用情况
- `/clear` - 清除对话历史
- `/exit` 或 `/quit` - 退出 CLI

::::

:::: details <Icon icon="terminal" style="margin-right: 8px; vertical-align: middle;" /> Bash 命令

通过在命令前添加 `!` 直接执行 shell 命令：

```bash
!git status
!npm test
!ls -la
```

::::

:::: details <Icon icon="keyboard" style="margin-right: 8px; vertical-align: middle;" /> 键盘快捷键

| 快捷键 | 操作 |
|-|-|
| `Enter` | 提交 |
| `Option+Enter` (Mac) 或 `Alt+Enter` (Windows) | 换行 |
| `Ctrl+E` | 外部编辑器 |
| `Ctrl+T` | 切换自动批准 |
| `Ctrl+C` | 中断 |
| `Ctrl+D` | 退出 |

::::

## 使用记忆设置项目惯例

智能体使用记忆优先协议，将信息以 Markdown 文件的形式存储在 `~/.deepagents/AGENT_NAME/memories/` 目录下：

1.  **研究**：在开始任务前搜索记忆以获取相关上下文
2.  **响应**：在执行过程中不确定时检查记忆
3.  **学习**：自动保存新信息供未来会话使用

使用描述性文件名按主题组织记忆：

```
~/.deepagents/backend-dev/memories/
├── api-conventions.md
├── database-schema.md
└── deployment-process.md
```

只需教导智能体一次惯例：

```bash
uvx deepagents-cli --agent backend-dev
> 我们的 API 使用 snake_case 并包含 created_at/updated_at 时间戳
```

它会在未来的会话中记住：

```bash
> 创建一个 /users 端点
# 无需提示即可应用惯例
```

## 使用远程沙箱

在隔离的远程环境中执行代码，以确保安全性和灵活性。远程沙箱提供以下优势：

  - **安全性**：保护您的本地机器免受潜在有害代码执行的影响
  - **干净的环境**：使用特定的依赖项或操作系统配置，无需本地设置
  - **并行执行**：在隔离环境中同时运行多个智能体
  - **长时间运行的任务**：执行耗时的操作而不阻塞您的机器
  - **可复现性**：确保跨团队一致的执行环境

要使用远程沙箱，请按照以下步骤操作：

1. 配置您的沙箱提供商（[Runloop](https://www.runloop.ai/)、[Daytona](https://www.daytona.io/) 或 [Modal](https://modal.com/)）：

```bash
# Runloop
export RUNLOOP_API_KEY="your-key"

# Daytona
export DAYTONA_API_KEY="your-key"

# Modal
modal setup
```

1. 使用沙箱运行 CLI：

```bash
uvx deepagents-cli --sandbox runloop --sandbox-setup ./setup.sh
```

智能体在本地运行，但所有代码操作都在远程沙箱中执行。可选的设置脚本可以配置环境变量、克隆仓库和准备依赖项。

1. （可选）创建一个 `setup.sh` 文件来配置您的沙箱环境：

```bash
#!/bin/bash
set -e

# 使用 GitHub 令牌克隆仓库
git clone https://x-access-token:${GITHUB_TOKEN}@github.com/username/repo.git $HOME/workspace
cd $HOME/workspace

# 使环境变量持久化
cat >> ~/.bashrc <<'EOF'
export GITHUB_TOKEN="${GITHUB_TOKEN}"
export OPENAI_API_KEY="${OPENAI_API_KEY}"
cd $HOME/workspace
EOF

source ~/.bashrc
```

将密钥存储在本地 `.env` 文件中，以便设置脚本访问。

<Warning>

沙箱隔离了代码执行，但智能体在面对不受信任的输入时仍然容易受到提示注入（prompt injection）攻击。请仅使用人在回路审批、短期有效的密钥和受信任的设置脚本。

请注意，沙箱 API 正在快速发展，我们预计会有更多提供商支持代理（proxy），以帮助缓解提示注入和密钥管理问题。

</Warning>

