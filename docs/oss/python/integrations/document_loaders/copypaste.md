---
title: 复制粘贴
---
本笔记本介绍了如何从您想要复制粘贴的内容中加载文档对象。在这种情况下，您甚至不需要使用 DocumentLoader，而是可以直接构造 Document。

```python
from langchain_core.documents import Document
```

```python
text = "..... put the text you copy pasted here......"
```

```python
doc = Document(page_content=text)
```

## 元数据

如果您想添加关于这段文本来源的元数据，可以通过 `metadata` 键轻松实现。

```python
metadata = {"source": "internet", "date": "Friday"}
```

```python
doc = Document(page_content=text, metadata=metadata)
```

```python

```
