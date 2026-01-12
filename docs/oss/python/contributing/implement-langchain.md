---
title: 实现 LangChain 集成
sidebarTitle: Implement
---
集成包是用户可以安装并在其项目中使用的 Python 包。它们实现了一个或多个遵循 LangChain 接口标准的组件。

LangChain 组件是 [`langchain-core`](https://github.com/langchain-ai/langchain/tree/master/libs/core) 中基类的子类。例如包括[聊天模型](/oss/python/integrations/chat)、[工具](/oss/python/integrations/tools)、[检索器](/oss/python/integrations/retrievers)等。

您的集成包通常需要实现至少一个此类组件的子类。展开下方标签页以查看每个组件的详细信息。

<Tabs>

<Tab title="聊天模型">

聊天模型是 <a href="https://reference.langchain.com/python/langchain_core/language_models/#langchain_core.language_models.chat_models.BaseChatModel" target="_blank" rel="noreferrer" class="link"><code>BaseChatModel</code></a> 类的子类。它们实现了生成聊天补全、处理消息格式和管理模型参数的方法。

<Warning>

聊天模型集成指南目前正在编写中。在此期间，请阅读[聊天模型概念指南](/oss/python/langchain/models)以了解 LangChain 聊天模型的工作原理。

</Warning>

</Tab>

<Tab title="工具">

工具主要有两种使用方式：

 1.  定义一个“输入模式”或“参数模式”，与文本请求一起传递给聊天模型的工具调用功能，以便聊天模型可以生成一个“工具调用”，或调用工具所需的参数。
 2.  接收如上生成的“工具调用”，执行某些操作并返回一个响应，该响应可以作为 ToolMessage 传递回聊天模型。

Tools 类必须继承自 <a href="https://reference.langchain.com/python/langchain/tools/#langchain.tools.BaseTool" target="_blank" rel="noreferrer" class="link"><code>BaseTool</code></a> 基类。此接口包含 3 个属性和 2 个方法，应在子类中实现。

<Warning>

工具集成指南目前正在编写中。在此期间，请阅读[工具概念指南](/oss/python/langchain/tools)以了解 LangChain 工具的工作原理。

</Warning>

</Tab>

<Tab title="检索器">

检索器用于根据查询从 API、数据库或其他来源检索文档。Retriever 类必须继承自 BaseRetriever 基类。

<Warning>

检索器集成指南目前正在编写中。在此期间，请阅读[检索器概念指南](/oss/python/integrations/retrievers)以了解 LangChain 检索器的工作原理。

</Warning>

</Tab>

<Tab title="向量存储">

所有向量存储必须继承自 <a href="https://reference.langchain.com/python/langchain_core/vectorstores/?h=#langchain_core.vectorstores.base.VectorStore" target="_blank" rel="noreferrer" class="link"><code>VectorStore</code></a> 基类。此接口包含用于在向量存储中写入、删除和搜索文档的方法。

有关实现向量存储集成的详细信息，请参阅[向量存储集成指南](/oss/python/integrations/vectorstores)。

<Warning>

向量存储集成指南目前正在编写中。在此期间，请阅读[向量存储概念指南](/oss/python/integrations/vectorstores)以了解 LangChain 向量存储的工作原理。

</Warning>

</Tab>

<Tab title="嵌入模型">

嵌入模型是 <a href="https://reference.langchain.com/python/langchain_core/embeddings/#langchain_core.embeddings.embeddings.Embeddings" target="_blank" rel="noreferrer" class="link"><code>Embeddings</code></a> 类的子类。

<Warning>

嵌入模型集成指南目前正在编写中。在此期间，请阅读[嵌入模型概念指南](/oss/python/integrations/text_embedding)以了解 LangChain 嵌入模型的工作原理。

</Warning>

</Tab>

</Tabs>

