---
title: Twilio
---
本笔记本将介绍如何使用 [Twilio](https://www.twilio.com) API 封装器通过短信或 [Twilio 消息渠道](https://www.twilio.com/docs/messaging/channels) 发送消息。

Twilio 消息渠道支持与第三方消息应用的集成，允许您通过 WhatsApp Business Platform (正式发布)、Facebook Messenger (公开测试版) 和 Google Business Messages (私有测试版) 发送消息。

## 设置

要使用此工具，您需要安装 Python Twilio 包 `twilio`

```python
pip install -qU  twilio
```

您还需要设置一个 Twilio 账户并获取您的凭证。您需要您的账户字符串标识符 (SID) 和您的认证令牌 (Auth Token)。您还需要一个用于发送消息的号码。

您可以将这些信息作为命名参数 `account_sid`、`auth_token`、`from_number` 传递给 `TwilioAPIWrapper`，或者设置环境变量 `TWILIO_ACCOUNT_SID`、`TWILIO_AUTH_TOKEN`、`TWILIO_FROM_NUMBER`。

## 发送短信

```python
from langchain_community.utilities.twilio import TwilioAPIWrapper
```

```python
twilio = TwilioAPIWrapper(
    #     account_sid="foo",
    #     auth_token="bar",
    #     from_number="baz,"
)
```

```python
twilio.run("hello world", "+16162904619")
```

## 发送 WhatsApp 消息

您需要将您的 WhatsApp Business 账户与 Twilio 关联。同时，您需要确保用于发送消息的号码在 Twilio 上被配置为 WhatsApp 启用发送方，并在 WhatsApp 上完成注册。

```python
from langchain_community.utilities.twilio import TwilioAPIWrapper
```

```python
twilio = TwilioAPIWrapper(
    #     account_sid="foo",
    #     auth_token="bar",
    #     from_number="whatsapp: baz,"
)
```

```python
twilio.run("hello world", "whatsapp: +16162904619")
```
