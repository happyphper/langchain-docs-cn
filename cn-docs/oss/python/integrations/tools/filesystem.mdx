---
title: 文件系统
---
LangChain 提供了开箱即用的本地文件系统交互工具。本笔记本将介绍其中一些工具。

**注意：** 不建议在沙盒环境之外使用这些工具！

```python
pip install -qU langchain-community
```

首先，我们将导入这些工具。

```python
from tempfile import TemporaryDirectory

from langchain_community.agent_toolkits import FileManagementToolkit

# 我们将创建一个临时目录以避免混乱
working_directory = TemporaryDirectory()
```

## FileManagementToolkit

如果你想为你的智能体（agent）提供所有文件操作工具，使用工具包（toolkit）可以轻松实现。我们将把临时目录作为根目录（root directory）传递给 LLM，作为其工作空间。

建议始终传入一个根目录，因为如果不这样做，LLM 很容易污染工作目录，并且无法对直接的提示注入（prompt injection）进行任何验证。

```python
toolkit = FileManagementToolkit(
    root_dir=str(working_directory.name)
)  # 如果不提供 root_dir，操作将默认在当前工作目录进行
toolkit.get_tools()
```

```text
[CopyFileTool(root_dir='/tmp/tmprdvsw3tg'),
 DeleteFileTool(root_dir='/tmp/tmprdvsw3tg'),
 FileSearchTool(root_dir='/tmp/tmprdvsw3tg'),
 MoveFileTool(root_dir='/tmp/tmprdvsw3tg'),
 ReadFileTool(root_dir='/tmp/tmprdvsw3tg'),
 WriteFileTool(root_dir='/tmp/tmprdvsw3tg'),
 ListDirectoryTool(root_dir='/tmp/tmprdvsw3tg')]
```

### 选择文件系统工具

如果你只想选择特定的工具，可以在初始化工具包时将它们作为参数传入，或者单独初始化所需的工具。

```python
tools = FileManagementToolkit(
    root_dir=str(working_directory.name),
    selected_tools=["read_file", "write_file", "list_directory"],
).get_tools()
tools
```

```text
[ReadFileTool(root_dir='/tmp/tmprdvsw3tg'),
 WriteFileTool(root_dir='/tmp/tmprdvsw3tg'),
 ListDirectoryTool(root_dir='/tmp/tmprdvsw3tg')]
```

```python
read_tool, write_tool, list_tool = tools
write_tool.invoke({"file_path": "example.txt", "text": "Hello World!"})
```

```text
'File written successfully to example.txt.'
```

```python
# 列出工作目录中的文件
list_tool.invoke({})
```

```text
'example.txt'
```

```python

```
