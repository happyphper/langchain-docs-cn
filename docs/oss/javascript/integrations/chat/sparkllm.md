---
title: SparkLLM Chat
---
讯飞 SparkLLM 聊天模型 API。更多信息请参阅 [讯飞开放平台](https://www.xfyun.cn/)。

## 基本使用

```python
"""For basic init and call"""
from langchain_community.chat_models import ChatSparkLLM
from langchain.messages import HumanMessage

chat = ChatSparkLLM(
    spark_app_id="<app_id>", spark_api_key="<api_key>", spark_api_secret="<api_secret>"
)
message = HumanMessage(content="Hello")
chat([message])
```

```text
AIMessage(content='Hello! How can I help you today?')
```

- 从 [讯飞 SparkLLM API 控制台](https://console.xfyun.cn/services/bm3) 获取 SparkLLM 的 app_id、api_key 和 api_secret（更多信息请参阅 [讯飞 SparkLLM 介绍](https://xinghuo.xfyun.cn/sparkapi)），然后设置环境变量 `IFLYTEK_SPARK_APP_ID`、`IFLYTEK_SPARK_API_KEY` 和 `IFLYTEK_SPARK_API_SECRET`，或者在创建 `ChatSparkLLM` 时像上面的演示一样传递参数。

## 使用流式输出的 ChatSparkLLM

```python
chat = ChatSparkLLM(
    spark_app_id="<app_id>",
    spark_api_key="<api_key>",
    spark_api_secret="<api_secret>",
    streaming=True,
)
for chunk in chat.stream("Hello!"):
    print(chunk.content, end="")
```

```text
Hello! How can I help you today?
```

## 使用 v2 版本

```python
"""For basic init and call"""
from langchain_community.chat_models import ChatSparkLLM
from langchain.messages import HumanMessage

chat = ChatSparkLLM(
    spark_app_id="<app_id>",
    spark_api_key="<api_key>",
    spark_api_secret="<api_secret>",
    spark_api_url="wss://spark-api.xf-yun.com/v2.1/chat",
    spark_llm_domain="generalv2",
)
message = HumanMessage(content="Hello")
chat([message])
```
