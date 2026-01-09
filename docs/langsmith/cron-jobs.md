---
title: 使用 cron 作业
sidebarTitle: Use cron jobs
---
在许多场景中，按计划运行助手非常有用。

例如，假设您正在构建一个每日运行并发送当天新闻摘要邮件的助手。您可以使用 cron 作业来安排助手每天在晚上 8:00 运行。

LangSmith Deployment 支持 cron 作业，这些作业按用户定义的计划运行。用户指定一个计划、一个助手和一些输入。之后，在指定的计划时间，服务器将：

* 使用指定的助手创建一个新线程
* 将指定的输入发送到该线程

请注意，这每次都会向线程发送相同的输入。

LangSmith Deployment API 提供了多个端点用于创建和管理 cron 作业。更多详情请参阅 [API 参考](https://langchain-ai.github.io/langgraph/cloud/reference/api/api_ref/)。

有时，您不希望基于用户交互来运行您的图（graph），而是希望按计划调度您的图运行——例如，如果您希望您的图每周为您的团队撰写并发送待办事项邮件。LangSmith Deployment 允许您通过使用 `Crons` 客户端来实现这一点，而无需编写自己的脚本。要调度图作业，您需要传递一个 [cron 表达式](https://crontab.cronhub.io/) 来告知客户端您希望何时运行该图。`Cron` 作业在后台运行，不会干扰图的正常调用。

## 设置

首先，让我们设置 SDK 客户端、助手和线程：

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

## 线程上的 Cron 作业

要创建与特定线程关联的 cron 作业，您可以编写：

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

请注意，删除不再有用的 `Cron` 作业 **非常** 重要。否则，您可能会因 LLM 产生不必要的 API 费用！您可以使用以下代码删除 `Cron` 作业：

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

您也可以使用以下代码创建无状态 cron 作业：

<Tabs>

<Tab title="Python">

```python
# This schedules a job to run at 15:27 (3:27PM) every day
cron_job_stateless = await client.crons.create(
    assistant_id,
    schedule="27 15 * * *",
    input={"messages": [{"role": "user", "content": "What time is it?"}]},
)
```

</Tab>

<Tab title="Javascript">

```js
// This schedules a job to run at 15:27 (3:27PM) every day
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

再次提醒，完成后记得删除您的作业！

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

