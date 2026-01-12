---
title: Perigon
---
>[Perigon](https://perigon.io/) 是一个全面的新闻 API，提供来自全球数千个来源的新闻文章、报道、元数据和维基百科页面的实时上下文信息访问。

## 安装与设置

`Perigon` 集成存在于其独立的[合作伙伴包](https://pypi.org/project/langchain-perigon/)中。您可以通过以下命令安装：

```python
pip install -qU langchain-perigon
```

为了使用该包，您还需要将 `PERIGON_API_KEY` 环境变量设置为您 Perigon API 密钥。

## 检索器

Perigon 提供两种检索器：

### ArticlesRetriever

此检索器根据给定的查询和可选过滤器检索文章。

查看[完整使用示例](/oss/python/integrations/retrievers/perigon#using-articlesretriever)。

```python
# 确保 PERIGON_API_KEY 环境变量已设置为您的 Perigon API 密钥
from langchain_perigon import ArticlesRetriever, ArticlesFilter

# 创建指定结果数量的检索器
retriever = ArticlesRetriever(k=12)

# 配置过滤器选项以排除转载文章并专注于美国文章
options: ArticlesFilter = {
    "showReprints": False,  # 排除重复/转载文章
    "filter": {"country": "us"},  # 仅限美国新闻
}

try:
    documents = retriever.invoke("Recent big tech layoffs", options=options)

    # 在访问前检查是否获得了结果
    if documents:
        print(f"First document: {documents[0].page_content[:200]}...")
    else:
        print("No articles found for the given query.")
except Exception as e:
    print(f"Error retrieving articles: {e}")
```

您可以在标准检索管道中使用 `ArticlesRetriever`：

### WikipediaRetriever

此检索器根据给定的查询和可选过滤器检索维基百科页面。

查看[完整使用示例](/oss/python/integrations/retrievers/perigon#using-wikipediaretriever)。

```python
# 确保 PERIGON_API_KEY 环境变量已设置为您的 Perigon API 密钥
from langchain_perigon import WikipediaRetriever

# 创建指定结果数量的检索器
retriever = WikipediaRetriever(k=12)

try:
    documents = retriever.invoke("machine learning")

    # 使用错误处理安全地访问结果
    if documents:
        print(f"First document: {documents[0].page_content[:200]}...")
    else:
        print("No Wikipedia articles found for the given query.")
except Exception as e:
    print(f"Error retrieving Wikipedia articles: {e}")
```

您可以在标准检索管道中使用 `WikipediaRetriever`：
