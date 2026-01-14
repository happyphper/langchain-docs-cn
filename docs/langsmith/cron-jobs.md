---
title: 使用定时任务（cron jobs）
sidebarTitle: Use cron jobs
---
在许多场景中，按计划运行智能体（assistant）非常有用。

例如，假设您正在构建一个每日运行并发送当天新闻摘要邮件的智能体。您可以使用 cron 任务来让该智能体每天在晚上 8:00 运行。

LangSmith Deployment 支持 cron 任务，它们按照用户定义的计划运行。用户需要指定一个计划、一个智能体以及一些输入。之后，在指定的计划时间，服务器将：

* 使用指定的智能体创建一个新线程（thread）
* 将指定的输入发送到该线程

请注意，这每次都会向线程发送相同的输入。

LangSmith Deployment API 提供了多个端点来创建和管理 cron 任务。更多详情请参阅 [API 参考](https://langchain-ai.github.io/langgraph/cloud/reference/api/api_ref/)。

有时，您不希望基于用户交互来运行您的图（graph），而是希望按计划调度您的图运行——例如，如果您希望您的图每周为您的团队撰写并发送待办事项邮件。LangSmith Deployment 允许您通过使用 `Crons` 客户端来实现这一点，而无需编写自己的脚本。要调度一个图作业，您需要传递一个 [cron 表达式](https://crontab.cronhub.io/) 来告知客户端您希望何时运行该图。`Cron` 任务在后台运行，不会干扰图的正常调用。

## 设置

首先，让我们设置我们的 SDK 客户端、智能体和线程：

<Tabs>

<Tab title="Python">

```python
from langgraph_sdk import get_client

client = get_client(url=<DEPLOYMENT_URL>)
# Using the graph deployed with the name "agent"
assistant_id = "agent"
# create thread
thread = await client.threads.create()
print(thread)
```

</Tab>

<Tab title="Javascript">

```js
import { Client } from "@langchain/langgraph-sdk";

const client = new Client({ apiUrl: <DEPLOYMENT_URL> });
// Using the graph deployed with the name "agent"
const assistantId = "agent";
// create thread
const thread = await client.threads.create();
console.log(thread);
```

</Tab>

<Tab title="CURL">

```bash
curl --request POST \
    --url <DEPLOYMENT_URL>/assistants/search \
    --header 'Content-Type: application/json' \
    --data '{
        "limit": 10,
        "offset": 0
    }' | jq -c 'map(select(.config == null or .config == {})) | .[0].graph_id' && \
curl --request POST \
    --url <DEPLOYMENT_URL>/threads \
    --header 'Content-Type: application/json' \
    --data '{}'
```

</Tab>

</Tabs>

输出：

```
{
'thread_id': '9dde5490-2b67-47c8-aa14-4bfec88af217',
'created_at': '2024-08-30T23:07:38.242730+00:00',
'updated_at': '2024-08-30T23:07:38.242730+00:00',
'metadata': {},
'status': 'idle',
'config': {},
'values': None
}
```

## 线程上的 Cron 任务

要创建与特定线程关联的 cron 任务，您可以编写：

<Tabs>

<Tab title="Python">

```python
# This schedules a job to run at 15:27 (3:27PM) every day
cron_job = await client.crons.create_for_thread(
    thread["thread_id"],
    assistant_id,
    schedule="27 15 * * *",
    input={"messages": [{"role": "user", "content": "What time is it?"}]},
)
```

</Tab>

<Tab title="Javascript">

```js
// This schedules a job to run at 15:27 (3:27PM) every day
const cronJob = await client.crons.create_for_thread(
  thread["thread_id"],
  assistantId,
  {
    schedule: "27 15 * * *",
    input: { messages: [{ role: "user", content: "What time is it?" }] }
  }
);
```

</Tab>

<Tab title="CURL">

```bash
curl --request POST \
    --url <DEPLOYMENT_URL>/threads/<THREAD_ID>/runs/crons \
    --header 'Content-Type: application/json' \
    --data '{
        "assistant_id": <ASSISTANT_ID>,
    }'
```

</Tab>

</Tabs>

请注意，删除不再有用的 `Cron` 作业**非常**重要。否则，您可能会产生不必要的 LLM API 费用！您可以使用以下代码删除 `Cron` 作业：

<Tabs>

<Tab title="Python">

```python
await client.crons.delete(cron_job["cron_id"])
```

</Tab>

<Tab title="Javascript">

```js
await client.crons.delete(cronJob["cron_id"]);
```

</Tab>

<Tab title="CURL">

```bash
curl --request DELETE \
    --url <DEPLOYMENT_URL>/runs/crons/<CRON_ID>
```

</Tab>

</Tabs>

## 无状态 Cron 作业

您也可以使用以下代码创建无状态 cron 作业。无状态 cron 作业每次执行都会创建一个新的线程：

<Tabs>

<Tab title="Python">

```python
# 这将安排一个作业在每天 15:27（下午 3:27）运行
cron_job_stateless = await client.crons.create(
    assistant_id,
    schedule="27 15 * * *",
    input={"messages": [{"role": "user", "content": "What time is it?"}]},
)
```

</Tab>

<Tab title="Javascript">

```js
// 这将安排一个作业在每天 15:27（下午 3:27）运行
const cronJobStateless = await client.crons.create(
  assistantId,
  {
    schedule: "27 15 * * *",
    input: { messages: [{ role: "user", content: "What time is it?" }] }
  }
);
```

</Tab>

<Tab title="CURL">

```bash
curl --request POST \
    --url <DEPLOYMENT_URL>/runs/crons \
    --header 'Content-Type: application/json' \
    --data '{
        "assistant_id": <ASSISTANT_ID>,
    }'
```

</Tab>

</Tabs>

再次提醒，完成后请记得删除您的作业！

<Tabs>

<Tab title="Python">

```python
await client.crons.delete(cron_job_stateless["cron_id"])
```

</Tab>

<Tab title="Javascript">

```js
await client.crons.delete(cronJobStateless["cron_id"]);
```

</Tab>

<Tab title="CURL">

```bash
curl --request DELETE \
    --url <DEPLOYMENT_URL>/runs/crons/<CRON_ID>
```

</Tab>

</Tabs>

## 无状态 Cron 的线程清理

<Note>

此功能需要 LangGraph API 版本 <strong>0.5.18</strong> 或更高版本，以及 Python SDK <strong>0.3.2</strong> 或更高版本，或 JavaScript SDK <strong>1.4.0</strong> 或更高版本。

</Note>

每次触发无状态 cron 时，都会创建一个新线程。使用 `on_run_completed` 参数控制运行完成后该线程的处理方式：

- **`"delete"`**（默认）：运行完成后自动删除线程。
- **`"keep"`**：保留线程以供后续检索。您需要负责清理这些线程。有关推荐方法，请参阅[如何为您的应用程序添加 TTL](/langsmith/configure-ttl)。

### 示例：保留线程以供后续检索

<Tabs>

<Tab title="Python">

```python
# 创建一个在执行后保留线程的无状态 cron。
# 在 langgraph.json 中配置 checkpointer.ttl 以自动删除旧线程。
# 参见：https://docs.langchain.com/langsmith/configure-ttl
cron_job = await client.crons.create(
    assistant_id,
    schedule="27 15 * * *",
    input={"messages": [{"role": "user", "content": "Daily report"}]},
    on_run_completed="keep"
)

# 您稍后可以检索运行及其结果
runs = await client.runs.search(
    metadata={"cron_id": cron_job["cron_id"]}
)
```

</Tab>

<Tab title="Javascript">

```js
// 创建一个在执行后保留线程的无状态 cron。
// 在 langgraph.json 中配置 checkpointer.ttl 以自动删除旧线程。
// 参见：https://docs.langchain.com/langsmith/configure-ttl
const cronJob = await client.crons.create(
  assistantId,
  {
    schedule: "27 15 * * *",
    input: { messages: [{ role: "user", content: "Daily report" }] },
    onRunCompleted: "keep"
  }
);
```

// 稍后您可以检索运行及其结果
const runs = await client.runs.search({
metadata: { cron_id: cronJob["cron_id"] }
});
```
</Tab>
<Tab title="CURL">
```bash
    # 创建一个无状态 cron，在执行后保留线程。
    # 在 langgraph.json 中配置 checkpointer.ttl 以自动删除旧线程。
    # 参见：https://docs.langchain.com/langsmith/configure-ttl
curl --request POST \
 --url <DEPLOYMENT_URL>/runs/crons \
 --header 'Content-Type: application/json' \
 --data '{
"assistant_id": "<ASSISTANT_ID>",
"schedule": "27 15 * * *",
"input": {"messages": [{"role": "user", "content": "Daily report"}]},
"on_run_completed": "keep"
}'
```

</Tab>

</Tabs>

