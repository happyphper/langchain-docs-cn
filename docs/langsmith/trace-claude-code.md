---
title: 追踪 Claude 代码
sidebarTitle: Claude Code
---
本指南将展示如何自动将 [Claude Code CLI](https://code.claude.com/docs/en/overview) 中的对话发送到 LangSmith。

配置完成后，您可以选择将 Claude Code 项目中的追踪信息发送到 LangSmith。追踪信息将包括用户消息、工具调用和助手响应。由于系统提示不会包含在 Claude Code 的对话记录中，因此追踪信息中也不会包含系统提示。

<div :style="{ textAlign: 'center' }">

<img src="/langsmith/images/claude-code-trace.png" alt="LangSmith UI showing trace from Claude Code." />

<img src="/langsmith/images/claude-code-trace-dark.png" alt="LangSmith UI showing trace from Claude Code." />

</div>

## 工作原理

1.  配置一个全局的 "Stop" [钩子](https://code.claude.com/docs/en/hooks-guide#get-started-with-claude-code-hooks)，使其在每次 Claude Code 响应时运行。
2.  该钩子读取 Claude Code 生成的对话记录。
3.  记录中的消息被转换为 LangSmith 的运行记录并发送到您的 LangSmith 项目。

<Note>
追踪功能是可选的，并且需要通过环境变量在每个 Claude Code 项目中单独启用。 
</Note>

## 先决条件

在设置追踪之前，请确保您已具备：

-   已安装 **Claude Code CLI**。
-   **LangSmith API 密钥** ([在此获取](https://smith.langchain.com/settings/apikeys))。
-   **命令行工具** `jq` - JSON 处理器 ([安装指南](https://jqlang.github.io/jq/download/))

<Info>

本指南目前仅支持 macOS。

</Info>

## 1. 创建钩子脚本

`stop_hook.sh` 脚本用于处理 Claude Code 生成的对话记录并将追踪信息发送到 LangSmith。创建文件 `~/.claude/hooks/stop_hook.sh`，并写入以下脚本内容：[stop_hook.sh](https://github.com/langchain-ai/tracing-claude-code/blob/main/stop_hook.sh)

使其可执行：

```bash
chmod +x ~/.claude/hooks/stop_hook.sh
```

## 2. 配置全局钩子

在 `~/.claude/settings.json` 中设置一个全局钩子，用于运行 `stop_hook.sh` 脚本。此全局设置使您可以轻松追踪任何 Claude Code CLI 项目。

在 `~/.claude/settings.json` 中，添加 `Stop` 钩子。

```json
{
"hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash ~/.claude/hooks/stop_hook.sh"
          }
        ]
      }
    ]
  }
}
```

## 3. 启用追踪

对于您希望启用追踪的每个 Claude Code 项目（Claude Code 项目是一个已初始化 Claude Code 的目录），创建或编辑 [Claude Code 的项目设置文件](https://code.claude.com/docs/en/settings#:~:text=Project%20settings%20are%20saved%20in%20your%20project%20directory%3A) `.claude/settings.local.json`，以包含以下环境变量：

-   `TRACE_TO_LANGSMITH: "true"` - 为此项目启用追踪。移除或设置为 `false` 以禁用追踪。
-   `CC_LANGSMITH_API_KEY` - 您的 LangSmith API 密钥
-   `CC_LANGSMITH_PROJECT` - 追踪信息将发送到的 LangSmith 项目名称
-   （可选）`CC_LANGSMITH_DEBUG: "true"` - 启用详细的调试日志记录。移除或设置为 `false` 以禁用追踪。

```json
{
  "env": {
    "TRACE_TO_LANGSMITH": "true",
    "CC_LANGSMITH_API_KEY": "lsv2_pt_...",
    "CC_LANGSMITH_PROJECT": "project-name",
    "CC_LANGSMITH_DEBUG": "true"

  }
}
```

<Note>
或者，要为所有 Claude Code 会话启用向 LangSmith 发送追踪信息，您可以将上述 JSON 添加到您的 [全局 Claude Code settings.json](https://code.claude.com/docs/en/settings#:~:text=User%20settings%20are%20defined%20in%20~/.claude/settings.json%20and%20apply%20to%20all%20projects.) 文件中。 
</Note>

## 4. 验证设置

在您已配置的项目中启动一个 Claude Code 会话。在 Claude Code 响应后，追踪信息将出现在 LangSmith 中。

在 LangSmith 中，您将看到：

-   发送给 Claude Code 的每条消息都显示为一条追踪记录。
-   来自同一 Claude Code 会话的所有轮次都使用共享的 `thread_id` 进行分组，并可以在项目的 **Threads** 选项卡中查看。

## 故障排除

### LangSmith 中没有出现追踪信息

1.  **检查钩子是否正在运行**：
```bash
tail -f ~/.claude/state/hook.log
```
您应该在每次 Claude 响应后看到日志条目。

2.  **验证环境变量**：
    -   检查您的项目 `.claude/settings.local.json` 中是否设置了 `TRACE_TO_LANGSMITH="true"`
    -   验证您的 API 密钥是否正确（以 `lsv2_pt_` 开头）
    -   确保 LangSmith 中存在该项目名称

3.  **启用调试模式** 以查看详细的 API 活动：
```json
{
  "env": {
    "CC_LANGSMITH_DEBUG": "true"
  }
}
```
然后检查日志中的 API 调用和 HTTP 状态码。

### 权限错误

确保钩子脚本可执行：

```bash
chmod +x ~/.claude/hooks/stop_hook.sh
```

### 找不到所需的命令

验证所有必需的命令是否已安装：

```bash
which jq curl uuidgen
```

如果缺少 `jq`：
-   **macOS**: `brew install jq`
-   **Ubuntu/Debian**: `sudo apt-get install jq`

### 管理日志文件大小

钩子将所有活动记录到 `~/.claude/state/hook.log`。启用调试模式后，此文件可能会变得很大：

```bash
# 查看日志文件大小
ls -lh ~/.claude/state/hook.log

# 如果需要，清除日志
> ~/.claude/state/hook.log
```
