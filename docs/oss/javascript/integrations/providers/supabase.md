---
title: Supabase (Postgres)
---
>[Supabase](https://supabase.com/docs) 是一个开源的 `Firebase` 替代方案。
> `Supabase` 构建于 `PostgreSQL` 之上，它提供了强大的 `SQL`
> 查询能力，并能够与现有工具和框架实现简单的接口。

>[PostgreSQL](https://en.wikipedia.org/wiki/PostgreSQL)，也称为 `Postgres`，
> 是一个免费开源的关系型数据库管理系统 (RDBMS)，
> 强调可扩展性和 `SQL` 合规性。

## 安装与设置

我们需要安装 `supabase` Python 包。

::: code-group

```bash [pip]
pip install supabase
```

```bash [uv]
uv add supabase
```

:::

## 向量存储

查看[使用示例](/oss/javascript/integrations/vectorstores/supabase)。

```python
from langchain_community.vectorstores import SupabaseVectorStore
```
