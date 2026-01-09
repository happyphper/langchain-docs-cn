---
title: AINetwork 工具包
---
>[AI Network](https://www.ainetwork.ai/build-on-ain) 是一个专为容纳大规模 AI 模型而设计的第 1 层区块链，它利用由 [$AIN 代币](https://www.ainetwork.ai/token)驱动的去中心化 GPU 网络，丰富了 AI 驱动的 `NFT`（`AINFT`）。

`AINetwork Toolkit` 是一套用于与 [AINetwork 区块链](https://www.ainetwork.ai/public/whitepaper.pdf)交互的工具。这些工具允许你转移 `AIN`、读写数值、创建应用，并为区块链数据库中的特定路径设置权限。

## 安装依赖

在使用 AINetwork Toolkit 之前，你需要安装 ain-py 包。你可以使用 pip 安装：

```python
pip install -qU  ain-py langchain-community
```

## 设置环境变量

你需要将 `AIN_BLOCKCHAIN_ACCOUNT_PRIVATE_KEY` 环境变量设置为你的 AIN 区块链账户私钥。

```python
import os

os.environ["AIN_BLOCKCHAIN_ACCOUNT_PRIVATE_KEY"] = ""
```

### 获取 AIN 区块链私钥

```python
import os

from ain.account import Account

if os.environ.get("AIN_BLOCKCHAIN_ACCOUNT_PRIVATE_KEY", None):
    account = Account(os.environ["AIN_BLOCKCHAIN_ACCOUNT_PRIVATE_KEY"])
else:
    account = Account.create()
    os.environ["AIN_BLOCKCHAIN_ACCOUNT_PRIVATE_KEY"] = account.private_key
    print(
        f"""
address: {account.address}
private_key: {account.private_key}
"""
    )
# 重要提示：如果你计划将来使用此账户，请务必将私钥保存在安全的地方。丢失私钥意味着你将无法访问你的账户。
```

```text
address: 0x5BEB4Defa2ccc274498416Fd7Cb34235DbC122Ac
private_key: f5e2f359bb6b7836a2ac70815473d1a290c517f847d096f5effe818de8c2cf14
```

## 初始化 AINetwork Toolkit

你可以像这样初始化 AINetwork Toolkit：

```python
from langchain_community.agent_toolkits.ainetwork.toolkit import AINetworkToolkit

toolkit = AINetworkToolkit()
tools = toolkit.get_tools()
address = tools[0].interface.wallet.defaultAccount.address
```

## 使用 AINetwork Toolkit 初始化 Agent

你可以像这样使用 AINetwork Toolkit 初始化 agent：

```python
from langchain_openai import ChatOpenAI
from langchain.agents import create_agent

llm = ChatOpenAI(temperature=0)
agent = create_agent(model=llm, tools=tools)
```

## 使用示例

以下是一些如何使用带有 AINetwork Toolkit 的 agent 的示例：

### 定义用于测试的应用名称

```python
appName = f"langchain_demo_{address.lower()}"
```

### 在 AINetwork 区块链数据库中创建一个应用

```python
print(
    agent.invoke(
        {
            "messages": f"Create an app in the AINetwork Blockchain database with the name {appName}"
        }
    )
)
```

```text
> Entering new AgentExecutor chain...

Invoking: `AINappOps` with `{'type': 'SET_ADMIN', 'appName': 'langchain_demo_0x5beb4defa2ccc274498416fd7cb34235dbc122ac'}`

{"tx_hash": "0x018846d6a9fc111edb1a2246ae2484ef05573bd2c584f3d0da155fa4b4936a9e", "result": {"gas_amount_total": {"bandwidth": {"service": 4002, "app": {"langchain_demo_0x5beb4defa2ccc274498416fd7cb34235dbc122ac": 2}}, "state": {"service": 1640}}, "gas_cost_total": 0, "func_results": {"_createApp": {"op_results": {"0": {"path": "/apps/langchain_demo_0x5beb4defa2ccc274498416fd7cb34235dbc122ac", "result": {"code": 0, "bandwidth_gas_amount": 1}}, "1": {"path": "/apps/langchain_demo_0x5beb4defa2ccc274498416fd7cb34235dbc122ac", "result": {"code": 0, "bandwidth_gas_amount": 1}}, "2": {"path": "/manage_app/langchain_demo_0x5beb4defa2ccc274498416fd7cb34235dbc122ac/config/admin", "result": {"code": 0, "bandwidth_gas_amount": 1}}}, "code": 0, "bandwidth_gas_amount": 2000}}, "code": 0, "bandwidth_gas_amount": 2001, "gas_amount_charged": 5642}}The app with the name "langchain_demo_0x5beb4defa2ccc274498416fd7cb34235dbc122ac" has been created in the AINetwork Blockchain database.

> Finished chain.
The app with the name "langchain_demo_0x5beb4defa2ccc274498416fd7cb34235dbc122ac" has been created in the AINetwork Blockchain database.
```

### 在 AINetwork 区块链数据库的给定路径设置一个值

```python
print(
    agent.run(f"Set the value {{1: 2, '34': 56}} at the path /apps/{appName}/object .")
)
```

```text
> Entering new AgentExecutor chain...

Invoking: `AINvalueOps` with `{'type': 'SET', 'path': '/apps/langchain_demo_0x5beb4defa2ccc274498416fd7cb34235dbc122ac/object', 'value': {'1': 2, '34': 56}}`

{"tx_hash": "0x3d1a16d9808830088cdf4d37f90f4b1fa1242e2d5f6f983829064f45107b5279", "result": {"gas_amount_total": {"bandwidth": {"service": 0, "app": {"langchain_demo_0x5beb4defa2ccc274498416fd7cb34235dbc122ac": 1}}, "state": {"service": 0, "app": {"langchain_demo_0x5beb4defa2ccc274498416fd7cb34235dbc122ac": 674}}}, "gas_cost_total": 0, "code": 0, "bandwidth_gas_amount": 1, "gas_amount_charged": 0}}The value {1: 2, '34': 56} has been set at the path /apps/langchain_demo_0x5beb4defa2ccc274498416fd7cb34235dbc122ac/object.

> Finished chain.
The value {1: 2, '34': 56} has been set at the path /apps/langchain_demo_0x5beb4defa2ccc274498416fd7cb34235dbc122ac/object.
```

### 为 AINetwork 区块链数据库中的路径设置权限

```python
print(
    agent.run(
        f"Set the write permissions for the path /apps/{appName}/user/$from with the"
        " eval string auth.addr===$from ."
    )
)
```

```text
> Entering new AgentExecutor chain...

Invoking: `AINruleOps` with `{'type': 'SET', 'path': '/apps/langchain_demo_0x5beb4defa2ccc274498416fd7cb34235dbc122ac/user/$from', 'eval': 'auth.addr===$from'}`

{"tx_hash": "0x37d5264e580f6a217a347059a735bfa9eb5aad85ff28a95531c6dc09252664d2", "result": {"gas_amount_total": {"bandwidth": {"service": 0, "app": {"langchain_demo_0x5beb4defa2ccc274498416fd7cb34235dbc122ac": 1}}, "state": {"service": 0, "app": {"langchain_demo_0x5beb4defa2ccc274498416fd7cb34235dbc122ac": 712}}}, "gas_cost_total": 0, "code": 0, "bandwidth_gas_amount": 1, "gas_amount_charged": 0}}The write permissions for the path `/apps/langchain_demo_0x5beb4defa2ccc274498416fd7cb34235dbc122ac/user/$from` have been set with the eval string `auth.addr===$from`.

> Finished chain.
The write permissions for the path `/apps/langchain_demo_0x5beb4defa2ccc274498416fd7cb34235dbc122ac/user/$from` have been set with the eval string `auth.addr===$from`.
```

### 检索 AINetwork 区块链数据库中路径的权限

```python
print(agent.run(f"Retrieve the permissions for the path /apps/{appName}."))
```

```text
> Entering new AgentExecutor chain...

Invoking: `AINownerOps` with `{'type': 'GET', 'path': '/apps/langchain_demo_0x5beb4defa2ccc274498416fd7cb34235dbc122ac'}`

{".owner": {"owners": {"0x5BEB4Defa2ccc274498416Fd7Cb34235DbC122Ac": {"branch_owner": true, "write_function": true, "write_owner": true, "write_rule": true}}}}The permissions for the path /apps/langchain_demo_0x5beb4defa2ccc274498416fd7cb34235dbc122ac are as follows:

- Address: 0x5BEB4Defa2ccc274498416Fd7Cb34235DbC122Ac
  - branch_owner: true
  - write_function: true
  - write_owner: true
  - write_rule: true

> Finished chain.
The permissions for the path /apps/langchain_demo_0x5beb4defa2ccc274498416fd7cb34235dbc122ac are as follows:

- Address: 0x5BEB4Defa2ccc274498416Fd7Cb34235DbC122Ac
  - branch_owner: true
  - write_function: true
  - write_owner: true
  - write_rule: true
```

### 从水龙头获取 AIN

```python
!curl http://faucet.ainetwork.ai/api/test/{address}/
```

```json
{"result":"0x0eb07b67b7d0a702cb60e865d3deafff3070d8508077ef793d69d6819fd92ea3","time":1692348112376}
```

### 获取 AIN 余额

```python
print(agent.run(f"Check AIN balance of {address}"))
```

```text
> Entering new AgentExecutor chain...

Invoking: `AINvalueOps` with `{'type': 'GET', 'path': '/accounts/0x5BEB4Defa2ccc274498416Fd7Cb34235DbC122Ac/balance'}`

100The AIN balance of address 0x5BEB4Defa2ccc274498416Fd7Cb34235DbC122Ac is 100 AIN.

> Finished chain.
The AIN balance of address 0x5BEB4Defa2ccc274498416Fd7Cb34235DbC122Ac is 100 AIN.
```

### 转移 AIN

```python
print(
    agent.run(
        "Transfer 100 AIN to the address 0x19937b227b1b13f29e7ab18676a89ea3bdea9c5b"
    )
)
```

```text
> Entering new AgentExecutor chain...

Invoking: `AINtransfer` with `{'address': '0x19937b227b1b13f29e7ab18676a89ea3bdea9c5b', 'amount': 100}`

{"tx_hash": "0xa59d15d23373bcc00e413ac8ba18cb016bb3bdd54058d62606aec688c6ad3d2e", "result": {"gas_amount_total": {"bandwidth": {"service": 3}, "state": {"service": 866}}, "gas_cost_total": 0, "func_results": {"_transfer": {"op_results": {"0": {"path": "/accounts/0x5BEB4Defa2ccc274498416Fd7Cb34235DbC122Ac/balance", "result": {"code": 0, "bandwidth_gas_amount": 1}}, "1": {"path": "/accounts/0x19937B227b1b13f29e7AB18676a89EA3BDEA9C5b/balance", "result": {"code": 0, "bandwidth_gas_amount": 1}}}, "code": 0, "bandwidth_gas_amount": 0}}, "code": 0, "bandwidth_gas_amount": 1, "gas_amount_charged": 869}}The transfer of 100 AIN to the address 0x19937b227b1b13f29e7ab18676a89ea3bdea9c5b was successful. The transaction hash is 0xa59d15d23373bcc00e413ac8ba18cb016bb3bdd54058d62606aec688c6ad3d2e.

> Finished chain.
The transfer of 100 AIN to the address 0x19937b227b1b13f29e7ab18676a89ea3bdea9c5b was successful. The transaction hash is 0xa59d15d23373bcc00e413ac8ba18cb016bb3bdd54058d62606aec688c6ad3d2e.
```
