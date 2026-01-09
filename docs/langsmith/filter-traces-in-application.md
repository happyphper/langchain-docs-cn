---
title: 筛选追踪
sidebarTitle: Filter traces
---

<Tip>
<strong>推荐阅读</strong>：建议先阅读[追踪概念指南](/langsmith/observability-concepts)，以熟悉本页提到的概念。
</Tip>

追踪项目可能包含大量数据。过滤器用于有效导航和分析这些数据，使您能够：

- **进行聚焦调查**：快速缩小到特定运行记录以进行临时分析
- **调试和分析**：识别并检查错误、失败运行和性能瓶颈

本页包含一系列关于如何在追踪项目中过滤运行记录的指南。如果您通过[API](https://api.smith.langchain.com/redoc#tag/run/operation/query_runs_api_v1_runs_query_post)或[SDK](https://docs.smith.langchain.com/reference/python/client/langsmith.client.Client#langsmith.client.Client.list_runs)以编程方式导出运行记录进行分析，请参阅[导出追踪指南](./export-traces)获取更多信息。

## 创建和应用过滤器

### 按运行属性过滤

在追踪项目中有两种过滤运行记录的方式：

1.  **过滤器**：位于追踪项目页面左上角。这是您构建和管理详细过滤条件的地方。

![过滤](/langsmith/images/filter.png)

2.  **过滤快捷方式**：位于追踪项目页面的右侧边栏。过滤快捷方式栏提供基于项目运行记录中最常出现属性的快速过滤访问。

![过滤快捷方式](/langsmith/images/filter-shortcuts.png)

<Info>

<strong>默认过滤器</strong>

默认情况下，应用了 `IsTrace` 为 `true` 的过滤器。这仅显示顶级追踪。移除此过滤器将显示项目中的所有运行记录，包括中间跨度。

</Info>

### 按时间范围过滤

除了按运行属性过滤外，您还可以在特定时间范围内过滤运行记录。此选项位于追踪项目页面的左上角。

![按时间过滤](/langsmith/images/filter-time.png)

### 过滤运算符

可用的过滤运算符取决于您要过滤属性的数据类型。以下是常见运算符的概述：

- **is**：与过滤值完全匹配
- **is not**：与过滤值不匹配
- **contains**：与过滤值部分匹配
- **does not contain**：与过滤值部分不匹配
- **is one of**：与列表中的任何值匹配
- `>` / `<`：可用于数字字段

## 特定过滤技术

### 过滤中间运行记录（跨度）

为了过滤中间运行记录（跨度），您首先需要移除默认的 `IsTrace` 为 `true` 的过滤器。例如，如果您想按子运行的 `run name` 或按 `run type` 进行过滤，就需要这样做。

运行元数据和标签也是强大的过滤依据。这依赖于您管道所有部分良好的标签实践。要了解更多信息，可以查看[此指南](./add-metadata-tags)。

### 基于输入和输出过滤

您可以根据运行记录的输入和输出内容来过滤运行记录。

要过滤输入或输出，可以使用 `Full-Text Search` 过滤器，它将在任一字段中匹配关键字。要进行更有针对性的搜索，可以使用 `Input` 或 `Output` 过滤器，它们将仅根据相应字段匹配内容。

<Note>

出于性能考虑，我们对全文搜索索引最多 250 个字符的数据。如果您的搜索查询超过此限制，建议改用[输入/输出键值搜索](/langsmith/filter-traces-in-application#filter-based-on-input-%2F-output-key-value-pairs)。

</Note>

您还可以指定多个匹配项，可以通过包含用空格分隔的多个术语，或添加多个过滤器来实现——系统将尝试匹配提供的所有术语。

请注意，关键字搜索是通过拆分文本并查找搜索关键字的任何部分匹配来完成的，因此不是按特定顺序进行的。我们从搜索中排除了常见的停用词（来自 nltk 停用词列表以及其他一些常见的 JSON 关键字）。

![过滤](/langsmith/images/filter-full-text.png)

基于上述过滤器，系统将在输入或输出中搜索 `python` 和 `tensorflow`，并在输入中搜索 `embedding`，同时在输出中搜索 `fine` 和 `tune`。

### 基于输入/输出键值对过滤

除了全文搜索，您还可以根据输入和输出中的特定键值对来过滤运行记录。这允许进行更精确的过滤，尤其是在处理结构化数据时。

<Note>

为了保持数据的有序性和可搜索性，我们对每个运行记录索引最多 100 个唯一键。每个键的每个值也有 250 个字符的限制。如果您的数据超过任一限制，文本将不会被索引。这有助于我们确保快速、可靠的性能。

</Note>

要基于键值对进行过滤，请从过滤器下拉菜单中选择 `Input Key` 或 `Output Key` 过滤器。

例如，要匹配以下输入：

```json
{
  "input": "What is the capital of France?"
}
```

选择 `Filters`、`Add Filter` 以调出过滤选项。然后选择 `Input Key`，输入 `input` 作为键，并输入 `What is the capital of France?` 作为值。

![过滤](/langsmith/images/search-kv-input.png)

您还可以通过使用点符号选择嵌套键名来匹配嵌套键。例如，要匹配输出中的嵌套键：

```json
{
  "documents": [
    {
      "page_content": "The capital of France is Paris",
      "metadata": {},
      "type": "Document"
    }
  ]
}
```

选择 `Output Key`，输入 `documents.page_content` 作为键，并输入 `The capital of France is Paris` 作为值。这将匹配具有指定值的嵌套键 `documents.page_content`。

![过滤](/langsmith/images/search-kv-output.png)

您可以添加多个键值过滤器以创建更复杂的查询。您还可以使用右侧的 `Filter Shortcuts` 快速基于常见的键值对进行过滤，如下所示：

![过滤](/langsmith/images/search-kv-filter-shortcut.png)

### 示例：过滤工具调用

通常需要搜索包含特定工具调用的追踪。工具调用通常在 LLM 运行的输出中指示。要过滤工具调用，您需要使用 `Output Key` 过滤器。

虽然此示例将向您展示如何过滤工具调用，但相同的逻辑可以应用于过滤输出中的任何键值对。

在这种情况下，假设这是您要过滤的输出：

```json
{
  "generations": [
    [
      {
        "text": "",
        "type": "ChatGeneration",
        "message": {
          "lc": 1,
          "type": "constructor",
          "id": [],
          "kwargs": {
            "type": "ai",
            "id": "run-ca7f7531-f4de-4790-9c3e-960be7f8b109",
            "tool_calls": [
              {
                "name": "Plan",
                "args": {
                  "steps": [
                    "Research LangGraph's node configuration capabilities",
                    "Investigate how to add a Python code execution node",
                    "Find an example or create a sample implementation of a code execution node"
                  ]
                },
                "id": "toolu_01XexPzAVknT3gRmUB5PK5BP",
                "type": "tool_call"
              }
            ]
          }
        }
      }
    ]
  ],
  "llm_output": null,
  "run": null,
  "type": "LLMResult"
}
```

对于上面的示例，KV 搜索会将每个嵌套的 JSON 路径映射为您可以用来搜索和过滤的键值对。

LangSmith 会将其分解为以下可搜索的键值对集合：

| 键                                                 | 值                                                                           |
| -------------------------------------------------- | ---------------------------------------------------------------------------- |
| `generations.type`                                 | `ChatGeneration`                                                             |
| `generations.message.type`                         | `constructor`                                                                |
| `generations.message.kwargs.type`                  | `ai`                                                                         |
| `generations.message.kwargs.id`                    | `run-ca7f7531-f4de-4790-9c3e-960be7f8b109`                                   |
| `generations.message.kwargs.tool_calls.name`       | `Plan`                                                                       |
| `generations.message.kwargs.tool_calls.args.steps` | `Research LangGraph's node configuration capabilities`                       |
| `generations.message.kwargs.tool_calls.args.steps` | `Investigate how to add a Python code execution node`                        |
| `generations.message.kwargs.tool_calls.args.steps` | `Find an example or create a sample implementation of a code execution node` |
| `generations.message.kwargs.tool_calls.id`         | `toolu_01XexPzAVknT3gRmUB5PK5BP`                                             |
| `generations.message.kwargs.tool_calls.type`       | `tool_call`                                                                  |
| `type`                                             | `LLMResult`                                                                  |

要搜索特定的工具调用，您可以在移除根运行过滤器的情况下使用以下 Output Key 搜索：

`generations.message.kwargs.tool_calls.name` = `Plan`

这将匹配 `tool_calls` 名称为 `Plan` 的根运行和非根运行。

![过滤](/langsmith/images/search-kv-tool.png)

### 对键值对进行否定过滤

可以对 `Metadata`、`Input Key` 和 `Output Key` 字段应用不同类型的否定过滤，以从结果中排除特定的运行记录。

例如，要查找元数据键 `phone` 不等于 `1234567890` 的所有运行记录，请将 `Metadata` 的 `Key` 运算符设置为 `is`，`Key` 字段设置为 `phone`，然后将 `Value` 运算符设置为 `is not`，`Value` 字段设置为 `1234567890`。这将匹配所有元数据键 `phone` 具有除 `1234567890` 以外的任何值的运行记录。

![过滤](/langsmith/images/negative-filtering-1.png)

要查找没有特定元数据键的运行记录，请将 `Key` 运算符设置为 `is not`。例如，将 `Key` 运算符设置为 `is not`，键为 `phone`，将匹配所有元数据中没有 `phone` 字段的运行记录。

![过滤](/langsmith/images/negative-filtering-2.png)

您还可以过滤既没有特定键也没有特定值的运行记录。要查找元数据中既没有键 `phone` 也没有任何值为 `1234567890` 的字段的运行记录，请将 `Key` 运算符设置为 `is not`，键为 `phone`，并将 `Value` 运算符设置为 `is not`，值为 `1234567890`。

![过滤](/langsmith/images/negative-filtering-3.png)

最后，您还可以过滤没有特定键但具有特定值的运行记录。要查找没有 `phone` 键但存在某个其他键的值为 `1234567890` 的运行记录，请将 `Key` 运算符设置为 `is not`，键为 `phone`，并将 `Value` 运算符设置为 `is`，值为 `1234567890`。

![过滤](/langsmith/images/negative-filtering-4.png)

请注意，您可以使用 `does not contain` 运算符代替 `is not` 来执行子字符串匹配。

## 保存过滤器

保存过滤器允许您存储和重用常用的过滤器配置。保存的过滤器特定于一个追踪项目。

#### 保存过滤器

在过滤器框中，构建好过滤器后，点击 **Save filter** 按钮。这将弹出一个对话框，用于指定过滤器的名称和描述。

![过滤](/langsmith/images/save-a-filter.png)

#### 使用已保存的过滤器

保存过滤器后，它会在过滤器栏中作为快速过滤器供您使用。如果您有超过三个已保存的过滤器，则只会直接显示两个，其余的可以通过“更多”菜单访问。您可以使用已保存过滤器栏中的设置图标选择性地隐藏默认的已保存过滤器。

![过滤](/langsmith/images/selecting-a-filter.png)

#### 更新已保存的过滤器

选中过滤器后，对过滤器参数进行任何更改。然后点击 **Update filter** > **Update** 以更新过滤器。

在同一菜单中，您也可以通过点击 **Update filter** > **Create new** 来创建新的已保存过滤器。

#### 删除已保存的过滤器

点击已保存过滤器栏中的设置图标，然后使用垃圾桶图标删除过滤器。

## 复制过滤器

您可以复制已构建的过滤器，以便与同事分享、稍后重用，或在[API](https://api.smith.langchain.com/redoc#tag/run/operation/query_runs_api_v1_runs_query_post)或[SDK](https://docs.smith.langchain.com/reference/python/client/langsmith.client.Client#langsmith.client.Client.list_runs)中以编程方式查询运行记录。

为了复制过滤器，您可以首先在 UI 中创建它。然后，您可以点击右上角的复制按钮。如果您构建了树或追踪过滤器，也可以复制它们。

这将为您提供一个代表 LangSmith 查询语言中过滤器的字符串。例如：`and(eq(is_root, true), and(eq(feedback_key, "user_score"), eq(feedback_score, 1)))`。有关查询语言语法的更多信息，请参阅[此参考](/langsmith/trace-query-syntax#filter-query-language)。

![复制过滤器](/langsmith/images/copy-filter.png)

## 在追踪视图中过滤运行记录

您还可以直接在追踪视图中应用过滤器，这对于筛选具有大量运行记录的追踪非常有用。主运行记录表视图中可用的相同过滤器也可以在此处应用。

默认情况下，只会显示与过滤器匹配的运行记录。要在更广泛的追踪树上下文中查看匹配的运行记录，请将视图选项从“Filtered Only”切换到“Show All”或“Most relevant”。

![在追踪视图中过滤](/langsmith/images/filter-runs-in-trace-view.png)

## 在 LangSmith 查询语言中手动指定原始查询

如果您[复制了先前构建的过滤器](/langsmith/filter-traces-in-application#copy-the-filter)，您可能希望在未来的会话中手动应用此原始查询。

为此，您可以点击过滤器弹出窗口底部的 **Advanced filters**。然后，您可以将原始查询粘贴到文本框中。

请注意，这会将查询添加到现有查询中，而不是覆盖它。

![原始查询](/langsmith/images/raw-query.png)

## 使用 AI 查询自动生成查询（实验性）

有时，确定要指定的确切查询可能很困难！为了简化操作，我们添加了 `AI Query` 功能。通过此功能，您可以用自然语言输入想要构建的过滤器，它会将其转换为有效的查询。

例如：“所有运行时间超过 10 秒的运行记录”

![AI 查询](/langsmith/images/ai-query.png)

## 高级过滤器

### 根据根运行记录的属性过滤中间运行记录（跨度）

一个常见的概念是过滤那些属于某个追踪的中间运行记录，而该追踪的根运行记录具有某些属性。例如，过滤特定类型的中间运行记录，其根运行记录具有与之关联的正面（或负面）反馈。

为此，首先为中间运行记录设置一个过滤器（根据上述部分）。之后，您可以添加另一个过滤规则。然后，您可以点击过滤器最底部的 `Advanced Filters` 链接。这将打开一个新的模态框，您可以在其中添加 `Trace filters`。这些过滤器将应用于您已过滤的各个运行记录的所有父运行记录的追踪。

![过滤](/langsmith/images/trace-filter.png)

### 过滤其子运行记录具有某些属性的运行记录（跨度）

这与上述情况相反。您可能希望搜索具有特定类型子运行记录的运行记录。例如，搜索所有具有名为 `Foo` 的子运行记录的追踪。当 `Foo` 并非总是被调用，但您想分析它被调用的情况时，这很有用。

为此，您可以点击过滤器最底部的 `Advanced Filters` 链接。这将打开一个新的模态框，您可以在其中添加 `Tree filters`。这将使您指定的规则应用于您已过滤的各个运行记录的所有子运行记录。

![过滤](/langsmith/images/child-runs.png)

### 示例：过滤其树包含工具调用过滤器的所有运行记录

扩展上面的[工具调用过滤示例](/langsmith/filter-traces-in-application#example-filtering-for-tool-calls)，如果您想过滤其树包含工具调用过滤器的所有运行记录，可以在[高级过滤器](/langsmith/filter-traces-in-application#advanced-filters)设置中使用树过滤器：

![过滤](/langsmith/images/search-kv-tool-tree.png)
