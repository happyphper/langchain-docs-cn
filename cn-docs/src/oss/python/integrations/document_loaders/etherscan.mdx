---
title: Etherscan
---
>[Etherscan](https://docs.etherscan.io/) 是领先的区块链浏览器、搜索、API 和分析平台，服务于以太坊——一个去中心化的智能合约平台。

## 概述

`Etherscan` 加载器使用 `Etherscan API` 来加载 `以太坊主网` 上特定账户的交易历史。

您需要一个 `Etherscan API 密钥` 才能继续。免费的 API 密钥有每秒 5 次调用的配额。

该加载器支持以下六种功能：

*   检索以太坊主网上特定账户的普通交易
*   检索以太坊主网上特定账户的内部交易
*   检索以太坊主网上特定账户的 ERC20 交易
*   检索以太坊主网上特定账户的 ERC721 交易
*   检索以太坊主网上特定账户的 ERC1155 交易
*   检索以太坊主网上特定账户的以太坊余额（以 wei 为单位）

如果账户没有相应的交易，加载器将返回一个包含一个文档的列表。该文档的内容是 ''。

您可以向加载器传递不同的过滤器来访问我们上面提到的不同功能：

*   "normal_transaction"
*   "internal_transaction"
*   "erc20_transaction"
*   "eth_balance"
*   "erc721_transaction"
*   "erc1155_transaction"
过滤器默认为 normal_transaction

如果您有任何问题，可以访问 [Etherscan API 文档](https://etherscan.io/tx/0x0ffa32c787b1398f44303f731cb06678e086e4f82ce07cebf75e99bb7c079c77) 或通过 [i@inevitable.tech](mailto:i@inevitable.tech) 联系我。

由于 Etherscan 的限制，所有与交易历史相关的功能最多只能检索 1000 条历史记录。您可以使用以下参数来查找所需的交易历史：

*   offset: 默认为 20。每次显示 20 笔交易。
*   page: 默认为 1。此参数控制分页。
*   start_block: 默认为 0。交易历史从 0 区块开始。
*   end_block: 默认为 99999999。交易历史到 99999999 区块结束。
*   sort: "desc" 或 "asc"。默认设置为 "desc" 以获取最新交易。

## 设置

```python
pip install -qU  langchain -q
```

```python
etherscanAPIKey = "..."
```

```python
import os

from langchain_community.document_loaders import EtherscanLoader
```

```python
os.environ["ETHERSCAN_API_KEY"] = etherscanAPIKey
```

## 创建一个 ERC20 交易加载器

```python
account_address = "0x9dd134d14d1e65f84b706d6f205cd5b1cd03a46b"
loader = EtherscanLoader(account_address, filter="erc20_transaction")
result = loader.load()
eval(result[0].page_content)
```

```text
{'blockNumber': '13242975',
 'timeStamp': '1631878751',
 'hash': '0x366dda325b1a6570928873665b6b418874a7dedf7fee9426158fa3536b621788',
 'nonce': '28',
 'blockHash': '0x5469dba1b1e1372962cf2be27ab2640701f88c00640c4d26b8cc2ae9ac256fb6',
 'from': '0x2ceee24f8d03fc25648c68c8e6569aa0512f6ac3',
 'contractAddress': '0x2ceee24f8d03fc25648c68c8e6569aa0512f6ac3',
 'to': '0x9dd134d14d1e65f84b706d6f205cd5b1cd03a46b',
 'value': '298131000000000',
 'tokenName': 'ABCHANGE.io',
 'tokenSymbol': 'XCH',
 'tokenDecimal': '9',
 'transactionIndex': '71',
 'gas': '15000000',
 'gasPrice': '48614996176',
 'gasUsed': '5712724',
 'cumulativeGasUsed': '11507920',
 'input': 'deprecated',
 'confirmations': '4492277'}
```

## 使用自定义参数创建一个普通交易加载器

```python
loader = EtherscanLoader(
    account_address,
    page=2,
    offset=20,
    start_block=10000,
    end_block=8888888888,
    sort="asc",
)
result = loader.load()
result
```

```text
20
```

```python
[Document(page_content="{'blockNumber': '1723771', 'timeStamp': '1466213371', 'hash': '0xe00abf5fa83a4b23ee1cc7f07f9dda04ab5fa5efe358b315df8b76699a83efc4', 'nonce': '3155', 'blockHash': '0xc2c2207bcaf341eed07f984c9a90b3f8e8bdbdbd2ac6562f8c2f5bfa4b51299d', 'transactionIndex': '5', 'from': '0x3763e6e1228bfeab94191c856412d1bb0a8e6996', 'to': '0x9dd134d14d1e65f84b706d6f205cd5b1cd03a46b', 'value': '13149213761000000000', 'gas': '90000', 'gasPrice': '22655598156', 'isError': '0', 'txreceipt_status': '', 'input': '0x', 'contractAddress': '', 'cumulativeGasUsed': '126000', 'gasUsed': '21000', 'confirmations': '16011481', 'methodId': '0x', 'functionName': ''}", metadata={'from': '0x3763e6e1228bfeab94191c856412d1bb0a8e6996', 'tx_hash': '0xe00abf5fa83a4b23ee1cc7f07f9dda04ab5fa5efe358b315df8b76699a83efc4', 'to': '0x9dd134d14d1e65f84b706d6f205cd5b1cd03a46b'}),
 Document(page_content="{'blockNumber': '1727090', 'timeStamp': '1466262018', 'hash': '0xd5a779346d499aa722f72ffe7cd3c8594a9ddd91eb7e439e8ba92ceb7bc86928', 'nonce': '3267', 'blockHash': '0xc0cff378c3446b9b22d217c2c5f54b1c85b89a632c69c55b76cdffe88d2b9f4d', 'transactionIndex': '20', 'from': '0x3763e6e1228bfeab94191c856412d1bb0a8e6996', 'to': '0x9dd134d14d1e65f84b706d6f205cd5b1cd03a46b', 'value': '11521979886000000000', 'gas': '90000', 'gasPrice': '20000000000', 'isError': '0', 'txreceipt_status': '', 'input': '0x', 'contractAddress': '', 'cumulativeGasUsed': '3806725', 'gasUsed': '21000', 'confirmations': '16008162', 'methodId': '0x', 'functionName': ''}", metadata={'from': '0x3763e6e1228bfeab94191c856412d1bb0a8e6996', 'tx_hash': '0xd5a779346d499aa722f72ffe7cd3c8594a9ddd91eb7e439e8ba92ceb7bc86928', 'to': '0x9dd134d14d1e65f84b706d6f205cd5b1cd03a46b'}),
 Document(page_content="{'blockNumber': '1730337', 'timeStamp': '1466308222', 'hash': '0xceaffdb3766d2741057d402738eb41e1d1941939d9d438c102fb981fd47a87a4', 'nonce': '3344', 'blockHash': '0x3a52d28b8587d55c621144a161a0ad5c37dd9f7d63b629ab31da04fa410b2cfa', 'transactionIndex': '1', 'from': '0x3763e6e1228bfeab94191c856412d1bb0a8e6996', 'to': '0x9dd134d14d1e65f84b706d6f205cd5b1cd03a46b', 'value': '9783400526000000000', 'gas': '90000', 'gasPrice': '20000000000', 'isError': '0', 'txreceipt_status': '', 'input': '0x', 'contractAddress': '', 'cumulativeGasUsed': '60788', 'gasUsed': '21000', 'confirmations': '16004915', 'methodId': '0x', 'functionName': ''}", metadata={'from': '0x3763e6e1228bfeab94191c856412d1bb0a8e6996', 'tx_hash': '0xceaffdb3766d2741057d402738eb41e1d1941939d9d438c102fb981fd47a87a4', 'to': '0x9dd134d14d1e65f84b706d6f205cd5b1cd03a46b'}),
 Document(page_content="{'blockNumber': '1733479', 'timeStamp': '1466352351', 'hash': '0x720d79bf78775f82b40280aae5abfc347643c5f6708d4bf4ec24d65cd01c7121', 'nonce': '3367', 'blockHash': '0x9928661e7ae125b3ae0bcf5e076555a3ee44c52ae31bd6864c9c93a6ebb3f43e', 'transactionIndex': '0', 'from': '0x3763e6e1228bfeab94191c856412d1bb0a8e6996', 'to': '0x9dd134d14d1e65f84b706d6f205cd5b1cd03a46b', 'value': '1570706444000000000', 'gas': '90000', 'gasPrice': '20000000000', 'isError': '0', 'txreceipt_status': '', 'input': '0x', 'contractAddress': '', 'cumulativeGasUsed': '21000', 'gasUsed': '21000', 'confirmations': '16001773', 'methodId': '0x', 'functionName': ''}", metadata={'from': '0x3763e6e1228bfeab94191c856412d1bb0a8e6996', 'tx_hash': '0x720d79bf78775f82b40280aae5abfc347643c5f6708d4bf4ec24d65cd01c7121', 'to': '0x9dd134d14d1e65f84b706d6f205cd5b1cd03a46b'}),
 Document(page_content="{'blockNumber': '1734172', 'timeStamp': '1466362463', 'hash': '0x7a062d25b83bafc9fe6b22bc6f5718bca333908b148676e1ac66c0adeccef647', 'nonce': '1016', 'blockHash': '0x8a8afe2b446713db88218553cfb5dd202422928e5e0bc00475ed2f37d95649de', 'transactionIndex': '4', 'from': '0x16545fb79dbee1ad3a7f868b7661c023f372d5de', 'to': '0x9dd134d14d1e65f84b706d6f205cd5b1cd03a46b', 'value': '6322276709000000000', 'gas': '90000', 'gasPrice': '20000000000', 'isError': '0', 'txreceipt_status': '', 'input': '0x', 'contractAddress': '', 'cumulativeGasUsed': '105333', 'gasUsed': '21000', 'confirmations': '16001080', 'methodId': '0x', 'functionName': ''}", metadata={'from': '0x16545fb79dbee1ad3a7f868b7661c023f372d5de', 'tx_hash': '0x7a062d25b83bafc9fe6b22bc6f5718bca333908b148676e1ac66c0adeccef647', 'to': '0x9dd134d14d1e65f84b706d6f205cd5b1cd03a46b'}),
 Document(page_content="{'blockNumber': '1737276', 'timeStamp': '1466406037', 'hash': '0xa4e89bfaf075abbf48f96700979e6c7e11a776b9040113ba64ef9c29ac62b19b', 'nonce': '1024', 'blockHash': '0xe117cad73752bb485c3bef24556e45b7766b283229180fcabc9711f3524b9f79', 'transactionIndex': '35', 'from': '0x16545fb79dbee1ad3a7f868b7661c023f372d5de', 'to': '0x9dd134d14d1e65f84b706d6f205cd5b1cd03a46b', 'value': '9976891868000000000', 'gas': '90000', 'gasPrice': '20000000000', 'isError': '0', 'txreceipt_status': '', 'input': '0x', 'contractAddress': '', 'cumulativeGasUsed': '3187163', 'gasUsed': '21000', 'confirmations': '15997976', 'methodId': '0x', 'functionName': ''}", metadata={'from': '0x16545fb79dbee1ad3a7f868b7661c023f372d5de', 'tx_hash': '0xa4e89bfaf075abbf48f96700979e6c7e11a776b9040113ba64ef9c29ac62b19b', 'to': '0x9dd134d14d1e65f84b706d6f205cd5b1cd03a46b'}),
 Document(page_content="{'blockNumber': '1740314', 'timeStamp': '1466450262', 'hash': '0x6e1a22dcc6e2c77a9451426fb49e765c3c459dae88350e3ca504f4831ec20e8a', 'nonce': '1051', 'blockHash': '0x588d17842819a81afae3ac6644d8005c12ce55ddb66c8d4c202caa91d4e8fdbe', 'transactionIndex': '6', 'from': '0x16545fb79dbee1ad3a7f868b7661c023f372d5de', 'to': '0x9dd134d14d1e65f84b706d6f205cd5b1cd03a46b', 'value': '8060633765000000000', 'gas': '90000', 'gasPrice': '22926905859', 'isError': '0', 'txreceipt_status': '', 'input': '0x', 'contractAddress': '', 'cumulativeGasUsed': '153077', 'gasUsed': '21000', 'confirmations': '15994938', 'methodId': '0x', 'functionName': ''}", metadata={'from': '0x16545fb79dbee1ad3a7f868b7661c023f372d5de', 'tx_hash': '0x6e1a22dcc6e2c77a9451426fb49e765c3c459dae88350e3ca504f4831ec20e8a', 'to': '0x9dd134d14d1e65f84b706d6f205cd5b1cd03a46b'}),
 Document(page_content="{'blockNumber': '1743384', 'timeStamp': '1466494099', 'hash': '0xdbfcc15f02269fc3ae27f69e344a1ac4e08948b12b76ebdd78a64d8cafd511ef', 'nonce': '1068', 'blockHash': '0x997245108c84250057fda27306b53f9438ad40978a95ca51d8fd7477e73fbaa7', 'transactionIndex': '2', 'from': '0x16545fb79dbee1ad3a7f868b7661c023f372d5de', 'to': '0x9dd134d14d1e65f84b706d6f205cd5b1cd03a46b', 'value': '9541921352000000000', 'gas': '90000', 'gasPrice': '20000000000', 'isError': '0', 'txreceipt_status': '', 'input': '0x', 'contractAddress': '', 'cumulativeGasUsed': '119650', 'gasUsed': '21000', '
