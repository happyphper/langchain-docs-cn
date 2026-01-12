---
title: AINetwork
---
>[AI Network](https://www.ainetwork.ai/build-on-ain) 是一个专为容纳大规模 AI 模型而设计的第 1 层区块链，它利用由 [$AIN 代币](https://www.ainetwork.ai/token) 驱动的去中心化 GPU 网络，丰富了 AI 驱动的 `NFT`（`AINFT`）。

## 安装与设置

你需要安装 `ain-py` Python 包。

::: code-group

```bash [pip]
pip install ain-py
```

```bash [uv]
uv add ain-py
```

:::

你需要将环境变量 `AIN_BLOCKCHAIN_ACCOUNT_PRIVATE_KEY` 设置为你的 AIN 区块链账户私钥。

## 工具包

查看 [使用示例](/oss/python/integrations/tools/ainetwork)。

```python
from langchain_community.agent_toolkits.ainetwork.toolkit import AINetworkToolkit
```
