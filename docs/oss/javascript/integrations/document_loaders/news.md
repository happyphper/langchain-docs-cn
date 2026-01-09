---
title: 新闻网址
---
本文介绍了如何从一组 URL 中加载 HTML 新闻文章，并将其转换为可供下游使用的文档格式。

```python
from langchain_community.document_loaders import NewsURLLoader
```

```python
urls = [
    "https://www.bbc.com/news/world-us-canada-66388172",
    "https://www.bbc.com/news/entertainment-arts-66384971",
]
```

传入 URL 列表以将其加载为 Document 对象

```python
loader = NewsURLLoader(urls=urls)
data = loader.load()
print("First article: ", data[0])
print("\nSecond article: ", data[1])
```

```text
First article:  page_content='In testimony to the congressional committee examining the 6 January riot, Mrs Powell said she did not review all of the many claims of election fraud she made, telling them that "no reasonable person" would view her claims as fact. Neither she nor her representatives have commented.' metadata={'title': 'Donald Trump indictment: What do we know about the six co-conspirators?', 'link': 'https://www.bbc.com/news/world-us-canada-66388172', 'authors': [], 'language': 'en', 'description': 'Six people accused of helping Mr Trump undermine the election have been described by prosecutors.', 'publish_date': None}

Second article:  page_content='Ms Williams added: "If there\'s anything that I can do in my power to ensure that dancers or singers or whoever decides to work with her don\'t have to go through that same experience, I\'m going to do that."' metadata={'title': "Lizzo dancers Arianna Davis and Crystal Williams: 'No one speaks out, they are scared'", 'link': 'https://www.bbc.com/news/entertainment-arts-66384971', 'authors': [], 'language': 'en', 'description': 'The US pop star is being sued for sexual harassment and fat-shaming but has yet to comment.', 'publish_date': None}
```

使用 `nlp=True` 参数来运行 NLP 分析并生成关键词和摘要

```python
loader = NewsURLLoader(urls=urls, nlp=True)
data = loader.load()
print("First article: ", data[0])
print("\nSecond article: ", data[1])
```

```text
First article:  page_content='In testimony to the congressional committee examining the 6 January riot, Mrs Powell said she did not review all of the many claims of election fraud she made, telling them that "no reasonable person" would view her claims as fact. Neither she nor her representatives have commented.' metadata={'title': 'Donald Trump indictment: What do we know about the six co-conspirators?', 'link': 'https://www.bbc.com/news/world-us-canada-66388172', 'authors': [], 'language': 'en', 'description': 'Six people accused of helping Mr Trump undermine the election have been described by prosecutors.', 'publish_date': None, 'keywords': ['powell', 'know', 'donald', 'trump', 'review', 'indictment', 'telling', 'view', 'reasonable', 'person', 'testimony', 'coconspirators', 'riot', 'representatives', 'claims'], 'summary': 'In testimony to the congressional committee examining the 6 January riot, Mrs Powell said she did not review all of the many claims of election fraud she made, telling them that "no reasonable person" would view her claims as fact.\nNeither she nor her representatives have commented.'}

Second article:  page_content='Ms Williams added: "If there\'s anything that I can do in my power to ensure that dancers or singers or whoever decides to work with her don\'t have to go through that same experience, I\'m going to do that."' metadata={'title': "Lizzo dancers Arianna Davis and Crystal Williams: 'No one speaks out, they are scared'", 'link': 'https://www.bbc.com/news/entertainment-arts-66384971', 'authors': [], 'language': 'en', 'description': 'The US pop star is being sued for sexual harassment and fat-shaming but has yet to comment.', 'publish_date': None, 'keywords': ['davis', 'lizzo', 'singers', 'experience', 'crystal', 'ensure', 'arianna', 'theres', 'williams', 'power', 'going', 'dancers', 'im', 'speaks', 'work', 'ms', 'scared'], 'summary': 'Ms Williams added: "If there\'s anything that I can do in my power to ensure that dancers or singers or whoever decides to work with her don\'t have to go through that same experience, I\'m going to do that."'}
```

```python
data[0].metadata["keywords"]
```

```python
['powell',
 'know',
 'donald',
 'trump',
 'review',
 'indictment',
 'telling',
 'view',
 'reasonable',
 'person',
 'testimony',
 'coconspirators',
 'riot',
 'representatives',
 'claims']
```

```python
data[0].metadata["summary"]
```

```text
'In testimony to the congressional committee examining the 6 January riot, Mrs Powell said she did not review all of the many claims of election fraud she made, telling them that "no reasonable person" would view her claims as fact.\nNeither she nor her representatives have commented.'
```
