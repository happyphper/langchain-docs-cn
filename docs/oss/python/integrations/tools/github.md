---
title: GitHub 工具包
---
`GitHub` 工具包包含一系列工具，使 LLM 智能体能够与 GitHub 仓库进行交互。
该工具是对 [PyGitHub](https://github.com/PyGithub/PyGithub) 库的封装。

有关所有 GithubToolkit 功能和配置的详细文档，请参阅 [API 参考](https://python.langchain.com/api_reference/community/agent_toolkits/langchain_community.agent_toolkits.github.toolkit.GitHubToolkit.html)。

## 设置

从高层次来看，我们需要：

1.  安装 pygithub 库
2.  创建一个 GitHub 应用
3.  设置环境变量
4.  通过 `toolkit.get_tools()` 将工具传递给您的智能体

要启用对单个工具的自动化追踪，请设置您的 [LangSmith](https://docs.langchain.com/langsmith/home) API 密钥：

```python
os.environ["LANGSMITH_API_KEY"] = getpass.getpass("Enter your LangSmith API key: ")
os.environ["LANGSMITH_TRACING"] = "true"
```

### 安装

#### 1. 安装依赖项

此集成在 `langchain-community` 中实现。我们还需要 `pygithub` 依赖项：

```python
pip install -qU  pygithub langchain-community
```

#### 2. 创建 GitHub 应用

[按照此处的说明](https://docs.github.com/en/apps/creating-github-apps/registering-a-github-app/registering-a-github-app) 创建并注册一个 GitHub 应用。确保您的应用拥有以下 [仓库权限：](https://docs.github.com/en/rest/overview/permissions-required-for-github-apps?apiVersion=2022-11-28)

*   提交状态（只读）
*   内容（读写）
*   议题（读写）
*   元数据（只读）
*   拉取请求（读写）

应用注册后，您必须授予您的应用访问您希望其操作的每个仓库的权限。请在 [github.com 的应用设置页面](https://github.com/settings/installations) 进行设置。

#### 3. 设置环境变量

在初始化您的智能体之前，需要设置以下环境变量：

*   **GITHUB_APP_ID** - 在您应用的常规设置中找到的一个六位数字。
*   **GITHUB_APP_PRIVATE_KEY** - 您应用的私钥 .pem 文件的位置，或该文件的完整文本字符串。
*   **GITHUB_REPOSITORY** - 您希望机器人操作的 GitHub 仓库名称。必须遵循格式 \{用户名\}/\{仓库名\}。*请确保应用已首先添加到此仓库！*
*   可选：**GITHUB_BRANCH** - 机器人将进行提交的分支。默认为 `repo.default_branch`。
*   可选：**GITHUB_BASE_BRANCH** - 您仓库的基础分支，拉取请求将基于此分支创建。默认为 `repo.default_branch`。

```python
import getpass
import os

for env_var in [
    "GITHUB_APP_ID",
    "GITHUB_APP_PRIVATE_KEY",
    "GITHUB_REPOSITORY",
]:
    if not os.getenv(env_var):
        os.environ[env_var] = getpass.getpass()
```

## 实例化

现在我们可以实例化我们的工具包：

```python
from langchain_community.agent_toolkits.github.toolkit import GitHubToolkit
from langchain_community.utilities.github import GitHubAPIWrapper

github = GitHubAPIWrapper()
toolkit = GitHubToolkit.from_github_api_wrapper(github)
```

## 工具

查看可用工具：

```python
tools = toolkit.get_tools()

for tool in tools:
    print(tool.name)
```

```text
Get Issues
Get Issue
Comment on Issue
List open pull requests (PRs)
Get Pull Request
Overview of files included in PR
Create Pull Request
List Pull Requests' Files
Create File
Read File
Update File
Delete File
Overview of existing files in Main branch
Overview of files in current working branch
List branches in this repository
Set active branch
Create a new branch
Get files from a directory
Search issues and pull requests
Search code
Create review request
```

这些工具的用途如下：

以下将详细解释每个步骤。

1.  **Get Issues** - 从仓库获取议题。
2.  **Get Issue** - 获取特定议题的详细信息。
3.  **Comment on Issue** - 在特定议题上发表评论。
4.  **Create Pull Request** - 从机器人的工作分支到基础分支创建拉取请求。
5.  **Create File** - 在仓库中创建新文件。
6.  **Read File** - 从仓库读取文件。
7.  **Update File** - 更新仓库中的文件。
8.  **Delete File** - 从仓库删除文件。

## 包含发布工具

默认情况下，工具包不包含与发布相关的工具。您可以在初始化工具包时通过设置 `include_release_tools=True` 来包含它们：

```python
toolkit = GitHubToolkit.from_github_api_wrapper(github, include_release_tools=True)
```

设置 `include_release_tools=True` 将包含以下工具：

*   **Get Latest Release** - 从仓库获取最新发布。
*   **Get Releases** - 从仓库获取最新的 5 个发布。
*   **Get Release** - 通过标签名称（例如 `v1.0.0`）从仓库获取特定发布。

## 在智能体中使用

我们需要一个 LLM 或聊天模型：

<ChatModelTabs customVarName="llm" />

```python
# | output: false
# | echo: false

from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
```

使用工具子集初始化智能体：

```python
from langchain.agents import create_agent

tools = [tool for tool in toolkit.get_tools() if tool.name == "Get Issue"]
assert len(tools) == 1
tools[0].name = "get_issue"

agent_executor = create_agent(llm, tools)
```

并向其发出查询：

```python
example_query = "What is the title of issue 24888?"

events = agent_executor.stream(
    {"messages": [("user", example_query)]},
    stream_mode="values",
)
for event in events:
    event["messages"][-1].pretty_print()
```

```text
================================ Human Message =================================

What is the title of issue 24888?
================================== Ai Message ==================================
Tool Calls:
  get_issue (call_iSYJVaM7uchfNHOMJoVPQsOi)
 Call ID: call_iSYJVaM7uchfNHOMJoVPQsOi
  Args:
    issue_number: 24888
================================= Tool Message =================================
Name: get_issue

{"number": 24888, "title": "Standardize KV-Store Docs", "body": "To make our KV-store integrations as easy to use as possible we need to make sure the docs for them are thorough and standardized. There are two parts to this: updating the KV-store docstrings and updating the actual integration docs.\r\n\r\nThis needs to be done for each KV-store integration, ideally with one PR per KV-store.\r\n\r\nRelated to broader issues #21983 and #22005.\r\n\r\n## Docstrings\r\nEach KV-store class docstring should have the sections shown in the [Appendix](#appendix) below. The sections should have input and output code blocks when relevant.\r\n\r\nTo build a preview of the API docs for the package you're working on run (from root of repo):\r\n\r\n\`\`\`shell\r\nmake api_docs_clean; make api_docs_quick_preview API_PKG=openai\r\n\`\`\`\r\n\r\nwhere `API_PKG=` should be the parent directory that houses the edited package (e.g. community, openai, anthropic, huggingface, together, mistralai, groq, fireworks, etc.). This should be quite fast for all the partner packages.\r\n\r\n## Doc pages\r\nEach KV-store [docs page](https://python.langchain.com/docs/integrations/stores/) should follow [this template](https://github.com/langchain-ai/langchain/blob/master/libs/cli/langchain_cli/integration_template/docs/kv_store.ipynb).\r\n\r\nHere is an example: https://python.langchain.com/docs/integrations/stores/in_memory/\r\n\r\nYou can use the `langchain-cli` to quickly get started with a new chat model integration docs page (run from root of repo):\r\n\r\n\`\`\`shell\r\npoetry run pip install -e libs/cli\r\npoetry run langchain-cli integration create-doc --name \"foo-bar\" --name-class FooBar --component-type kv_store --destination-dir ./docs/docs/integrations/stores/\r\n\`\`\`\r\n\r\nwhere `--name` is the integration package name without the \"langchain-\" prefix and `--name-class` is the class name without the \"ByteStore\" suffix. This will create a template doc with some autopopulated fields at docs/docs/integrations/stores/foo_bar.ipynb.\r\n\r\nTo build a preview of the docs you can run (from root):\r\n\r\n\`\`\`shell\r\nmake docs_clean\r\nmake docs_build\r\ncd docs/build/output-new\r\nyarn\r\nyarn start\r\n\`\`\`\r\n\r\n## Appendix\r\nExpected sections for the KV-store class docstring.\r\n\r\n\`\`\`python\r\n    \"\"\"__ModuleName__ completion KV-store integration.\r\n\r\n    # TODO: Replace with relevant packages, env vars.\r\n    Setup:\r\n        Install `__package_name__` and set environment variable `__MODULE_NAME___API_KEY`.\r\n\r\n        .. code-block:: bash\r\n\r\n            pip install -U __package_name__\r\n            export __MODULE_NAME___API_KEY=\"your-api-key\"\r\n\r\n    # TODO: Populate with relevant params.\r\n    Key init args \u2014 client params:\r\n        api_key: Optional[str]\r\n            __ModuleName__ API key. If not passed in will be read from env var __MODULE_NAME___API_KEY.\r\n\r\n    See full list of supported init args and their descriptions in the params section.\r\n\r\n    # TODO: Replace with relevant init params.\r\n    Instantiate:\r\n        .. code-block:: python\r\n\r\n            from __module_name__ import __ModuleName__ByteStore\r\n\r\n            kv_store = __ModuleName__ByteStore(\r\n                # api_key=\"...\",\r\n                # other params...\r\n            )\r\n\r\n    Set keys:\r\n        .. code-block:: python\r\n\r\n            kv_pairs = [\r\n                [\"key1\", \"value1\"],\r\n                [\"key2\", \"value2\"],\r\n            ]\r\n\r\n            kv_store.mset(kv_pairs)\r\n\r\n        .. code-block:: python\r\n\r\n    Get keys:\r\n        .. code-block:: python\r\n\r\n            kv_store.mget([\"key1\", \"key2\"])\r\n\r\n        .. code-block:: python\r\n\r\n            # TODO: Example output.\r\n\r\n    Delete keys:\r\n        ..code-block:: python\r\n\r\n            kv_store.mdelete([\"key1\", \"key2\"])\r\n\r\n        ..code-block:: python\r\n    \"\"\"  # noqa: E501\r\n\`\`\`", "comments": "[]", "opened_by": "jacoblee93"}
================================== Ai Message ==================================

The title of issue 24888 is "Standardize KV-Store Docs".
```

---

## API 参考

有关所有 `GithubToolkit` 功能和配置的详细文档，请参阅 [API 参考](https://python.langchain.com/api_reference/community/agent_toolkits/langchain_community.agent_toolkits.github.toolkit.GitHubToolkit.html)。
