---
title: Privy
---
[Privy](https://privy.io) 是为 AI 智能体构建的强大钱包基础设施，专为规模化设计。

## 概述

创建能够执行以下操作的智能体：

-   自动创建和管理钱包
-   使用多种数字资产（包括稳定币）进行支付
-   签署消息和交易
-   查询钱包余额和地址

### 工作原理

Privy 提供钱包基础设施，消除了区块链交互的复杂性：

1.  为您的智能体提供一个强大的钱包
2.  通过交易策略保护您智能体的资产
3.  快速进行支付

**零摩擦入门**
与传统钱包解决方案不同，Privy 会自动为您的智能体创建嵌入式钱包，无需管理私钥、助记词或进行复杂设置。

**生产就绪的基础设施**
Privy 受到领先的 Web3 应用程序的信赖，能够大规模处理安全的密钥生成、多链地址派生、交易签名和合规策略。

### 快速开始

```python
import os
from langchain_privy import PrivyWalletTool
from langchain.agents import create_agent

# Set credentials
os.environ["PRIVY_APP_ID"] = "your-privy-app-id"
os.environ["PRIVY_APP_SECRET"] = "your-privy-app-secret"

# Initialize wallet tool (automatically creates wallet)
privy_tool = PrivyWalletTool()
print(f"Wallet created! Address: {privy_tool.wallet_address}")

# Create agent
agent = create_agent(
    model="claude-sonnet-4-5-20250929",
    tools=[privy_tool],
)

# Agent can now perform wallet operations
agent.invoke({"messages": [{"role": "user", "content": "What's my wallet address on Base?"}]})
```

查看完整的[示例](https://github.com/privy-io/langchain-privy/tree/main/examples)以获取完整实现。

## 设置

前往 [Privy 仪表板](https://dashboard.privy.io) 注册并创建一个新应用。您将获得：

-   **App ID** - 您的应用程序标识符
-   **App Secret** - 您的服务器端身份验证密钥

1.  安装包：

```bash
pip install langchain-privy
```

2.  设置您的凭据：

```python
import os
import getpass

os.environ["PRIVY_APP_ID"] = getpass.getpass("Enter your Privy App ID: ")
os.environ["PRIVY_APP_SECRET"] = getpass.getpass("Enter your Privy App Secret: ")
```

## 实例化

```python
from langchain_privy import PrivyWalletTool

# Automatically creates a new Ethereum wallet
tool = PrivyWalletTool()

# Or create on a specific chain
base_tool = PrivyWalletTool(chain_type="base")
solana_tool = PrivyWalletTool(chain_type="solana")

# Or reuse an existing wallet
existing_tool = PrivyWalletTool(wallet_id="wal_abc123...")
```

## 调用

### 可用操作

```python
# Get wallet address for any chain
tool.invoke({
    "operation": "get_wallet_address",
    "chain": "base"
})

# Sign a message
tool.invoke({
    "operation": "sign_message",
    "message": "Hello from LangChain!",
    "chain": "ethereum"
})

# Check balance
tool.invoke({
    "operation": "get_balance",
    "chain": "base"
})

# Send transaction
tool.invoke({
    "operation": "send_transaction",
    "chain": "base",
    "to": "0x1234567890123456789012345678901234567890",
    "value": "0.001",
    "unit": "ether"
})
```

## 在智能体中使用

```python
import os
from langchain_privy import PrivyWalletTool
from langchain.agents import create_agent

# Set credentials
os.environ["PRIVY_APP_ID"] = "your-privy-app-id"
os.environ["PRIVY_APP_SECRET"] = "your-privy-app-secret"

# Initialize tools
tools = [PrivyWalletTool()]

# Create agent
agent = create_agent(
    model="claude-sonnet-4-5-20250929",
    tools=tools,
)

# Natural language wallet operations
agent.invoke({
    "messages": [{"role": "user", "content": "Sign the message 'Verified by AI Agent' and then check my balance on Base"}]
})
```

---

## API 参考

-   完整文档请参阅 [langchain-privy GitHub 仓库](https://github.com/privy-io/langchain-privy)
-   有关 Privy 的更多信息，请参阅 [Privy 文档](https://docs.privy.io)
