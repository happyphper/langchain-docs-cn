---
title: 日志检索器追踪
sidebarTitle: Log retriever traces
---

<Note>

即使未以正确格式记录检索器（retriever）追踪，也不会导致系统中断，数据仍会被记录。然而，数据将无法以针对检索步骤的特定方式进行渲染。

</Note>

许多 LLM 应用需要从向量数据库、知识图谱或其他类型的索引中查找文档。检索器追踪是一种记录检索器所获取文档的方式。LangSmith 在追踪中为检索步骤提供了特殊的渲染方式，以便更轻松地理解和诊断检索问题。为了使检索步骤能够正确渲染，需要采取几个小步骤。

1. 使用 `run_type="retriever"` 为检索步骤添加注解。

2. 从检索步骤返回一个 Python 字典列表或 TypeScript 对象列表。每个字典应包含以下键：

   * `page_content`：文档的文本内容。
   * `type`：应始终为 "Document"。
   * `metadata`：一个包含文档元数据的 Python 字典或 TypeScript 对象。此元数据将在追踪中显示。

以下代码片段展示了如何在 Python 和 TypeScript 中记录检索步骤。

::: code-group

```python [Python]
from langsmith import traceable

def _convert_docs(results):
    return [
        {
            "page_content": r,
            "type": "Document",
            "metadata": {"foo": "bar"}
        }
        for r in results
    ]

@traceable(run_type="retriever")
def retrieve_docs(query):
    # Foo retriever returning hardcoded dummy documents.
    # In production, this could be a real vector datatabase or other document index.
    contents = ["Document contents 1", "Document contents 2", "Document contents 3"]
    return _convert_docs(contents)

retrieve_docs("User query")
```

```typescript [TypeScript]
import { traceable } from "langsmith/traceable";

interface Document {
    page_content: string;
    type: string;
    metadata: { foo: string };
}

function convertDocs(results: string[]): Document[] {
    return results.map((r) => ({
        page_content: r,
        type: "Document",
        metadata: { foo: "bar" }
    }));
}

const retrieveDocs = traceable((query: string): Document[] => {
    // Foo retriever returning hardcoded dummy documents.
    // In production, this could be a real vector database or other document index.
    const contents = ["Document contents 1", "Document contents 2", "Document contents 3"];
    return convertDocs(contents);
},{
    name: "retrieveDocs",
    run_type: "retriever"
} // Configuration for traceable
);

await retrieveDocs("User query");
```

:::

下图展示了检索步骤在追踪中的渲染方式。每个文档的内容及其元数据都会一并显示。

![Retriever trace](/langsmith/images/retriever-trace.png)
