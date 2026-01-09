---
title: 动态少样本示例选择
sidebarTitle: Dynamic few shot example selection
---

<Note>

此功能处于公开测试阶段。仅适用于付费团队计划。如果您对启用此功能有疑问，请通过 [support.langchain.com](https://support.langchain.com) 联系支持团队。

</Note>

配置您的数据集，以便能够根据传入的请求搜索少样本示例。

## 前提条件

1.  您的数据集必须使用 KV 存储数据类型（我们目前不支持聊天模型或 LLM 类型的数据集）。
2.  您必须为数据集定义了输入模式。有关详细信息，请参阅我们在 UI 中设置模式验证的文档。
3.  您必须处于付费团队计划中（例如 Plus 计划）。
4.  您必须使用 LangSmith 云服务。

## 为少样本搜索建立数据集索引

导航到数据集 UI，点击新的 `Few-Shot search` 选项卡。点击 `Start sync` 按钮，这将在您的数据集上创建一个新索引，使其可搜索。

![Few shot tab unsynced](/langsmith/images/few-shot-tab-unsynced.png)

默认情况下，我们会同步到数据集的最新版本。这意味着当新示例添加到您的数据集时，它们将自动添加到您的索引中。此过程每隔几分钟运行一次，因此索引新示例会有很短的延迟。您可以在下一节屏幕左侧的 `Few-shot index` 下查看您的索引是否是最新的。

## 在少样本测试场中测试搜索质量

现在您已为数据集启用了索引，您将看到新的少样本测试场。

![Few shot synced empty state](/langsmith/images/few-shot-synced-empty-state.png)

您可以输入一个示例输入，并检查我们的搜索 API 将返回哪些结果。

![Few shot search results](/langsmith/images/few-shot-search-results.png)

每个结果都会有一个分数和一个指向数据集中示例的链接。评分系统的工作方式是：0 分表示完全随机的结果，分数越高越好。结果将根据分数按降序排序。

<Note>

搜索使用类似 BM25 的算法进行基于关键词的相似度评分。随着我们改进搜索算法，实际分数可能会发生变化，因此我们建议不要依赖分数本身，因为其含义可能会随时间演变。它们仅用于在测试场中方便地直观测试输出。

</Note>

## 将少样本搜索添加到您的应用程序

点击上一张图中的 `Get Code Snippet` 按钮，您将进入一个页面，其中包含我们 LangSmith SDK 以不同语言提供的代码片段。

![Few shot code snippet](/langsmith/images/few-shot-code-snippet.png)

有关在 LangChain Python 应用程序中使用少样本搜索的代码示例，请参阅我们在 LangChain 文档中的操作指南。

### 代码片段

<Note>

请确保您使用的 Python SDK 版本 >= 1.101 或 TypeScript SDK 版本 >= 1.43。

</Note>

为方便复制粘贴，您可以在此处找到与上图所示类似的代码片段：

::: code-group

```python [Python (Async)]
import langsmith as ls
# Copy this value from LangSmith UI
dataset_id = "1c5e9c95-dfd4-4dc5-a4b8-df7ea921c913"
async with ls.AsyncClient() as client:
  examples = await client.similar_examples(
      {"question": "knock knock"}, dataset_id=dataset_id, limit=1
  )
  print(examples[0].outputs)  # {"output": "Few shots'll do the trick."}
```

```python [Python]
from langsmith import Client
client = Client()
# Copy this value from LangSmith UI
dataset_id = "1c5e9c95-dfd4-4dc5-a4b8-df7ea921c913"
examples = client.similar_examples(
  {"question": "knock knock"}, dataset_id=dataset_id, limit=1
)
print(examples[0].outputs)
# {"output": "Few shots'll do the trick."}
```

```typescript [TypeScript]
import { Client } from "langsmith";
const client = new Client();
// Copy this value from LangSmith UI
const dataset_id = "1c5e9c95-dfd4-4dc5-a4b8-df7ea921c913";
const examples = await client.similarExamples({question: "knock knock"}, dataset_id, 1);
console.log(examples[0].outputs);
// {output: "Few shots'll do the trick."}
```

:::

