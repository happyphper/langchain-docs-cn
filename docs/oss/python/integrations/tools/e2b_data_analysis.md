---
title: E2B 数据分析
---
[E2B 的云环境](https://e2b.dev) 是 LLM 的绝佳运行时沙箱。

E2B 的数据分析沙箱允许在沙箱环境中安全地执行代码。这对于构建代码解释器或类似 ChatGPT 中的高级数据分析等工具来说是理想选择。

E2B 数据分析沙箱允许您：

- 运行 Python 代码
- 通过 matplotlib 生成图表
- 在运行时动态安装 Python 包
- 在运行时动态安装系统包
- 运行 shell 命令
- 上传和下载文件

我们将创建一个简单的 OpenAI 智能体，它将使用 E2B 的数据分析沙箱，通过 Python 对上传的文件进行分析。

获取您的 OpenAI API 密钥和 [E2B API 密钥](https://e2b.dev/docs/getting-started/api-key)，并将它们设置为环境变量。

您可以在[此处](https://e2b.dev/docs)找到完整的 API 文档。

您需要安装 `e2b` 来开始：

```python
pip install -qU  langchain e2b langchain-community
```

```python
from langchain_community.tools import E2BDataAnalysisTool
```

```python
import os

from langchain.agents import AgentType, initialize_agent
from langchain_openai import ChatOpenAI

os.environ["E2B_API_KEY"] = "<E2B_API_KEY>"
os.environ["OPENAI_API_KEY"] = "<OPENAI_API_KEY>"
```

创建 `E2BDataAnalysisTool` 实例时，您可以传递回调函数来监听沙箱的输出。例如，这在创建响应更快的 UI 时非常有用，特别是与 LLM 的流式输出结合使用时。

```python
# 工件（Artifacts）是调用 `plt.show()` 时由 matplotlib 创建的图表
def save_artifact(artifact):
    print("New matplotlib chart generated:", artifact.name)
    # 将工件下载为 `bytes` 类型，并交由用户（例如在前端）决定如何显示它们
    file = artifact.download()
    basename = os.path.basename(artifact.name)

    # 将图表保存到 `charts` 目录
    with open(f"./charts/{basename}", "wb") as f:
        f.write(file)

e2b_data_analysis_tool = E2BDataAnalysisTool(
    # 将环境变量传递给沙箱
    env_vars={"MY_SECRET": "secret_value"},
    on_stdout=lambda stdout: print("stdout:", stdout),
    on_stderr=lambda stderr: print("stderr:", stderr),
    on_artifact=save_artifact,
)
```

将一个示例 CSV 数据文件上传到沙箱，以便我们的智能体可以对其进行分析。例如，您可以使用[这个关于 Netflix 电视节目的文件](https://storage.googleapis.com/e2b-examples/netflix.csv)。

```python
with open("./netflix.csv") as f:
    remote_path = e2b_data_analysis_tool.upload_file(
        file=f,
        description="Data about Netflix tv shows including their title, category, director, release date, casting, age rating, etc.",
    )
    print(remote_path)
```

```text
name='netflix.csv' remote_path='/home/user/netflix.csv' description='Data about Netflix tv shows including their title, category, director, release date, casting, age rating, etc.'
```

创建一个 `Tool` 对象并初始化 LangChain 智能体。

```python
tools = [e2b_data_analysis_tool.as_tool()]

llm = ChatOpenAI(model="gpt-4", temperature=0)
agent = initialize_agent(
    tools,
    llm,
    agent=AgentType.OPENAI_FUNCTIONS,
    verbose=True,
    handle_parsing_errors=True,
)
```

现在我们可以向智能体询问关于我们之前上传的 CSV 文件的问题。

```python
agent.run(
    "What are the 5 longest movies on netflix released between 2000 and 2010? Create a chart with their lengths."
)
```

```text
> Entering new AgentExecutor chain...

Invoking: `e2b_data_analysis` with `{'python_code': "import pandas as pd\n\n# Load the data\nnetflix_data = pd.read_csv('/home/user/netflix.csv')\n\n# Convert the 'release_year' column to integer\nnetflix_data['release_year'] = netflix_data['release_year'].astype(int)\n\n# Filter the data for movies released between 2000 and 2010\nfiltered_data = netflix_data[(netflix_data['release_year'] >= 2000) & (netflix_data['release_year'] <= 2010) & (netflix_data['type'] == 'Movie')]\n\n# Remove rows where 'duration' is not available\nfiltered_data = filtered_data[filtered_data['duration'].notna()]\n\n# Convert the 'duration' column to integer\nfiltered_data['duration'] = filtered_data['duration'].str.replace(' min','').astype(int)\n\n# Get the top 5 longest movies\nlongest_movies = filtered_data.nlargest(5, 'duration')\n\n# Create a bar chart\nimport matplotlib.pyplot as plt\n\nplt.figure(figsize=(10,5))\nplt.barh(longest_movies['title'], longest_movies['duration'], color='skyblue')\nplt.xlabel('Duration (minutes)')\nplt.title('Top 5 Longest Movies on Netflix (2000-2010)')\nplt.gca().invert_yaxis()\nplt.savefig('/home/user/longest_movies.png')\n\nlongest_movies[['title', 'duration']]"}`

stdout:                              title  duration
stdout: 1019                        Lagaan       224
stdout: 4573                  Jodhaa Akbar       214
stdout: 2731      Kabhi Khushi Kabhie Gham       209
stdout: 2632  No Direction Home: Bob Dylan       208
stdout: 2126          What's Your Raashee?       203
{'stdout': "                             title  duration\n1019                        Lagaan       224\n4573                  Jodhaa Akbar       214\n2731      Kabhi Khushi Kabhie Gham       209\n2632  No Direction Home: Bob Dylan       208\n2126          What's Your Raashee?       203", 'stderr': ''}The 5 longest movies on Netflix released between 2000 and 2010 are:

1. Lagaan - 224 minutes
2. Jodhaa Akbar - 214 minutes
3. Kabhi Khushi Kabhie Gham - 209 minutes
4. No Direction Home: Bob Dylan - 208 minutes
5. What's Your Raashee? - 203 minutes

Here is the chart showing their lengths:

![Longest Movies](sandbox:/home/user/longest_movies.png)

> Finished chain.
```

```text
"The 5 longest movies on Netflix released between 2000 and 2010 are:\n\n1. Lagaan - 224 minutes\n2. Jodhaa Akbar - 214 minutes\n3. Kabhi Khushi Kabhie Gham - 209 minutes\n4. No Direction Home: Bob Dylan - 208 minutes\n5. What's Your Raashee? - 203 minutes\n\nHere is the chart showing their lengths:\n\n![Longest Movies](sandbox:/home/user/longest_movies.png)"
```

E2B 还允许您在运行时动态安装 Python 和系统（通过 `apt`）包，如下所示：

```python
# 安装 Python 包
e2b_data_analysis_tool.install_python_packages("pandas")
```

```text
stdout: Requirement already satisfied: pandas in /usr/local/lib/python3.10/dist-packages (2.1.1)
stdout: Requirement already satisfied: python-dateutil>=2.8.2 in /usr/local/lib/python3.10/dist-packages (from pandas) (2.8.2)
stdout: Requirement already satisfied: pytz>=2020.1 in /usr/local/lib/python3.10/dist-packages (from pandas) (2023.3.post1)
stdout: Requirement already satisfied: numpy>=1.22.4 in /usr/local/lib/python3.10/dist-packages (from pandas) (1.26.1)
stdout: Requirement already satisfied: tzdata>=2022.1 in /usr/local/lib/python3.10/dist-packages (from pandas) (2023.3)
stdout: Requirement already satisfied: six>=1.5 in /usr/local/lib/python3.10/dist-packages (from python-dateutil>=2.8.2->pandas) (1.16.0)
```

此外，您可以像这样从沙箱下载任何文件：

```python
# 路径是沙箱中的远程路径
files_in_bytes = e2b_data_analysis_tool.download_file("/home/user/netflix.csv")
```

最后，您可以通过 `run_command` 在沙箱内运行任何 shell 命令。

```python
# 安装 SQLite
e2b_data_analysis_tool.run_command("sudo apt update")
e2b_data_analysis_tool.install_system_packages("sqlite3")

# 检查 SQLite 版本
output = e2b_data_analysis_tool.run_command("sqlite3 --version")
print("version: ", output["stdout"])
print("error: ", output["stderr"])
print("exit code: ", output["exit_code"])
```

```text
stderr:
stderr: WARNING: apt does not have a stable CLI interface. Use with caution in scripts.
stderr:
stdout: Hit:1 http://security.ubuntu.com/ubuntu jammy-security InRelease
stdout: Hit:2 http://archive.ubuntu.com/ubuntu jammy InRelease
stdout: Hit:3 http://archive.ubuntu.com/ubuntu jammy-updates InRelease
stdout: Hit:4 http://archive.ubuntu.com/ubuntu jammy-backports InRelease
stdout: Reading package lists...
stdout: Building dependency tree...
stdout: Reading state information...
stdout: All packages are up to date.
stdout: Reading package lists...
stdout: Building dependency tree...
stdout: Reading state information...
stdout: Suggested packages:
stdout:   sqlite3-doc
stdout: The following NEW packages will be installed:
stdout:   sqlite3
stdout: 0 upgraded, 1 newly installed, 0 to remove and 0 not upgraded.
stdout: Need to get 768 kB of archives.
stdout: After this operation, 1873 kB of additional disk space will be used.
stdout: Get:1 http://archive.ubuntu.com/ubuntu jammy-updates/main amd64 sqlite3 amd64 3.37.2-2ubuntu0.1 [768 kB]
stderr: debconf: delaying package configuration, since apt-utils is not installed
stdout: Fetched 768 kB in 0s (2258 kB/s)
stdout: Selecting previously unselected package sqlite3.
(Reading database ... 23999 files and directories currently installed.)
stdout: Preparing to unpack .../sqlite3_3.37.2-2ubuntu0.1_amd64.deb ...
stdout: Unpacking sqlite3 (3.37.2-2ubuntu0.1) ...
stdout: Setting up sqlite3 (3.37.2-2ubuntu0.1) ...
stdout: 3.37.2 2022-01-06 13:25:41 872ba256cbf61d9290b571c0e6d82a20c224ca3ad82971edc46b29818d5dalt1
version:  3.37.2 2022-01-06 13:25:41 872ba256cbf61d9290b571c0e6d82a20c224ca3ad82971edc46b29818d5dalt1
error:
exit code:  0
```

当您的智能体完成任务后，别忘了关闭沙箱。

```python
e2b_data_analysis_tool.close()
```
