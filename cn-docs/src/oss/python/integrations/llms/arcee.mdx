---
title: Arcee
---
本笔记本演示了如何使用 `Arcee` 类，借助 Arcee 的领域自适应语言模型（DALMs）生成文本。

```python
## 安装使用该集成所需的 langchain 包
pip install -qU langchain-community
```

### 设置

在使用 Arcee 之前，请确保已将 Arcee API 密钥设置为 `ARCEE_API_KEY` 环境变量。您也可以将 API 密钥作为命名参数传递。

```python
from langchain_community.llms import Arcee

# 创建 Arcee 类的实例
arcee = Arcee(
    model="DALM-PubMed",
    # arcee_api_key="ARCEE-API-KEY" # 如果尚未在环境中设置
)
```

### 附加配置

您还可以根据需要配置 Arcee 的参数，例如 `arcee_api_url`、`arcee_app_url` 和 `model_kwargs`。
在对象初始化时设置 `model_kwargs` 会将这些参数作为后续所有生成响应的默认值。

```python
arcee = Arcee(
    model="DALM-Patent",
    # arcee_api_key="ARCEE-API-KEY", # 如果尚未在环境中设置
    arcee_api_url="https://custom-api.arcee.ai",  # 默认为 https://api.arcee.ai
    arcee_app_url="https://custom-app.arcee.ai",  # 默认为 https://app.arcee.ai
    model_kwargs={
        "size": 5,
        "filters": [
            {
                "field_name": "document",
                "filter_type": "fuzzy_search",
                "value": "Einstein",
            }
        ],
    },
)
```

### 生成文本

您可以通过提供提示词（prompt）从 Arcee 生成文本。示例如下：

```python
# 生成文本
prompt = "Can AI-driven music therapy contribute to the rehabilitation of patients with disorders of consciousness?"
response = arcee(prompt)
```

### 附加参数

Arcee 允许您应用 `filters` 并设置检索文档的 `size`（数量）以辅助文本生成。过滤器有助于缩小结果范围。以下是使用这些参数的方法：

```python
# 定义过滤器
filters = [
    {"field_name": "document", "filter_type": "fuzzy_search", "value": "Einstein"},
    {"field_name": "year", "filter_type": "strict_search", "value": "1905"},
]

# 使用过滤器和 size 参数生成文本
response = arcee(prompt, size=5, filters=filters)
```
