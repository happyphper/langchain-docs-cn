---
title: Shell (bash)
---
为智能体（agent）提供 Shell 访问权限非常强大（尽管在沙盒环境之外使用存在风险）。

LLM 可以使用它来执行任何 Shell 命令。一个常见的用例是让 LLM 与你的本地文件系统进行交互。

**注意：** Shell 工具在 Windows 操作系统上无法使用。

```python
pip install -qU langchain-community
```

```python
from langchain_community.tools import ShellTool

shell_tool = ShellTool()
```

```python
print(shell_tool.run({"commands": ["echo 'Hello World!'", "time"]}))
```

```text
Hello World!

real 0m0.000s
user 0m0.000s
sys 0m0.000s
```

```text
/Users/wfh/code/lc/lckg/langchain/tools/shell/tool.py:34: UserWarning: The shell tool has no safeguards by default. Use at your own risk.
  warnings.warn(
```

### 与智能体一起使用

与所有工具一样，这些工具可以交给智能体来完成更复杂的任务。让我们让智能体从一个网页中获取一些链接。

```python
from langchain.agents import create_agent

tools = [shell_tool]
agent = create_agent("gpt-4.1-mini", tools)

input_message = {
    "role": "user",
    "content": (
        "Download the README here and identify the link for LangChain tutorials: "
        "https://raw.githubusercontent.com/langchain-ai/langchain/master/README.md"
    ),
}

for step in agent.stream(
    {"messages": [input_message]},
        stream_mode="values",
):
    step["messages"][-1].pretty_print()
```

```text
================================ Human Message =================================

Download the README here and identify the link for LangChain tutorials: https://raw.githubusercontent.com/langchain-ai/langchain/master/README.md
================================== Ai Message ==================================
Tool Calls:
  terminal (call_mr86V0d6E9nQiJZT7Xw5fH0G)
 Call ID: call_mr86V0d6E9nQiJZT7Xw5fH0G
  Args:
    commands: ['curl -o README.md https://raw.githubusercontent.com/langchain-ai/langchain/master/README.md']
Executing command:
 ['curl -o README.md https://raw.githubusercontent.com/langchain-ai/langchain/master/README.md']
================================= Tool Message =================================
Name: terminal

  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  5169  100  5169    0     0   114k      0 --:--:-- --:--:-- --:--:--  114k
```

```text
/langchain/libs/community/langchain_community/tools/shell/tool.py:33: UserWarning: The shell tool has no safeguards by default. Use at your own risk.
  warnings.warn(
```

```text
================================== Ai Message ==================================
Tool Calls:
  terminal (call_LF8TGrgS84WvUvaazYnVfib8)
 Call ID: call_LF8TGrgS84WvUvaazYnVfib8
  Args:
    commands: ["grep -i 'tutorial' README.md"]
Executing command:
 ["grep -i 'tutorial' README.md"]
================================= Tool Message =================================
Name: terminal

- [Tutorials](https://python.langchain.com/docs/tutorials/): Simple walkthroughs with
```

```text
/langchain/libs/community/langchain_community/tools/shell/tool.py:33: UserWarning: The shell tool has no safeguards by default. Use at your own risk.
  warnings.warn(
```

```text
================================== Ai Message ==================================

The link for LangChain tutorials in the README is: https://python.langchain.com/docs/tutorials/
```

```python

```
