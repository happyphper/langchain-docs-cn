---
title: Airbyte JSON（已弃用）
---
注意：`AirbyteJSONLoader` 已弃用。请改用 [`AirbyteLoader`](/oss/integrations/document_loaders/airbyte)。

>[Airbyte](https://github.com/airbytehq/airbyte) 是一个数据集成平台，用于将来自 API、数据库和文件的 ELT 管道同步到数据仓库和数据湖。它拥有连接数据仓库和数据库的最大 ELT 连接器目录。

本文介绍如何将 Airbyte 中的任何数据源加载到本地 JSON 文件中，该文件可以作为文档读取。

前提条件：
已安装 Docker Desktop

步骤：

1) 从 GitHub 克隆 Airbyte - `git clone https://github.com/airbytehq/airbyte.git`

2) 切换到 Airbyte 目录 - `cd airbyte`

3) 启动 Airbyte - `docker compose up`

4) 在浏览器中访问 [localhost:8000](http://localhost:8000)。系统会要求输入用户名和密码。默认情况下，用户名为 `airbyte`，密码为 `password`。

5) 设置您希望的任何数据源。

6) 将目标设置为 Local JSON，并指定目标路径 - 例如 `/json_data`。设置手动同步。

7) 运行连接。

7) 要查看创建了哪些文件，可以导航到：`file:///tmp/airbyte_local`

8) 找到您的数据并复制路径。该路径应保存在下面的文件变量中。它应以 `/tmp/airbyte_local` 开头。

```python
from langchain_community.document_loaders import AirbyteJSONLoader
```

```python
!ls /tmp/airbyte_local/json_data/
```

```text
_airbyte_raw_pokemon.jsonl
```

```python
loader = AirbyteJSONLoader("/tmp/airbyte_local/json_data/_airbyte_raw_pokemon.jsonl")
```

```python
data = loader.load()
```

```python
print(data[0].page_content[:500])
```

```text
abilities:
ability:
name: blaze
url: https://pokeapi.co/api/v2/ability/66/

is_hidden: False
slot: 1

ability:
name: solar-power
url: https://pokeapi.co/api/v2/ability/94/

is_hidden: True
slot: 3

base_experience: 267
forms:
name: charizard
url: https://pokeapi.co/api/v2/pokemon-form/6/

game_indices:
game_index: 180
version:
name: red
url: https://pokeapi.co/api/v2/version/1/

game_index: 180
version:
name: blue
url: https://pokeapi.co/api/v2/version/2/

game_index: 180
version:
n
```

```python

```
