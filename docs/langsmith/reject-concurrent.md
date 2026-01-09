---
title: 拒绝并发
sidebarTitle: Reject
---
本指南假设您已了解什么是双文本（double-texting），您可以在[双文本概念指南](/langsmith/double-texting)中学习相关知识。

本指南将介绍双文本的 `reject` 选项，该选项通过抛出错误来拒绝图的新运行，并继续执行原始运行直至完成。以下是使用 `reject` 选项的快速示例。

## 环境设置

首先，我们将定义一个用于打印 JS 和 CURL 模型输出的快速辅助函数（如果您使用 Python，可以跳过此步骤）：

<Tabs>

<Tab title="Javascript">

```js
function prettyPrint(m) {
  const padded = " " + m['type'] + " ";
  const sepLen = Math.floor((80 - padded.length) / 2);
  const sep = "=".repeat(sepLen);
  const secondSep = sep + (padded.length % 2 ? "=" : "");

  console.log(`${sep}${padded}${secondSep}`);
  console.log("\n\n");
  console.log(m.content);
}
```

</Tab>

<Tab title="CURL">

```bash
# PLACE THIS IN A FILE CALLED pretty_print.sh
pretty_print() {
  local type="$1"
  local content="$2"
  local padded=" $type "
  local total_width=80
  local sep_len=$(( (total_width - ${#padded}) / 2 ))
  local sep=$(printf '=%.0s' $(eval "echo {1.."${sep_len}"}"))
  local second_sep=$sep
  if (( (total_width - ${#padded}) % 2 )); then
    second_sep="${second_sep}="
  fi

  echo "${sep}${padded}${second_sep}"
  echo
  echo "$content"
}
```

</Tab>

</Tabs>

现在，让我们导入所需的包并实例化客户端、助手和线程。

<Tabs>

<Tab title="Python">

```python
import httpx
from langchain_core.messages import convert_to_messages
from langgraph_sdk import get_client

client = get_client(url=<DEPLOYMENT_URL>)
# Using the graph deployed with the name "agent"
assistant_id = "agent"
thread = await client.threads.create()
```

</Tab>

<Tab title="Javascript">

```js
import { Client } from "@langchain/langgraph-sdk";

const client = new Client({ apiUrl: <DEPLOYMENT_URL> });
// Using the graph deployed with the name "agent"
const assistantId = "agent";
const thread = await client.threads.create();
```

</Tab>

<Tab title="CURL">

```bash
curl --request POST \
  --url <DEPLOYMENT_URL>/threads \
  --header 'Content-Type: application/json' \
  --data '{}'
```

</Tab>

</Tabs>

## 创建运行

现在我们可以运行一个线程，并尝试使用 "reject" 选项运行第二个线程，由于我们已经启动了一个运行，这应该会失败：

<Tabs>

<Tab title="Python">

```python
run = await client.runs.create(
    thread["thread_id"],
    assistant_id,
    input={"messages": [{"role": "user", "content": "what's the weather in sf?"}]},
)
try:
    await client.runs.create(
        thread["thread_id"],
        assistant_id,
        input={
            "messages": [{"role": "user", "content": "what's the weather in nyc?"}]
        },
        multitask_strategy="reject",
    )
except httpx.HTTPStatusError as e:
    print("Failed to start concurrent run", e)
```

</Tab>

<Tab title="Javascript">

```js
const run = await client.runs.create(
  thread["thread_id"],
  assistantId,
  input={"messages": [{"role": "user", "content": "what's the weather in sf?"}]},
);

try {
  await client.runs.create(
    thread["thread_id"],
    assistantId,
    {
      input: {"messages": [{"role": "user", "content": "what's the weather in nyc?"}]},
      multitask_strategy:"reject"
    },
  );
} catch (e) {
  console.error("Failed to start concurrent run", e);
}
```

</Tab>

<Tab title="CURL">

```bash
curl --request POST \
--url <DEPLOY<ENT_URL>>/threads/<THREAD_ID>/runs \
--header 'Content-Type: application/json' \
--data "{
  \"assistant_id\": \"agent\",
  \"input\": {\"messages\": [{\"role\": \"human\", \"content\": \"what\'s the weather in sf?\"}]},
}" && curl --request POST \
--url <DEPLOY<ENT_URL>>/threads/<THREAD_ID>/runs \
--header 'Content-Type: application/json' \
--data "{
  \"assistant_id\": \"agent\",
  \"input\": {\"messages\": [{\"role\": \"human\", \"content\": \"what\'s the weather in nyc?\"}]},
  \"multitask_strategy\": \"reject\"
}" || { echo "Failed to start concurrent run"; echo "Error: $?" >&2; }
```

</Tab>

</Tabs>

输出：

```
Failed to start concurrent run Client error '409 Conflict' for url 'http://localhost:8123/threads/f9e7088b-8028-4e5c-88d2-9cc9a2870e50/runs'
For more information check: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/409
```

## 查看运行结果

我们可以验证原始线程是否已执行完成：

<Tabs>

<Tab title="Python">

```python
# wait until the original run completes
await client.runs.join(thread["thread_id"], run["run_id"])

state = await client.threads.get_state(thread["thread_id"])

for m in convert_to_messages(state["values"]["messages"]):
    m.pretty_print()
```

</Tab>

<Tab title="Javascript">

```js
await client.runs.join(thread["thread_id"], run["run_id"]);

const state = await client.threads.getState(thread["thread_id"]);

for (const m of state["values"]["messages"]) {
  prettyPrint(m);
}
```

</Tab>

<Tab title="CURL">

```bash
source pretty_print.sh && curl --request GET \
--url <DEPLOYMENT_URL>/threads/<THREAD_ID>/runs/<RUN_ID>/join && \
curl --request GET --url <DEPLOYMENT_URL>/threads/<THREAD_ID>/state | \
jq -c '.values.messages[]' | while read -r element; do
    type=$(echo "$element" | jq -r '.type')
    content=$(echo "$element" | jq -r '.content | if type == "array" then tostring else . end')
    pretty_print "$type" "$content"
done
```

</Tab>

</Tabs>

输出：

```
================================ Human Message =================================

what's the weather in sf?
================================== Ai Message ==================================

[{'id': 'toolu_01CyewEifV2Kmi7EFKHbMDr1', 'input': {'query': 'weather in san francisco'}, 'name': 'tavily_search_results_json', 'type': 'tool_use'}]
Tool Calls:
tavily_search_results_json (toolu_01CyewEifV2Kmi7EFKHbMDr1)
Call ID: toolu_01CyewEifV2Kmi7EFKHbMDr1
Args:
query: weather in san francisco
================================= Tool Message =================================
Name: tavily_search_results_json

[{"url": "https://www.accuweather.com/en/us/san-francisco/94103/june-weather/347629", "content": "Get the monthly weather forecast for San Francisco, CA, including daily high/low, historical averages, to help you plan ahead."}]
================================== Ai Message ==================================

根据 Tavily 的搜索结果，旧金山当前的天气情况是：

旧金山六月的平均最高气温约为 65°F (18°C)，平均最低气温约为 54°F (12°C)。由于夏季月份经常笼罩城市的海洋雾层，六月往往是旧金山较凉爽和多雾的月份之一。

关于旧金山典型六月天气的一些要点：

* 温和的气温，最高温度在 60 多华氏度，最低温度在 50 多华氏度
* 多雾的早晨，通常在下午转为晴朗
* 几乎没有降雨，因为六月处于旱季
* 有风的条件，受太平洋海风影响
* 建议分层穿衣以应对变化的天气条件

总之，每年的这个时候，您可以预期旧金山会有温和、多雾的早晨，随后转为晴朗但凉爽的下午。与其他加州地区相比，海洋雾层使六月的气温保持适中。
```
