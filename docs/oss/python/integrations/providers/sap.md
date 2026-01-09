---
title: SAP
---
>[SAP SE（维基百科）](https://www.sap.com/about/company.html) 是一家德国跨国软件公司。它开发用于管理业务运营和客户关系的企业软件。该公司是全球领先的 `企业资源规划 (ERP)` 软件供应商。

## 安装与设置

我们需要安装 `langchain-hana` Python 包。

::: code-group

```bash [pip]
pip install langchain-hana
```

```bash [uv]
uv add langchain-hana
```

:::

## 向量存储

>[SAP HANA Cloud Vector Engine](https://help.sap.com/docs/hana-cloud-database/sap-hana-cloud-sap-hana-database-vector-engine-guide/sap-hana-cloud-sap-hana-database-vector-engine-guide) 是一个完全集成到 `SAP HANA Cloud` 数据库中的向量存储。

查看 [使用示例](/oss/integrations/vectorstores/sap_hanavector)。

```python
from langchain_hana import HanaDB
```
