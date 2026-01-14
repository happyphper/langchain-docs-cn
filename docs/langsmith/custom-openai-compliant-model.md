---
title: 连接到兼容 OpenAI 的模型提供商/代理
sidebarTitle: OpenAI-compliant model provider/proxy
---
LangSmith 的 Playground 允许您使用任何符合 OpenAI API 规范的模型。您可以通过在 Playground 中设置代理提供商来使用您的模型。

## 部署符合 OpenAI 规范的模型

许多提供商提供符合 OpenAI 规范的模型或代理服务。一些例子包括：

*   [LiteLLM Proxy](https://github.com/BerriAI/litellm?tab=readme-ov-file#quick-start-proxy---cli)
*   [Ollama](https://ollama.com/)

您可以使用这些提供商来部署您的模型，并获得一个符合 OpenAI API 规范的 API 端点。

请查看完整的 [规范](https://platform.openai.com/docs/api-reference/chat) 以获取更多信息。

## 在 LangSmith Playground 中使用模型

一旦您部署了模型服务器，就可以在 LangSmith 的 [Playground](/langsmith/prompt-engineering-concepts#prompt-playground) 中使用它。

要访问 **提示设置** 菜单：

1.  在 **提示** 标题下，选择模型名称旁边的齿轮 <Icon icon="gear" iconType="solid" /> 图标。
2.  在 **模型配置** 选项卡中，从下拉菜单中选择要编辑的模型。
3.  在 **提供商** 下拉菜单中，选择 **OpenAI 兼容端点**。
4.  将您的 OpenAI 兼容端点添加到 **基础 URL** 输入框中。

    
<div :style="{ textAlign: 'center' }">

<img src="/langsmith/images/openai-compatible-endpoint.png" alt="LangSmith UI 中的模型配置窗口，已选择模型，并且提供商下拉菜单中选择了 OpenAI 兼容端点。" />

<img src="/langsmith/images/openai-compatible-endpoint-dark.png" alt="LangSmith UI 中的模型配置窗口，已选择模型，并且提供商下拉菜单中选择了 OpenAI 兼容端点。" />

</div>

如果一切设置正确，您应该在 Playground 中看到模型的响应。您也可以使用此功能来调用下游流水线。

有关如何存储模型配置的信息，请参阅 [配置提示设置](/langsmith/managing-model-configurations)。
