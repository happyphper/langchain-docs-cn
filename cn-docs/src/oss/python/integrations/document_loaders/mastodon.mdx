---
title: Mastodon
---
>[Mastodon](https://joinmastodon.org/) 是一个联邦制的社交媒体和社交网络服务。

此加载器使用 `Mastodon.py` Python 包，从一系列 `Mastodon` 账户的“嘟文”中获取文本。

默认情况下，无需任何身份验证即可查询公开账户。如果要查询非公开账户或实例，您需要为您的账户注册一个应用程序以获取访问令牌，并设置该令牌以及您账户的 API 基础 URL。

然后，您需要传入想要提取的 Mastodon 账户名称，格式为 `@account@instance`。

```python
from langchain_community.document_loaders import MastodonTootsLoader
```

```python
pip install -qU  Mastodon.py
```

```python
loader = MastodonTootsLoader(
    mastodon_accounts=["@Gargron@mastodon.social"],
    number_toots=50,  # 默认值为 100
)

# 或者设置访问信息以使用 Mastodon 应用程序。
# 请注意，访问令牌可以传入构造函数，也可以设置环境变量 "MASTODON_ACCESS_TOKEN"。
# loader = MastodonTootsLoader(
#     access_token="<MASTODON 应用程序的访问令牌>",
#     api_base_url="<MASTODON 应用程序实例的 API 基础 URL>",
#     mastodon_accounts=["@Gargron@mastodon.social"],
#     number_toots=50,  # 默认值为 100
# )
```

```python
documents = loader.load()
for doc in documents[:3]:
    print(doc.page_content)
    print("=" * 80)
```

```text
<p>It is tough to leave this behind and go back to reality. And some people live here! I’m sure there are downsides but it sounds pretty good to me right now.</p>
================================================================================
<p>I wish we could stay here a little longer, but it is time to go home 🥲</p>
================================================================================
<p>Last day of the honeymoon. And it’s <a href="https://mastodon.social/tags/caturday" class="mention hashtag" rel="tag">#<span>caturday</span></a>! This cute tabby came to the restaurant to beg for food and got some chicken.</p>
================================================================================
```

嘟文文本（文档的 `page_content`）默认是 Mastodon API 返回的 HTML 格式。
