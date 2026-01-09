---
title: Label Studio
---
>[Label Studio](https://labelstud.io/guide/get_started) 是一个开源的数据标注平台，它为 LangChain 在为大语言模型（LLMs）微调进行数据标注时提供了灵活性。它还支持准备自定义训练数据，并通过人工反馈来收集和评估响应。

在本指南中，您将学习如何将 LangChain 流水线连接到 `Label Studio`，以实现以下目标：

- 将所有输入提示、对话和响应聚合到一个 `Label Studio` 项目中。这可以将所有数据整合在一个地方，便于标注和分析。
- 优化提示和响应，以创建用于监督微调（SFT）和基于人类反馈的强化学习（RLHF）场景的数据集。标注后的数据可用于进一步训练 LLM 以提升其性能。
- 通过人工反馈评估模型响应。`Label Studio` 提供了一个界面，供人类审查模型响应并提供反馈，从而实现评估和迭代。

## 安装与设置

首先安装最新版本的 Label Studio 和 Label Studio API 客户端：

```python
pip install -qU langchain label-studio label-studio-sdk langchain-openai langchain-community
```

接下来，在命令行中运行 `label-studio`，以在 `http://localhost:8080` 启动本地 LabelStudio 实例。更多选项请参阅 [Label Studio 安装指南](https://labelstud.io/guide/install)。

您需要一个令牌（token）来进行 API 调用。

在浏览器中打开您的 LabelStudio 实例，转到 `Account & Settings > Access Token` 并复制密钥。

设置环境变量，包含您的 LabelStudio URL、API 密钥和 OpenAI API 密钥：

```python
import os

os.environ["LABEL_STUDIO_URL"] = "<YOUR-LABEL-STUDIO-URL>"  # 例如 http://localhost:8080
os.environ["LABEL_STUDIO_API_KEY"] = "<YOUR-LABEL-STUDIO-API-KEY>"
os.environ["OPENAI_API_KEY"] = "<YOUR-OPENAI-API-KEY>"
```

## 收集 LLM 提示与响应

用于标注的数据存储在 Label Studio 的项目中。每个项目由一个 XML 配置标识，该配置详细说明了输入和输出数据的规范。

创建一个项目，该项目接收文本格式的人工输入，并在文本区域输出一个可编辑的 LLM 响应：

```xml
<View>
<Style>
    .prompt-box {
        background-color: white;
        border-radius: 10px;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        padding: 20px;
    }
</Style>
<View className="root">
    <View className="prompt-box">
        <Text name="prompt" value="$prompt"/>
    </View>
    <TextArea name="response" toName="prompt"
              maxSubmissions="1" editable="true"
              required="true"/>
</View>
<Header value="Rate the response:"/>
<Rating name="rating" toName="prompt"/>
</View>
```

1.  要在 Label Studio 中创建项目，请点击 "Create" 按钮。
2.  在 "Project Name" 字段中输入您的项目名称，例如 `My Project`。
3.  导航到 `Labeling Setup > Custom Template` 并粘贴上面提供的 XML 配置。

您可以在 LabelStudio 项目中收集输入的 LLM 提示和输出响应，并通过 `LabelStudioCallbackHandler` 连接它：

```python
from langchain_community.callbacks.labelstudio_callback import (
    LabelStudioCallbackHandler,
)
```

```python
from langchain_openai import OpenAI

llm = OpenAI(
    temperature=0, callbacks=[LabelStudioCallbackHandler(project_name="My Project")]
)
print(llm.invoke("Tell me a joke"))
```

在 Label Studio 中，打开 `My Project`。您将看到提示、响应以及模型名称等元数据。

## 收集聊天模型对话

您还可以在 LabelStudio 中跟踪和显示完整的聊天对话，并能够对最后一个响应进行评分和修改：

1.  打开 Label Studio 并点击 "Create" 按钮。
2.  在 "Project Name" 字段中输入您的项目名称，例如 `New Project with Chat`。
3.  导航到 Labeling Setup > Custom Template 并粘贴以下 XML 配置：

```xml
<View>
<View className="root">
     <Paragraphs name="dialogue"
               value="$prompt"
               layout="dialogue"
               textKey="content"
               nameKey="role"
               granularity="sentence"/>
  <Header value="Final response:"/>
    <TextArea name="response" toName="dialogue"
              maxSubmissions="1" editable="true"
              required="true"/>
</View>
<Header value="Rate the response:"/>
<Rating name="rating" toName="dialogue"/>
</View>
```

```python
from langchain.messages import HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI

chat_llm = ChatOpenAI(
    callbacks=[
        LabelStudioCallbackHandler(
            mode="chat",
            project_name="New Project with Chat",
        )
    ]
)
llm_results = chat_llm.invoke(
    [
        SystemMessage(content="Always use a lot of emojis"),
        HumanMessage(content="Tell me a joke"),
    ]
)
```

在 Label Studio 中，打开 "New Project with Chat"。点击一个已创建的任务以查看对话历史并编辑/标注响应。

## 自定义标注配置

您可以修改 LabelStudio 中的默认标注配置，以添加更多目标标签，如响应情感、相关性以及许多[其他类型的标注者反馈](https://labelstud.io/tags/)。

可以从 UI 添加新的标注配置：转到 `Settings > Labeling Interface`，并设置一个包含额外标签（如用于情感的 `Choices` 或用于相关性的 `Rating`）的自定义配置。请注意，任何配置中都必须包含 [`TextArea` 标签](https://labelstud.io/tags/textarea) 以显示 LLM 响应。

或者，您可以在项目创建之前的初始调用中指定标注配置：

```python
ls = LabelStudioCallbackHandler(
    project_config="""
<View>
<Text name="prompt" value="$prompt"/>
<TextArea name="response" toName="prompt"/>
<TextArea name="user_feedback" toName="prompt"/>
<Rating name="rating" toName="prompt"/>
<Choices name="sentiment" toName="prompt">
    <Choice value="Positive"/>
    <Choice value="Negative"/>
</Choices>
</View>
"""
)
```

请注意，如果项目不存在，将使用指定的标注配置创建它。

## 其他参数

`LabelStudioCallbackHandler` 接受几个可选参数：

-   **api_key** - Label Studio API 密钥。覆盖环境变量 `LABEL_STUDIO_API_KEY`。
-   **url** - Label Studio URL。覆盖 `LABEL_STUDIO_URL`，默认为 `http://localhost:8080`。
-   **project_id** - 现有的 Label Studio 项目 ID。覆盖 `LABEL_STUDIO_PROJECT_ID`。将数据存储在此项目中。
-   **project_name** - 如果未指定项目 ID，则使用项目名称。创建一个新项目。默认为 `"LangChain-%Y-%m-%d"`，格式化为当前日期。
-   **project_config** - [自定义标注配置](#custom-labeling-configuration)
-   **mode**：使用此快捷方式从头创建目标配置：
    -   `"prompt"` - 单提示，单响应。默认值。
    -   `"chat"` - 多轮聊天模式。
