---
title: 使用标准测试
sidebarTitle: Standard tests
---
**标准测试确保您的集成按预期工作。**

无论是为自己创建自定义类，还是发布到 LangChain 集成中，都需要添加测试以确保其按预期工作。LangChain 为每种集成类型提供了全面的[测试套件](https://pypi.org/project/langchain-tests/)。本指南将向您展示如何为每种集成类型添加 LangChain 的标准测试套件。

## 设置

首先，安装所需的依赖项：

<CardGroup :cols="2">

<Card title="langchain-core" icon="cube" href="https://github.com/langchain-ai/langchainjs/tree/main/langchain-core#readme" arrow>

定义了用于定义自定义组件所需的接口

</Card>

<Card title="langchain-tests" icon="flask" href="https://github.com/langchain-ai/langchainjs/tree/main/libs/langchain-standard-tests#readme" arrow>

提供标准测试以及运行它们所需的插件

</Card>

</CardGroup>

::: code-group

```bash [npm]
npm install @langchain/core
npm install @langchain/standard-tests
```

```bash [pnpm]
pnpm add @langchain/core
pnpm add @langchain/standard-tests
```

```bash [yarn]
yarn add @langchain/core
yarn add @langchain/standard-tests
```

```bash [bun]
bun add @langchain/core
bun add @langchain/standard-tests
```

:::

`langchain-tests` 包中有 2 个命名空间：

:::: details <Icon icon="gear" style="margin-right: 8px; vertical-align: middle;" /> 单元测试

<strong>位置</strong>：`src.unit_tests`

设计用于在隔离且无外部服务访问的情况下测试组件

[查看 API 参考](https://reference.langchain.com/python/langchain_tests/unit_tests)

::::

:::: details <Icon icon="network-wired" style="margin-right: 8px; vertical-align: middle;" /> 集成测试

<strong>位置</strong>：`src.integration_tests`

设计用于在可以访问外部服务（特别是组件设计与之交互的外部服务）的情况下测试组件

[查看 API 参考](https://reference.langchain.com/python/langchain_tests/integration_tests)

::::

## 实现标准测试

根据您的集成类型，您需要实现单元测试、集成测试或两者。

通过为您的集成类型子类化标准测试套件，您将获得该类型的全套标准测试。要使测试运行成功，给定的测试应仅在模型支持所测试功能时通过。否则，测试应被跳过。

由于不同的集成提供独特的功能集，LangChain 提供的大多数标准测试**默认是选择加入的**，以防止误报。因此，您需要重写属性以指示您的集成支持哪些功能 - 请参阅以下示例。

```javascript [tests/chat_models.standard.int.test.ts]
// 指示聊天模型支持并行工具调用

class ChatParrotLinkStandardIntegrationTests extends ChatModelIntegrationTests<
    ChatParrotLinkCallOptions,
    AIMessageChunk
> {
    constructor() {
        // ... 其他必需属性

        super({
            // ... 其他必需属性
            supportsParallelToolCalls: true,  // (默认值为 False)
            // ...
        });
    }
```

<Note>

您应该将这些测试组织在相对于包根目录的以下子目录中：
- `tests/unit_tests` 用于单元测试
- `tests/integration_tests` 用于集成测试

</Note>

要查看可配置功能的完整列表及其默认值，请访问标准测试的 [API 参考](https://reference.langchain.com/javascript)。

以下是一些来自流行集成的标准测试实现示例：

<Tabs>

<Tab title="单元测试">

</Tab>

<Tab title="集成测试">

</Tab>

</Tabs>

---

## 运行测试

TODO

## 故障排除

有关可用标准测试套件的完整列表，以及包含哪些测试以及如何排查常见问题的信息，请参阅 [标准测试 API 参考](https://v03.api.js.langchain.com/modules/_langchain_standard_tests.html)。

