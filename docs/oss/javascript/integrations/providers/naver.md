---
title: NAVER
---
所有与 `Naver` 相关的功能，包括 HyperCLOVA X 模型，特别是那些通过 `Naver Cloud` [CLOVA Studio](https://clovastudio.ncloud.com/) 访问的模型。

> [Naver](https://navercorp.com/) 是一家全球性的科技公司，拥有尖端技术和多样化的业务组合，包括搜索、电商、金融科技、内容、云和人工智能。

> [Naver Cloud](https://www.navercloudcorp.com/lang/en/) 是 Naver 的云计算部门，是一家领先的云服务提供商，通过其 [Naver Cloud Platform (NCP)](https://www.ncloud.com/) 为企业提供全面的云服务套件。

更多详细说明（也有韩语版本），请参阅 [NCP 用户指南](https://guide.ncloud-docs.com/docs/clovastudio-overview)。

## 安装与设置

- 通过 [签发](https://api.ncloud-docs.com/docs/ai-naver-clovastudio-summary#API%ED%82%A4) 获取 CLOVA Studio API 密钥，并将其设置为环境变量 (`CLOVASTUDIO_API_KEY`)。

Naver 集成存在于两个包中：

- `langchain-naver`：一个专用于 Naver 的集成包。
- `langchain-naver-community`：一个社区维护的包，并非由 Naver 或 LangChain 官方维护。

::: code-group

```bash [pip]
pip install -U langchain-naver
# pip install -U langchain-naver-community // 安装以使用 Naver 搜索工具。
```

```bash [uv]
uv add langchain-naver
# uv add langchain-naver-community // 安装以使用 Naver 搜索工具。
```

:::

> **(注意)** 通过 `langchain-community`（一个[第三方集成](https://python.langchain.com/docs/concepts/architecture/#langchain-community)的集合）进行的 Naver 集成已过时。
> - **请使用 `langchain-naver`，因为新功能应仅通过此包实现**。
> - 如果您正在使用 `langchain-community`（已过时）并且拥有旧的 API 密钥（不以 `nv-*` 前缀开头），则应将其设置为 `NCP_CLOVASTUDIO_API_KEY`，并且可能需要通过[创建您的应用](https://guide.ncloud-docs.com/docs/en/clovastudio-playground01#create-test-app)获取额外的 API 网关 API 密钥，并将其设置为 `NCP_APIGW_API_KEY`。

## 聊天模型

### ChatClovaX

查看[使用示例](/oss/javascript/integrations/chat/naver)。

```python
from langchain_naver import ChatClovaX
```

## 嵌入模型

### ClovaXEmbeddings

查看[使用示例](/oss/javascript/integrations/text_embedding/naver)。

```python
from langchain_naver import ClovaXEmbeddings
```

## 工具

### Naver 搜索

Naver 搜索集成允许您的 LangChain 应用程序从 Naver 搜索引擎检索信息。这对于韩语查询和获取有关韩国主题的最新信息特别有用。

要使用 Naver 搜索工具，您需要：

1. 登录 [Naver Developers 门户](https://developers.naver.com/main/)
2. 创建一个新应用并启用搜索 API
3. 从"应用列表"部分获取您的 **NAVER_CLIENT_ID** 和 **NAVER_CLIENT_SECRET**
4. 在您的应用程序中将它们设置为环境变量

```python
from langchain_naver_community.tool import NaverSearchResults
from langchain_naver_community.utils import NaverSearchAPIWrapper

# 设置搜索包装器
search = NaverSearchAPIWrapper()

# 创建工具
tool = NaverSearchResults(api_wrapper=search)
```

更多详情，请查看[使用示例](/oss/javascript/integrations/tools/naver_search)。

### 专用搜索工具

该包还提供了针对不同类型内容的专用搜索工具：

```python
from langchain_naver_community.tool import NaverNewsSearch  # 用于新闻文章
from langchain_naver_community.tool import NaverBlogSearch  # 用于博客文章
from langchain_naver_community.tool import NaverImageSearch  # 用于图片
```

这些工具中的每一个都可以在 LangChain 智能体中使用，以提供更有针对性的搜索能力。
