---
title: Kinetica
---
本笔记本将介绍如何从 Kinetica 加载文档。

```python
pip install gpudb==7.2.0.9
```

```python
from langchain_community.document_loaders.kinetica_loader import KineticaLoader
```

```python
## 加载环境变量
import os

from dotenv import load_dotenv
from langchain_community.vectorstores import (
    KineticaSettings,
)

load_dotenv()
```

```python
# Kinetica 需要连接到数据库。
# 以下是设置方法。
HOST = os.getenv("KINETICA_HOST", "http://127.0.0.1:9191")
USERNAME = os.getenv("KINETICA_USERNAME", "")
PASSWORD = os.getenv("KINETICA_PASSWORD", "")

def create_config() -> KineticaSettings:
    return KineticaSettings(host=HOST, username=USERNAME, password=PASSWORD)
```

```python
from langchain_community.document_loaders.kinetica_loader import KineticaLoader

# 下面的 `QUERY` 是一个不会运行的示例；
# 需要替换为一个有效的 `QUERY`，该查询能返回数据，
# 并且 `SCHEMA.TABLE` 组合必须在 Kinetica 中存在。

QUERY = "select text, survey_id from SCHEMA.TABLE limit 10"
kinetica_loader = KineticaLoader(
    QUERY,
    HOST,
    USERNAME,
    PASSWORD,
)
kinetica_documents = kinetica_loader.load()
print(kinetica_documents)
```

```python
from langchain_community.document_loaders.kinetica_loader import KineticaLoader

# 下面的 `QUERY` 是一个不会运行的示例；
# 需要替换为一个有效的 `QUERY`，该查询能返回数据，
# 并且 `SCHEMA.TABLE` 组合必须在 Kinetica 中存在。

QUERY = "select text, survey_id as source from SCHEMA.TABLE limit 10"
kl = KineticaLoader(
    query=QUERY,
    host=HOST,
    username=USERNAME,
    password=PASSWORD,
    metadata_columns=["source"],
)
kinetica_documents = kl.load()
print(kinetica_documents)
```
