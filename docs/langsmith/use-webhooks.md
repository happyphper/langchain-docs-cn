---
title: 使用 Webhooks
sidebarTitle: Webhooks
---
Webhook 支持从您的 LangSmith 应用程序到外部服务的事件驱动通信。例如，您可能希望在调用 LangSmith 的 API 运行完成后，向另一个服务发送更新。

许多 LangSmith 端点都接受 `webhook` 参数。如果一个可以接受 POST 请求的端点指定了此参数，LangSmith 将在运行完成时发送一个请求。

在使用 LangSmith 时，您可能希望使用 webhook 在 API 调用完成后接收更新。Webhook 对于在运行处理完成后触发您服务中的操作非常有用。要实现这一点，您需要暴露一个可以接受 `POST` 请求的端点，并在您的 API 请求中将此端点作为 `webhook` 参数传递。

目前，SDK 没有提供内置的支持来定义 webhook 端点，但您可以使用 API 请求手动指定它们。

## 支持的端点

以下 API 端点接受 `webhook` 参数：

| 操作                 | HTTP 方法 | 端点                                |
|----------------------|-----------|-------------------------------------|
| 创建运行             | `POST`    | `/thread/{thread_id}/runs`          |
| 创建线程定时任务     | `POST`    | `/thread/{thread_id}/runs/crons`    |
| 流式运行             | `POST`    | `/thread/{thread_id}/runs/stream`   |
| 等待运行             | `POST`    | `/thread/{thread_id}/runs/wait`     |
| 创建定时任务         | `POST`    | `/runs/crons`                       |
| 无状态流式运行       | `POST`    | `/runs/stream`                      |
| 无状态等待运行       | `POST`    | `/runs/wait`                        |

在本指南中，我们将展示如何在流式运行后触发 webhook。

## 设置您的助手和线程

在进行 API 调用之前，请先设置您的助手和线程。

<Tabs>

<Tab title="Python">

```python
from langgraph_sdk import get_client

client = get_client(url=<DEPLOYMENT_URL>)
assistant_id = "agent"
thread = await client.threads.create()
print(thread)
```

</Tab>

<Tab title="JavaScript">

```js
import { Client } from "@langchain/langgraph-sdk";

const client = new Client({ apiUrl: <DEPLOYMENT_URL> });
const assistantID = "agent";
const thread = await client.threads.create();
console.log(thread);
```

</Tab>

<Tab title="CURL">

```bash
curl --request POST \
    --url <DEPLOYMENT_URL>/assistants/search \
    --header 'Content-Type: application/json' \
    --data '{ "limit": 10, "offset": 0 }' | jq -c 'map(select(.config == null or .config == {})) | .[0]' && \
curl --request POST \
    --url <DEPLOYMENT_URL>/threads \
    --header 'Content-Type: application/json' \
    --data '{}'
```

</Tab>

</Tabs>

示例响应：

```json
{
    "thread_id": "9dde5490-2b67-47c8-aa14-4bfec88af217",
    "created_at": "2024-08-30T23:07:38.242730+00:00",
    "updated_at": "2024-08-30T23:07:38.242730+00:00",
    "metadata": {},
    "status": "idle",
    "config": {},
    "values": null
}
```

## 在图运行中使用 webhook

要使用 webhook，请在您的 API 请求中指定 `webhook` 参数。当运行完成时，LangSmith 会向指定的 webhook URL 发送一个 `POST` 请求。

例如，如果您的服务器在 `https://my-server.app/my-webhook-endpoint` 监听 webhook 事件，请在您的请求中包含此 URL：

<Tabs>

<Tab title="Python">

```python
input = { "messages": [{ "role": "user", "content": "Hello!" }] }

async for chunk in client.runs.stream(
    thread_id=thread["thread_id"],
    assistant_id=assistant_id,
    input=input,
    stream_mode="events",
    webhook="https://my-server.app/my-webhook-endpoint"
):
    pass
```

</Tab>

<Tab title="JavaScript">

```js
const input = { messages: [{ role: "human", content: "Hello!" }] };

const streamResponse = client.runs.stream(
  thread["thread_id"],
  assistantID,
  {
    input: input,
    webhook: "https://my-server.app/my-webhook-endpoint"
  }
);

for await (const chunk of streamResponse) {
  // Handle stream output
}
```

</Tab>

<Tab title="CURL">

```bash
curl --request POST \
    --url <DEPLOYMENT_URL>/threads/<THREAD_ID>/runs/stream \
    --header 'Content-Type: application/json' \
    --data '{
        "assistant_id": <ASSISTANT_ID>,
        "input": {"messages": [{"role": "user", "content": "Hello!"}]},
        "webhook": "https://my-server.app/my-webhook-endpoint"
    }'
```

</Tab>

</Tabs>

## Webhook 负载

LangSmith 以 [运行](/langsmith/assistants#execution) 的格式发送 webhook 通知。详情请参阅 [API 参考](https://langchain-ai.github.io/langgraph/cloud/reference/api/api_ref.html#tag/assistants)。请求负载在 `kwargs` 字段中包含运行输入、配置和其他元数据。

## 安全的 Webhook

为确保只有经过授权的请求才能访问您的 webhook 端点，可以考虑添加一个安全令牌作为查询参数：

```
https://my-server.app/my-webhook-endpoint?token=YOUR_SECRET_TOKEN
```

您的服务器在处理请求之前应提取并验证此令牌。

## 向 Webhook 请求添加头部

<Note>

在 `langgraph-api>=0.5.36` 中可用。

</Note>

您可以配置静态头部，以包含在所有出站 webhook 请求中。这对于身份验证、路由或向您的 webhook 端点传递元数据非常有用。

在您的 `langgraph.json` 文件中添加 `webhooks.headers` 配置：

```json
{
  "webhooks": {
    "headers": {
      "X-Custom-Header": "my-value",
      "X-Environment": "production"
    }
  }
}
```

### 在头部中使用环境变量

要在不将机密或环境特定值签入配置文件的情况下包含它们，请使用 <code v-pre>${{ env.VAR }}</code> 模板语法：

```json
{
  "webhooks": {
    "headers": {
      "Authorization": "Bearer ${{ env.LG_WEBHOOK_TOKEN }}"
    }
  }
}
```

出于安全考虑，默认情况下只能引用以 `LG_WEBHOOK_` 开头的环境变量。这可以防止意外泄露不相关的环境变量。您可以使用 `env_prefix` 自定义此前缀：

```json
{
  "webhooks": {
    "env_prefix": "MY_APP_",
    "headers": {
      "Authorization": "Bearer ${{ env.MY_APP_SECRET }}"
    }
  }
}
```

<Note>

缺少必需的环境变量将阻止服务器启动，确保您不会在配置不完整的情况下进行部署。

</Note>

## 限制 Webhook 目标地址

<Note>

在 `langgraph-api>=0.5.36` 中可用。

</Note>

出于安全或合规目的，您可以使用 `webhooks.url` 配置来限制哪些 URL 是有效的 webhook 目标地址：

```json
{
  "webhooks": {
    "url": {
      "allowed_domains": ["*.mycompany.com", "api.trusted-service.com"],
      "require_https": true
    }
  }
}
```

可用选项：

| 选项                 | 描述                                                                 |
|----------------------|----------------------------------------------------------------------|
| `allowed_domains`    | 主机名白名单。支持子域通配符（例如 `*.mycompany.com`）。             |
| `require_https`      | 为 `true` 时拒绝 `http://` URL。                                     |
| `allowed_ports`      | 显式端口白名单。默认为 443 (https) 和 80 (http)。                    |
| `disable_loopback`   | 为 `true` 时禁止相对 URL（内部回环调用）。                           |
| `max_url_length`     | 允许的最大 URL 长度（字符数）。                                      |

## 禁用 Webhook

自 `langgraph-api>=0.2.78` 起，开发者可以在 `langgraph.json` 文件中禁用 webhook：

```json
{
  "http": {
    "disable_webhooks": true
  }
}
```

此功能主要面向自托管部署，平台管理员或开发者可能更倾向于禁用 webhook 以简化其安全态势——特别是当他们没有配置防火墙规则或其他网络控制时。禁用 webhook 有助于防止将不受信任的负载发送到内部端点。

有关完整配置详情，请参阅 [配置文件参考](/langsmith/cli?h=disable_webhooks#configuration-file)。

## 测试 Webhook

您可以使用以下在线服务测试您的 webhook：

* **[Beeceptor](https://beeceptor.com/)** – 快速创建测试端点并检查传入的 webhook 负载。
* **[Webhook.site](https://webhook.site/)** – 实时查看、调试和记录传入的 webhook 请求。

这些工具可以帮助您验证 LangSmith 是否正确触发并向您的服务发送 webhook。
