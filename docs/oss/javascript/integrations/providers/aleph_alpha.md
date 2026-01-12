---
title: Aleph Alpha
---
>[Aleph Alpha](https://docs.aleph-alpha.com/) 成立于 2019 年，其使命是研究和构建强人工智能时代的基础技术。这个由国际科学家、工程师和创新者组成的团队研究、开发和部署变革性的人工智能，例如大型语言和多模态模型，并运营着欧洲最快的商业人工智能集群。

>[Luminous 系列](https://docs.aleph-alpha.com/docs/introduction/luminous/) 是一个大型语言模型家族。

## 安装与设置

::: code-group

```bash [pip]
pip install aleph-alpha-client
```

```bash [uv]
uv add aleph-alpha-client
```

:::

您需要创建一个新的令牌。请参阅[说明](https://docs.aleph-alpha.com/docs/account/#create-a-new-token)。

```python
from getpass import getpass

ALEPH_ALPHA_API_KEY = getpass()
```

## LLM

查看[使用示例](/oss/javascript/integrations/llms/aleph_alpha)。

```python
from langchain_community.llms import AlephAlpha
```

## 文本嵌入模型

查看[使用示例](/oss/javascript/integrations/text_embedding/aleph_alpha)。

```python
from langchain_community.embeddings import AlephAlphaSymmetricSemanticEmbedding, AlephAlphaAsymmetricSemanticEmbedding
```
