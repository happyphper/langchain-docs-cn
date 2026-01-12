---
title: Spark
---
>[Apache Spark](https://spark.apache.org/) 是一个用于大规模数据处理的统一分析引擎。它提供了 Scala、Java、Python 和 R 的高级 API，以及一个支持通用计算图进行数据优化的引擎。它还支持一系列丰富的高级工具，包括用于 SQL 和 DataFrame 的 `Spark SQL`、用于 pandas 工作负载的 `pandas API on Spark`、用于机器学习的 `MLlib`、用于图处理的 `GraphX` 以及用于流处理的 `Structured Streaming`。

## 文档加载器

### PySpark

它从 `PySpark` DataFrame 加载数据。

查看[使用示例](/oss/python/integrations/document_loaders/pyspark_dataframe)。

```python
from langchain_community.document_loaders import PySparkDataFrameLoader
```

## 工具/工具包

### Spark SQL 工具包

用于与 `Spark SQL` 交互的工具包。

查看[使用示例](/oss/python/integrations/tools/spark_sql)。

```python
from langchain_community.agent_toolkits import SparkSQLToolkit, create_spark_sql_agent
from langchain_community.utilities.spark_sql import SparkSQL
```

#### Spark SQL 独立工具

您可以使用 Spark SQL 工具包中的独立工具：
- `InfoSparkSQLTool`：用于获取 Spark SQL 元数据的工具
- `ListSparkSQLTool`：用于获取表名的工具
- `QueryCheckerTool`：使用 LLM 检查查询是否正确的工具
- `QuerySparkSQLTool`：用于查询 Spark SQL 的工具

```python
from langchain_community.tools.spark_sql.tool import InfoSparkSQLTool
from langchain_community.tools.spark_sql.tool import ListSparkSQLTool
from langchain_community.tools.spark_sql.tool import QueryCheckerTool
from langchain_community.tools.spark_sql.tool import QuerySparkSQLTool
```
