---
title: 示例数据格式
sidebarTitle: Example data format
---

<Check>

在深入阅读本内容之前，建议先阅读以下内容：

* [评估概念指南](/langsmith/evaluation-concepts)

</Check>

LangSmith 将示例存储在数据集中，其结构如下：

| 字段名称          | 类型     | 描述                                                                                                       |
| ------------------- | -------- | ----------------------------------------------------------------------------------------------------------------- |
| **id**              | UUID     | 示例的唯一标识符。                                                                                |
| **name**            | string   | 示例的名称。                                                                                          |
| **created\_at**     | datetime | 此示例的创建时间。                                                                                 |
| **modified\_at**    | datetime | 此示例的最后修改时间。                                                                           |
| **inputs**          | object   | 示例的输入映射。                                                                                  |
| **outputs**         | object   | 由运行生成的输出映射或集合。                                                                     |
| **dataset\_id**     | UUID     | 示例所属的数据集。                                                                                |
| **source\_run\_id** | UUID     | 如果此示例是从 LangSmith [`Run`](/langsmith/run-data-format) 创建的，则为该运行的 ID。 |
| **metadata**        | object   | 一个额外的、由用户或 SDK 定义的信息映射，可以存储在示例上。                            |

要了解更多关于如何在评估中使用示例的信息，请阅读我们的操作指南：[评估 LLM 应用程序](/langsmith/evaluate-llm-application)。
