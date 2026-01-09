---
title: 并行提取
---
>[Parallel](https://platform.parallel.ai/) 是一个专为 LLM 和 AI 应用设计的实时网络搜索和内容提取平台。

`ParallelExtractTool` 提供了对 Parallel 提取 API 的访问，该 API 可以从网页中提取干净、结构化的内容。

## 概述

### 集成详情

| 类 | 包 | 可序列化 | JS 支持 | 包最新版本 |
| :--- | :--- | :---: | :---: | :---: |
| @[`ParallelExtractTool`] | @[`langchain-parallel`] | ❌ | ❌ | <a href="https://pypi.org/project/langchain-parallel/" target="_blank"><img src="https://img.shields.io/pypi/v/langchain-parallel?style=flat-square&label=%20&color=orange" alt="PyPI - Latest version" /></a> |

### 工具特性

- **干净内容提取**：从网页中提取主要内容，去除广告、导航和样板文本
- **Markdown 格式化**：以干净的 Markdown 格式返回内容
- **批量处理**：在单个 API 调用中从多个 URL 提取内容
- **元数据提取**：包含标题、发布日期和其他元数据
- **内容长度控制**：配置每次提取的最大字符数
- **错误处理**：优雅地处理提取失败，并提供详细的错误信息
- **异步支持**：完整的 async/await 支持以获得更好的性能

## 设置

该集成位于 `langchain-parallel` 包中。

```python
pip install -qU langchain-parallel
```
### 凭证

前往 [Parallel](https://platform.parallel.ai) 注册并生成 API 密钥。完成后，设置 `PARALLEL_API_KEY` 环境变量：

```python
import getpass
import os

if not os.environ.get("PARALLEL_API_KEY"):
    os.environ["PARALLEL_API_KEY"] = getpass.getpass("Parallel API key:\n")
```

## 实例化

这里我们展示如何实例化一个 `ParallelExtractTool`。该工具可以使用 API 密钥和内容长度参数进行配置：

```python
from langchain_parallel import ParallelExtractTool

# 基本实例化 - 从环境变量获取 API 密钥
tool = ParallelExtractTool()

# 使用显式 API 密钥和自定义设置
tool = ParallelExtractTool(
    api_key="your-api-key",
    base_url="https://api.parallel.ai",  # 默认值
    max_chars_per_extract=5000,  # 限制内容长度
)
```

## 调用

### 直接使用参数调用

您可以使用一个 URL 列表来调用该工具以提取内容：

```python
# 从单个 URL 提取
result = tool.invoke(
    {"urls": ["https://en.wikipedia.org/wiki/Artificial_intelligence"]}
)

print(f"Extracted {len(result)} result(s)")
print(f"Title: {result[0]['title']}")
print(f"URL: {result[0]['url']}")
print(f"Content length: {len(result[0]['content'])} characters")
print(f"Content preview: {result[0]['content'][:200]}...")
```

```python
# 从多个 URL 提取
result = tool.invoke(
    {
        "urls": [
            "https://en.wikipedia.org/wiki/Machine_learning",
            "https://en.wikipedia.org/wiki/Deep_learning",
            "https://en.wikipedia.org/wiki/Natural_language_processing",
        ]
    }
)

print(f"Extracted {len(result)} results")
for i, item in enumerate(result, 1):
    print(f"\n{i}. {item['title']}")
    print(f"   URL: {item['url']}")
    print(f"   Content length: {len(item['content'])} characters")

# 响应结构示例：
# [
#     {
#         "url": "https://example.com/article",
#         "title": "Article Title",
#         "content": "# Article Title\n\nMain content in markdown...",
#         "publish_date": "2024-01-15"  # Optional
#     }
# ]
```

### 使用 `ToolCall` 调用

我们也可以使用模型生成的 `ToolCall` 来调用该工具，在这种情况下将返回一个 `ToolMessage`：

```python
# 这通常由模型生成，但为了演示目的，我们将直接创建一个工具调用。
model_generated_tool_call = {
    "args": {
        "urls": [
            "https://en.wikipedia.org/wiki/Climate_change",
            "https://en.wikipedia.org/wiki/Renewable_energy",
        ]
    },
    "id": "call_123",
    "name": tool.name,  # "parallel_extract"
    "type": "tool_call",
}

result = tool.invoke(model_generated_tool_call)
print(result)
print(f"Tool name: {tool.name}")  # parallel_extract
print(f"Tool description: {tool.description}")
```

### 异步使用

该工具支持完整的 async/await 操作，以便在异步应用中获得更好的性能：

```python
async def extract_async():
    return await tool.ainvoke(
        {
            "urls": [
                "https://en.wikipedia.org/wiki/Python_(programming_language)",
                "https://en.wikipedia.org/wiki/JavaScript",
            ]
        }
    )

# 运行异步提取
result = await extract_async()
print(f"Extracted {len(result)} results asynchronously")
```

### 高级功能

提取工具支持带有搜索目标/查询的聚焦提取、获取策略以及对摘录和完整内容的细粒度控制：

```python
# 使用搜索目标提取聚焦摘录
result = tool.invoke(
    {
        "urls": ["https://en.wikipedia.org/wiki/Artificial_intelligence"],
        "search_objective": "What are the main applications and ethical concerns of AI?",
        "excerpts": {"max_chars_per_result": 2000},
        "full_content": False,
    }
)

print(f"Extracted focused excerpts: {len(result[0].get('excerpts', []))} excerpts")
print(f"Content preview: {result[0]['content'][:200]}...")

# 使用获取策略提取新鲜内容
result = tool.invoke(
    {
        "urls": ["https://en.wikipedia.org/wiki/Quantum_computing"],
        "fetch_policy": {
            "max_age_seconds": 86400,  # 1 天缓存
            "timeout_seconds": 60,
            "disable_cache_fallback": False,
        },
        "full_content": {"max_chars_per_result": 5000},
    }
)

print(f"Content length: {len(result[0]['content'])} characters")
```

### 错误处理

该工具优雅地处理提取失败的 URL，在结果中包含错误信息：

```python
# 混合有效和无效的 URL
result = tool.invoke(
    {
        "urls": [
            "https://en.wikipedia.org/wiki/Artificial_intelligence",
            "https://this-domain-does-not-exist-12345.com/",
        ]
    }
)

for item in result:
    if "error_type" in item:
        print(f"Failed: {item['url']}")
        print(f"Error: {item['content']}")
    else:
        print(f"Success: {item['url']}")
        print(f"Extracted {len(item['content'])} characters")
```

## 最佳实践

- **批量处理 URL**：在单个调用中提取多个 URL 以获得更好的性能
- **设置内容限制**：使用 `max_chars_per_extract` 来控制响应大小和令牌使用量
- **处理错误**：检查结果中的 `error_type` 以识别失败的提取
- **使用异步提升性能**：在异步应用中使用 `ainvoke()` 以获得更好的性能
- **元数据字段**：在可用时使用 `publish_date` 和其他元数据作为上下文

## 响应格式

该工具返回一个字典列表，格式如下：

```python
[
    {
        "url": "https://example.com/article",
        "title": "Article Title",
        "content": "# Article Title\n\nMain content formatted as markdown...",
        "publish_date": "2024-01-15"  # Optional, if available
    },
    # 对于失败的提取：
    {
        "url": "https://failed-site.com",
        "title": None,
        "content": "Error: 404 Not Found",
        "error_type": "http_error"
    }
]
```

## API 参考

有关所有功能和配置选项的详细文档，请前往 @[`ParallelExtractTool`] API 参考或 [Parallel 提取参考](https://docs.parallel.ai/api-reference/extract-beta/extract)。
