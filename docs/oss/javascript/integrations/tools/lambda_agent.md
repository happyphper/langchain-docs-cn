---
title: 集成 AWS Lambda 的智能体
---
完整文档请参阅：https://docs.aws.amazon.com/lambda/index.html

**AWS Lambda** 是亚马逊云科技（AWS）提供的一项无服务器计算服务，旨在让开发者无需预置或管理服务器即可构建和运行应用程序与服务。这种无服务器架构使您能够专注于编写和部署代码，而 AWS 会自动负责运行应用程序所需的基础设施的扩展、打补丁和管理工作。

通过将 AWSLambda 包含在提供给 Agent 的工具列表中，您可以授予您的 Agent 调用在您 AWS 云中运行的代码的能力，以满足您的任何需求。

当 Agent 使用 AWSLambda 工具时，它将提供一个 `string` 类型的参数，该参数随后将通过 `event` 参数传递给 Lambda 函数。

本快速入门将演示 Agent 如何使用 Lambda 函数通过 [Amazon Simple Email Service](https://aws.amazon.com/ses/) 发送电子邮件。发送电子邮件的 Lambda 代码未提供，但如果您想了解如何实现，请参阅[此处](https://repost.aws/knowledge-center/lambda-send-email-ses)。请注意，这是一个特意简化的示例；Lambda 可用于执行近乎无限数量的其他用途的代码（包括执行更多的 LangChain 链！）。

### 关于凭证的说明：

- 如果您尚未通过 AWS CLI 运行 [`aws configure`](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)，则必须向 AWSLambda 构造函数提供 `region`、`accessKeyId` 和 `secretAccessKey`。
- 与这些凭证对应的 IAM 角色必须具有调用该 lambda 函数的权限。

<Tip>

有关安装 LangChain 包的通用说明，请参阅[此部分](/oss/langchain/install)。

</Tip>

```bash [npm]
npm install @langchain/openai @langchain/core
```

```typescript
import { OpenAI } from "@langchain/openai";
import { SerpAPI } from "@langchain/classic/tools";
import { AWSLambda } from "@langchain/classic/tools/aws_lambda";
import { initializeAgentExecutorWithOptions } from "@langchain/classic/agents";

const model = new OpenAI({ temperature: 0 });
const emailSenderTool = new AWSLambda({
  name: "email-sender",
  // 明确告知 Agent 此工具的功能
  description:
    "Sends an email with the specified content to testing123@gmail.com",
  region: "us-east-1", // 可选：部署函数的 AWS 区域
  accessKeyId: "abc123", // 可选：具有调用权限的 IAM 用户的访问密钥 ID
  secretAccessKey: "xyz456", // 可选：该 IAM 用户的秘密访问密钥
  functionName: "SendEmailViaSES", // 在 AWS 控制台中看到的函数名称
});
const tools = [emailSenderTool, new SerpAPI("api_key_goes_here")];
const executor = await initializeAgentExecutorWithOptions(tools, model, {
  agentType: "zero-shot-react-description",
});

const input = `Find out the capital of Croatia. Once you have it, email the answer to testing123@gmail.com.`;
const result = await executor.invoke({ input });
console.log(result);
```

## 相关链接

- 工具 [概念指南](/oss/langchain/tools)
- 工具 [操作指南](/oss/langchain/tools)
