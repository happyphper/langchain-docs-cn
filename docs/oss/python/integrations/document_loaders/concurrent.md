---
title: 并发加载器
---
与 GenericLoader 功能相同，但支持并发处理，适合需要优化工作流的用户。

```python
from langchain_community.document_loaders import ConcurrentLoader
```

```python
loader = ConcurrentLoader.from_filesystem("example_data/", glob="**/*.txt")
```

```python
files = loader.load()
```

```python
len(files)
```

```text
2
```

```python

```
