---
title: 在服务器日志中包含 HTTP 标头
sidebarTitle: Logging Headers
---
默认情况下，出于隐私考虑，[Agent Server](/langsmith/agent-server) 会从服务器日志中省略 HTTP 标头。然而，记录请求 ID 和关联 ID 可以帮助您调试问题并在分布式系统中追踪请求。您可以通过修改 [`langgraph.json`](/langsmith/application-structure#configuration-file) 文件中的 `logging_headers` 部分，选择为所有 API 调用记录标头。

```json
{
  "$schema": "https://langgra.ph/schema.json",
  "http": {
    "logging_headers": {
      "includes": ["request-id", "x-purchase-id", "*-trace-*"],
      "excludes": ["authorization", "x-api-key", "x-organization-id", "x-user-id"]
    }
  }
}
```

`includes` 和 `excludes` 列表接受精确的标头名称或使用 `*` 作为通配符来匹配任意数量字符的 glob 模式（不区分大小写）。为了您的安全，不支持其他模式类型。

请注意，排除规则优先于包含规则。例如，如果您包含 `*-id` 但排除 `x-user-id`，则 `x-user-id` 标头将不会被记录。
