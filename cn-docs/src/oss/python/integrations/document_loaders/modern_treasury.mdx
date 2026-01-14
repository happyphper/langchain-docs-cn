---
title: 现代财资管理
---
>[Modern Treasury](https://www.moderntreasury.com/) 简化了复杂的支付操作。它是一个统一的平台，为处理资金流动的产品和流程提供支持。
>
>- 连接银行和支付系统
>- 实时追踪交易和余额
>- 自动化支付操作以实现规模化

本笔记本介绍了如何将数据从 `Modern Treasury REST API` 加载到可以导入 LangChain 的格式，并提供了向量化处理的示例用法。

```python
from langchain.indexes import VectorstoreIndexCreator
from langchain_community.document_loaders import ModernTreasuryLoader
```

Modern Treasury API 需要一个组织 ID 和 API 密钥，这些可以在 Modern Treasury 仪表板的开发者设置中找到。

此文档加载器还需要一个 `resource` 选项，用于定义要加载的数据。

可用的资源如下：

`payment_orders` [文档](https://docs.moderntreasury.com/reference/payment-order-object)

`expected_payments` [文档](https://docs.moderntreasury.com/reference/expected-payment-object)

`returns` [文档](https://docs.moderntreasury.com/reference/return-object)

`incoming_payment_details` [文档](https://docs.moderntreasury.com/reference/incoming-payment-detail-object)

`counterparties` [文档](https://docs.moderntreasury.com/reference/counterparty-object)

`internal_accounts` [文档](https://docs.moderntreasury.com/reference/internal-account-object)

`external_accounts` [文档](https://docs.moderntreasury.com/reference/external-account-object)

`transactions` [文档](https://docs.moderntreasury.com/reference/transaction-object)

`ledgers` [文档](https://docs.moderntreasury.com/reference/ledger-object)

`ledger_accounts` [文档](https://docs.moderntreasury.com/reference/ledger-account-object)

`ledger_transactions` [文档](https://docs.moderntreasury.com/reference/ledger-transaction-object)

`events` [文档](https://docs.moderntreasury.com/reference/events)

`invoices` [文档](https://docs.moderntreasury.com/reference/invoices)

```python
modern_treasury_loader = ModernTreasuryLoader("payment_orders")
```

```python
# 从加载器创建向量存储检索器
# 更多详情请参阅 https://python.langchain.com/en/latest/modules/data_connection/getting_started.html

index = VectorstoreIndexCreator().from_loaders([modern_treasury_loader])
modern_treasury_doc_retriever = index.vectorstore.as_retriever()
```
