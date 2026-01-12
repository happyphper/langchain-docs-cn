---
title: Bodo DataFrames
---
[Bodo DataFrames](https://github.com/bodo-ai/Bodo) 是一个用于大规模 Python 数据处理的高性能 DataFrame 库，可作为 Pandas 的直接替代品；只需将：

```python
import pandas as pd
```

替换为：

```python
import bodo.pandas as pd
```

即可自动扩展和加速 Pandas 工作负载。
由于 Bodo DataFrames 与 Pandas 兼容，它是 LLM 代码生成的理想目标，易于验证、高效，并且能够超越 Pandas 的典型限制进行扩展。

我们的集成包提供了一个工具包，用于向智能体询问关于大型数据集的问题，并利用 Bodo DataFrames 实现高效性和可扩展性。

在底层，Bodo DataFrames 使用惰性求值来优化 Pandas 操作序列，通过操作符流式传输数据以处理大于内存的数据集，并利用基于 MPI 的高性能计算技术实现高效的并行执行，可以轻松地从笔记本电脑扩展到大型集群。

## 安装与设置

```bash [pip]
pip install -U langchain_bodo
```

## 工具包

[langchain-bodo 包](https://pypi.org/project/langchain-bodo/) 提供了创建智能体的功能，这些智能体可以使用 Bodo DataFrames 回答关于大型数据集的问题。
有关更详细的使用示例，请参阅 [Bodo DataFrames 工具页面](/oss/python/integrations/tools/bodo)。

**注意：此功能在底层使用了 `Python` 智能体，它会执行 LLM 生成的 Python 代码——如果 LLM 生成的 Python 代码有害，这可能很危险。请谨慎使用。**

```python
from langchain_bodo import create_bodo_dataframes_agent
```

### 使用示例

在运行以下代码之前，请复制 [泰坦尼克号数据集](https://raw.githubusercontent.com/pandas-dev/pandas/main/doc/data/titanic.csv) 并本地保存为 `titanic.csv`。

```python
import bodo.pandas as pd
from langchain_openai import OpenAI

df = pd.read_csv("titanic.csv")
agent = create_bodo_dataframes_agent(
    OpenAI(temperature=0), df, verbose=True, allow_dangerous_code=True
)
```

```python
agent.invoke("how many rows are there?")
```

```text
> 进入新的 AgentExecutor 链...
思考：我可以使用 len() 函数来获取数据框的行数。
动作：python_repl_ast
动作输入：len(df)891891 是数据框中的行数。
最终答案：891

> 链结束。
```

```python
{'input': 'how many rows are there?', 'output': '891'}
```
