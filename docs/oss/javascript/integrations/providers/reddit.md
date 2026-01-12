---
title: Reddit
---
>[Reddit](https://www.reddit.com) 是一个美国社交新闻聚合、内容评分和讨论网站。

## 安装与设置

首先，你需要安装一个 Python 包。

::: code-group

```bash [pip]
pip install praw
```

```bash [uv]
uv add praw
```

:::

创建一个 [Reddit 应用](https://www.reddit.com/prefs/apps/)，并使用你的 Reddit API 凭证来初始化加载器。

## 文档加载器

查看 [使用示例](/oss/javascript/integrations/document_loaders/reddit)。

```python
from langchain_community.document_loaders import RedditPostsLoader
```
