---
title: 工具
---
在 Agent Builder 中，你可以访问多种工具，包括[内置工具](#built-in-tools)和[来自远程 MCP 服务器的工具](#remote-mcp-server-tools)。

## 内置工具

使用这些内置工具，可以让你的智能体访问电子邮件、日历、聊天、项目管理、代码托管、电子表格/BI、搜索、社交媒体和通用网络实用程序。

<Info icon="circle-info" color="#DCFCE7" iconType="regular">

Google、Slack、Linear、GitHub 和 LinkedIn 使用 OAuth。Exa、Tavily、Pylon 和 Twitter/X 使用工作区密钥（API 密钥）。

</Info>

<CardGroup :cols="2">

<Card title="Gmail" icon="google">

读取和发送电子邮件
<ul>
<li>读取电子邮件（可选包含正文，使用搜索过滤）</li>
<li>发送电子邮件或回复现有邮件</li>
<li>创建草稿邮件</li>
<li>将邮件标记为已读</li>
<li>获取对话线程</li>
<li>应用或创建标签</li>
<li>列出邮箱标签</li>
</ul>

</Card>

<Card title="Google Calendar" icon="google">

管理日程事件
<ul>
<li>列出指定日期的事件</li>
<li>获取事件详情</li>
<li>创建新事件</li>
</ul>

</Card>

<Card title="Google Sheets" icon="google">

电子表格
<ul>
<li>创建电子表格</li>
<li>读取数据范围</li>
</ul>

</Card>

<Card title="BigQuery" icon="database">

数据分析
<ul>
<li>执行 SQL 查询</li>
</ul>

</Card>

<Card title="Slack" icon="slack">

发送和读取消息
<ul>
<li>向用户发送私信</li>
<li>向频道发布消息</li>
<li>在主题中回复</li>
<li>读取频道历史记录</li>
<li>读取主题消息</li>
</ul>

</Card>

<Card title="LinkedIn" icon="linkedin">

发布到个人资料
<ul>
<li>发布带有可选图片或链接的帖子</li>
</ul>

</Card>

<div :style="{ position: 'relative', margin: 0, padding: 0 }">

<Card title="Twitter/X" icon="twitter">

<ul>
<li>按 ID 读取推文</li>
<li>从列表中读取最近的帖子</li>
</ul>

</Card>

<div :style="{ position: 'absolute', top: 16, right: 16 }">
<Tooltip tip="所需密钥：TWITTER_API_KEY, TWITTER_API_KEY_SECRET"><Icon icon="key" :size="16" /></Tooltip>

</div>

</div>

<Card title="GitHub" icon="github">

拉取请求、议题和内容
<ul>
<li>列出拉取请求</li>
<li>获取拉取请求详情</li>
<li>创建议题和拉取请求</li>
<li>对议题和拉取请求发表评论</li>
<li>读取仓库文件并列出目录</li>
</ul>

</Card>

<Card title="Linear" icon="list-check">

管理议题和团队
<ul>
<li>列出团队和团队成员</li>
<li>使用过滤器列出议题</li>
<li>获取议题详情</li>
<li>创建、更新或删除议题</li>
</ul>

</Card>

<Card title="Pylon" icon="list-check">

议题管理
<ul>
<li>列出议题</li>
<li>获取议题详情</li>
<li>更新议题</li>
</ul>

</Card>

<div :style="{ position: 'relative', margin: 0, padding: 0 }">

<Card title="搜索" icon="magnifying-glass">

<ul>
<li>Exa 网络搜索（可选获取页面内容）</li>
<li>Exa LinkedIn 个人资料搜索</li>
<li>Tavily 网络搜索</li>
</ul>

</Card>

<div :style="{ position: 'absolute', top: 16, right: 16 }">
<Tooltip tip="Exa: EXA_API_KEY; Tavily: TAVILY_API_KEY"><Icon icon="key" :size="16" /></Tooltip>

</div>

</div>

<Card title="网络实用工具" icon="globe">

<ul>
<li>读取网页文本内容</li>
<li>提取图片 URL 和元数据</li>
<li>通知用户（用于确认/更新）</li>
</ul>

</Card>

</CardGroup>

## 远程 MCP 服务器工具

Agent Builder 可以发现并使用来自远程 [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) 服务器的工具。这使你能够连接到外部 MCP 服务器，并在你的智能体中使用它们的工具。

### 工作原理

- Agent Builder 通过标准的 MCP 协议从远程 MCP 服务器发现工具。
- 在你的工作区中配置的请求头会在获取工具或调用工具时自动附加。请求头可用于身份验证。
- 来自远程服务器的工具在 Agent Builder 中与内置工具一起可用。

### 配置

在你的 LangSmith [工作区](/langsmith/administration-overview#workspaces) 中配置远程 MCP 服务器：

1.  在 [LangSmith UI](https://smith.langchain.com) 中导航到你的工作区设置。
2.  添加你的 MCP 服务器 URL 和任何必需的请求头（例如，<code v-pre>Authorization: Bearer {{MCP_TOKEN}}</code>）。
3.  Agent Builder 会自动从服务器发现工具，并在调用工具时应用配置的请求头。

<Note>

在请求头中使用工作区密钥占位符，例如 <code v-pre>{{MCP_TOKEN}}</code>。平台会在运行时从你的工作区密钥中解析这些值。

</Note>

