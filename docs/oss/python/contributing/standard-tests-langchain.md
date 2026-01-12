---
title: 使用标准测试
sidebarTitle: Standard tests
---
**标准测试确保您的集成按预期工作。**

无论是为自己创建自定义类，还是发布到 LangChain 集成中，都需要添加测试以确保其按预期工作。LangChain 为每种集成类型提供了全面的[测试套件](https://pypi.org/project/langchain-tests/)。本指南将向您展示如何为每种集成类型添加 LangChain 的标准测试套件。

## 设置

首先，安装所需的依赖项：

<CardGroup :cols="2">

<Card title="langchain-core" icon="cube" href="https://github.com/langchain-ai/langchain/tree/master/libs/core#readme" arrow>

定义了用于定义自定义组件所需的接口

</Card>

<Card title="langchain-tests" icon="flask" href="https://github.com/langchain-ai/langchain/tree/master/libs/standard-tests#readme" arrow>

提供标准测试以及运行它们所需的 `pytest` 插件

</Card>

</CardGroup>

<Warning>

由于 `langchain-tests` 新版本中添加的测试可能会破坏您的 CI/CD 流水线，我们建议固定使用 [`langchain-tests`](https://pypi.org/project/langchain-tests/#history) 的最新版本，以避免意外更改。

</Warning>

::: code-group

```bash [pip]
pip install -U langchain-core
pip install -U langchain-tests
```
```bash [uv]
uv add langchain-core
uv add langchain-tests
```

:::

`langchain-tests` 包中有 2 个命名空间：

:::: details <Icon icon="gear" style="margin-right: 8px; vertical-align: middle;" /> 单元测试

<strong>位置</strong>：`langchain_tests.unit_tests`

设计用于在隔离且无外部服务访问的情况下测试组件

[查看 API 参考](https://reference.langchain.com/python/langchain_tests/unit_tests)

::::

:::: details <Icon icon="network-wired" style="margin-right: 8px; vertical-align: middle;" /> 集成测试

<strong>位置</strong>：`langchain_tests.integration_tests`

设计用于在可以访问外部服务（特别是组件设计与之交互的外部服务）的情况下测试组件

[查看 API 参考](https://reference.langchain.com/python/langchain_tests/integration_tests)

::::

两种类型的测试都实现为基于类的 [`pytest`](https://docs.pytest.org/en/stable/) 测试套件。

## 实现标准测试

根据您的集成类型，您需要实现单元测试、集成测试或两者。

通过为您的集成类型子类化标准测试套件，您将获得该类型的全套标准测试。要使测试运行成功，给定的测试应仅在模型支持所测试功能时通过。否则，测试应被跳过。

由于不同的集成提供独特的功能集，LangChain 提供的大多数标准测试**默认是选择加入的**，以防止误报。因此，您需要重写属性以指示您的集成支持哪些功能 - 请参阅以下示例。

```python [tests/integration_tests/test_standard.py]
# 指示聊天模型支持图像输入

class TestChatParrotLinkStandard(ChatModelIntegrationTests):
    # ... 其他必需属性

    @property
    def supports_image_inputs(self) -> bool:
        return True  # (默认值为 False)
```

<Note>

您应该将这些测试组织在相对于包根目录的以下子目录中：
- `tests/unit_tests` 用于单元测试
- `tests/integration_tests` 用于集成测试

</Note>

要查看可配置功能的完整列表及其默认值，请访问标准测试的 [API 参考](https://reference.langchain.com/python/langchain_tests)。

以下是一些来自流行集成的标准测试实现示例：

<Tabs>

<Tab title="单元测试">

<Columns :cols="3">

<Card title="ChatOpenAI" href="https://github.com/langchain-ai/langchain/blob/master/libs/partners/openai/tests/unit_tests/chat_models/test_base_standard.py" arrow>
单元测试
</Card>

<Card title="ChatAnthropic" href="https://github.com/langchain-ai/langchain/blob/master/libs/partners/anthropic/tests/unit_tests/test_standard.py" arrow>
单元测试
</Card>

<Card title="ChatGenAI" href="https://github.com/langchain-ai/langchain-google/blob/main/libs/genai/tests/unit_tests/test_standard.py" arrow>
单元测试
</Card>

</Columns>

</Tab>

<Tab title="集成测试">

<Columns :cols="3">

<Card title="ChatOpenAI" href="https://github.com/langchain-ai/langchain/blob/master/libs/partners/openai/tests/integration_tests/chat_models/test_base_standard.py" arrow>
集成测试
</Card>

<Card title="ChatAnthropic" href="https://github.com/langchain-ai/langchain/blob/master/libs/partners/anthropic/tests/integration_tests/test_standard.py" arrow>
集成测试
</Card>

<Card title="ChatGenAI" href="https://github.com/langchain-ai/langchain-google/blob/main/libs/genai/tests/integration_tests/test_standard.py" arrow>
集成测试
</Card>

</Columns>

</Tab>

</Tabs>

---

## 运行测试

如果从模板引导集成，会提供一个 `Makefile`，其中包含运行单元测试和集成测试的目标：

```bash
make test
make integration_test
```

否则，如果您遵循推荐的目录结构，可以使用以下命令运行测试：

```bash
# 运行所有测试
uv run --group test pytest tests/unit_tests/
uv run --group test --group test_integration pytest -n auto tests/integration_tests/

# 对于某些单元测试，您可能需要设置特定的标志和环境变量：
TIKTOKEN_CACHE_DIR=tiktoken_cache uv run --group test pytest --disable-socket --allow-unix-socket tests/unit_tests/

# 运行特定的测试文件
uv run --group test pytest tests/integration_tests/test_chat_models.py

# 运行文件中特定的测试函数
uv run --group test pytest tests/integration_tests/test_chat_models.py::test_chat_completions

# 运行类中特定的测试函数
uv run --group test pytest tests/integration_tests/test_chat_models.py::TestChatParrotLinkIntegration::test_chat_completions
```

## 故障排除

有关可用标准测试套件的完整列表，以及包含哪些测试以及如何排查常见问题的信息，请参阅 [标准测试 API 参考](https://reference.langchain.com/python/langchain_tests)。

