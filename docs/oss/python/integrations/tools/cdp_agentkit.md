---
title: CDP Agentkit 工具包
---
`CDP Agentkit` 工具包包含一系列工具，使 LLM 智能体能够与 [Coinbase Developer Platform](https://docs.cdp.coinbase.com/) 进行交互。该工具包对 CDP SDK 进行了封装，允许智能体执行链上操作，如转账、交易和智能合约交互。

## 概述

### 集成详情

| 类 | 包 | 可序列化 | JS 支持 | 版本 |
| :--- | :--- | :---: | :---: | :---: |
| CdpToolkit | `cdp-langchain` | ❌ | ❌ |  ![PyPI - Version](https://img.shields.io/pypi/v/cdp-langchain?style=flat-square&label=%20) |

### 工具特性

该工具包提供以下工具：

1.  **get_wallet_details** - 获取 MPC 钱包的详细信息
2.  **get_balance** - 获取特定资产的余额
3.  **request_faucet_funds** - 从水龙头请求测试代币
4.  **transfer** - 在地址之间转移资产
5.  **trade** - 交易资产（仅限主网）
6.  **deploy_token** - 部署 ERC-20 代币合约
7.  **mint_nft** - 从现有合约铸造 NFT
8.  **deploy_nft** - 部署新的 NFT 合约
9.  **register_basename** - 为钱包注册一个基础名称

我们鼓励您添加自己的工具，无论是使用 CDP 还是 Web2 API，以创建一个满足您特定需求的智能体。

## 设置

从高层次来看，我们将：

1.  安装 langchain 包
2.  设置您的 CDP API 凭证
3.  初始化 CDP 封装器和工具包
4.  使用 `toolkit.get_tools()` 将工具传递给您的智能体

要启用对单个工具的自动化追踪，请设置您的 [LangSmith](https://docs.langchain.com/langsmith/home) API 密钥：

```python
os.environ["LANGSMITH_API_KEY"] = getpass.getpass("Enter your LangSmith API key: ")
os.environ["LANGSMITH_TRACING"] = "true"
```

### 安装

此工具包位于 `cdp-langchain` 包中：

```python
pip install -qU cdp-langchain
```

#### 设置环境变量

要使用此工具包，您必须首先设置以下环境变量以访问 [CDP API](https://docs.cdp.coinbase.com/mpc-wallet/docs/quickstart) 来创建钱包并进行链上交互。您可以在 [CDP 门户](https://cdp.coinbase.com/) 免费注册获取 API 密钥：

```python
import getpass
import os

for env_var in [
    "CDP_API_KEY_NAME",
    "CDP_API_KEY_PRIVATE_KEY",
]:
    if not os.getenv(env_var):
        os.environ[env_var] = getpass.getpass(f"Enter your {env_var}: ")

# 可选：设置网络（默认为 base-sepolia）
os.environ["NETWORK_ID"] = "base-sepolia"  # 或 "base-mainnet"
```

## 实例化

现在我们可以实例化我们的工具包：

```python
from cdp_langchain.agent_toolkits import CdpToolkit
from cdp_langchain.utils import CdpAgentkitWrapper

# 初始化 CDP 封装器
cdp = CdpAgentkitWrapper()

# 从封装器创建工具包
toolkit = CdpToolkit.from_cdp_agentkit_wrapper(cdp)
```

## 工具

查看 [可用工具](#tool-features)：

```python
tools = toolkit.get_tools()
for tool in tools:
    print(tool.name)
```

## 在智能体中使用

我们需要一个 LLM 或聊天模型：

```python
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o-mini")
```

使用工具初始化智能体：

```python
from langchain.agents import create_agent

tools = toolkit.get_tools()
agent_executor = create_agent(llm, tools)
```

使用示例：

```python
example_query = "Send 0.005 ETH to john2879.base.eth"

events = agent_executor.stream(
    {"messages": [("user", example_query)]},
    stream_mode="values",
)
for event in events:
    event["messages"][-1].pretty_print()
```

预期输出：

```
Transferred 0.005 of eth to john2879.base.eth.
Transaction hash for the transfer: 0x78c7c2878659a0de216d0764fc87eff0d38b47f3315fa02ba493a83d8e782d1e
Transaction link for the transfer: https://sepolia.basescan.org/tx/0x78c7c2878659a0de216d0764fc87eff0d38b47f3315fa02ba493a83d8e782d1
```

## CDP 工具包特定功能

### 钱包管理

该工具包维护一个 MPC 钱包。钱包数据可以导出和导入，以便在不同会话之间持久化：

```python
# 导出钱包数据
wallet_data = cdp.export_wallet()

# 导入钱包数据
values = {"cdp_wallet_data": wallet_data}
cdp = CdpAgentkitWrapper(**values)
```

### 网络支持

该工具包支持 [多个网络](https://docs.cdp.coinbase.com/cdp-sdk/docs/networks)

### 无 Gas 交易

某些操作在 Base 主网上支持无 Gas 交易：

-   USDC 转账
-   EURC 转账
-   cbBTC 转账

---

## API 参考

有关所有 CDP 功能和配置的详细文档，请前往 [CDP 文档](https://docs.cdp.coinbase.com/mpc-wallet/docs/welcome)。
