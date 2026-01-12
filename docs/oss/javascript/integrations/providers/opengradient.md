---
title: OpenGradient
---
[OpenGradient](https://www.opengradient.ai/) 是一个去中心化 AI 计算网络，旨在提供全球可访问、无需许可且可验证的机器学习模型推理服务。

OpenGradient 的 LangChain 包目前提供了一个工具包，允许开发者为 OpenGradient 网络上的模型构建自定义的 ML 推理工具。这在过去是一个挑战，因为大型模型的参数会污染上下文窗口——想象一下，你不得不向你的智能体提供一个 200x200 的浮点数数组！

该工具包通过在工具定义本身内部封装所有数据处理逻辑来解决这个问题。这种方法保持了智能体上下文窗口的整洁，同时让开发者能够完全灵活地为其 ML 模型实现自定义数据处理和实时数据检索。

## 安装与设置

确保你拥有一个 OpenGradient API 密钥，以便访问 OpenGradient 网络。如果你已有 API 密钥，只需设置环境变量：

```python
!export OPENGRADIENT_PRIVATE_KEY="your-api-key"
```

如果你需要设置新的 API 密钥，请下载 opengradient SDK 并按照说明初始化新配置。

```python
!pip install opengradient
!opengradient config init
```

设置好 API 密钥后，安装 langchain-opengradient 包。

```python
pip install -U langchain-opengradient
```

## OpenGradient 工具包

OpenGradientToolkit 使开发者能够基于部署在 OpenGradient 去中心化网络上的 [ML 模型](https://hub.opengradient.ai/models) 和 [工作流](https://docs.opengradient.ai/developers/sdk/ml_workflows.html) 创建专用工具。这种集成使 LangChain 智能体能够访问强大的 ML 功能，同时保持高效的上下文使用。

### 主要优势

* 🔄 **实时数据集成** - 在你的工具中处理实时数据流
* 🎯 **动态处理** - 适应特定智能体输入的自定义数据管道
* 🧠 **上下文高效** - 处理复杂的 ML 操作，而不会淹没你的上下文窗口
* 🔌 **无缝部署** - 轻松与已部署在 OpenGradient 网络上的模型集成
* 🔧 **完全自定义** - 通过 [OpenGradient SDK](https://docs.opengradient.ai/developers/sdk/model_management.html) 创建和部署你自己的特定模型，然后基于它们构建自定义工具
* 🔐 **可验证推理** - 所有推理都在去中心化的 OpenGradient 网络上运行，允许用户选择各种安全方案，如 ZKML 和 TEE，以实现无需信任、可验证的模型执行

有关详细示例和实现指南，请查看我们的 [综合教程](/oss/javascript/integrations/tools/opengradient_toolkit.ipynb)。
