---
title: YandexGPT
---
LangChain.js 支持调用 [YandexGPT](https://cloud.yandex.com/en/services/yandexgpt) 大语言模型。

## 设置

首先，您需要[创建一个服务账户](https://cloud.yandex.com/en/docs/iam/operations/sa/create)，并为其分配 `ai.languageModels.user` 角色。

接下来，您有两种身份验证选项：

- [IAM 令牌](https://cloud.yandex.com/en/docs/iam/operations/iam-token/create-for-sa)。
  您可以在构造函数参数 `iam_token` 或环境变量 `YC_IAM_TOKEN` 中指定令牌。
- [API 密钥](https://cloud.yandex.com/en/docs/iam/operations/api-key/create)。
  您可以在构造函数参数 `api_key` 或环境变量 `YC_API_KEY` 中指定密钥。

## 使用方法

<Tip>

有关安装 LangChain 包的通用说明，请参阅[此部分](/oss/javascript/langchain/install)。

</Tip>

```bash [npm]
npm install @langchain/yandex @langchain/core
```

```typescript
import { YandexGPT } from "@langchain/yandex/llms";

const model = new YandexGPT();
const res = await model.invoke(['Translate "I love programming" into French.']);
console.log({ res });
```

## 相关链接

- [模型指南](/oss/javascript/langchain/models)
