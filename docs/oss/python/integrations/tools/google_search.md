---
title: 谷歌搜索
---
本笔记本将介绍如何使用 Google 搜索组件。

首先，你需要设置正确的 API 密钥和环境变量。要进行设置，请在 Google Cloud 凭据控制台 ([console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials)) 中创建 `GOOGLE_API_KEY`，并使用可编程搜索引擎 ([programmablesearchengine.google.com/controlpanel/create](https://programmablesearchengine.google.com/controlpanel/create)) 创建一个 `GOOGLE_CSE_ID`。接下来，最好按照[此处](https://stackoverflow.com/questions/37083058/programmatically-searching-google-in-python-using-custom-search)找到的说明进行操作。

然后，我们需要设置一些环境变量。

```python
pip install -qU  langchain-google-community
```

```python
import os

os.environ["GOOGLE_CSE_ID"] = ""
os.environ["GOOGLE_API_KEY"] = ""
```

```python
from langchain.tools import Tool
from langchain_google_community import GoogleSearchAPIWrapper

search = GoogleSearchAPIWrapper()

tool = Tool(
    name="google_search",
    description="Search Google for recent results.",
    func=search.run,
)
```

```python
tool.run("Obama's first name?")
```

```text
"STATE OF HAWAII. 1 Child's First Name. (Type or print). 2. Sex. BARACK. 3. This Birth. CERTIFICATE OF LIVE BIRTH. FILE. NUMBER 151 le. lb. Middle Name. Barack Hussein Obama II is an American former politician who served as the 44th president of the United States from 2009 to 2017. A member of the Democratic\xa0... When Barack Obama was elected president in 2008, he became the first African American to hold ... The Middle East remained a key foreign policy challenge. Jan 19, 2017 ... Jordan Barack Treasure, New York City, born in 2008 ... Jordan Barack Treasure made national news when he was the focus of a New York newspaper\xa0... Portrait of George Washington, the 1st President of the United States ... Portrait of Barack Obama, the 44th President of the United States\xa0... His full name is Barack Hussein Obama II. Since the “II” is simply because he was named for his father, his last name is Obama. Mar 22, 2008 ... Barry Obama decided that he didn't like his nickname. A few of his friends at Occidental College had already begun to call him Barack (his\xa0... Aug 18, 2017 ... It took him several seconds and multiple clues to remember former President Barack Obama's first name. Miller knew that every answer had to\xa0... Feb 9, 2015 ... Michael Jordan misspelled Barack Obama's first name on 50th-birthday gift ... Knowing Obama is a Chicagoan and huge basketball fan,\xa0... 4 days ago ... Barack Obama, in full Barack Hussein Obama II, (born August 4, 1961, Honolulu, Hawaii, U.S.), 44th president of the United States (2009–17) and\xa0..."
```

## 结果数量

你可以使用 `k` 参数来设置返回结果的数量。

```python
search = GoogleSearchAPIWrapper(k=1)

tool = Tool(
    name="I'm Feeling Lucky",
    description="Search Google and return the first result.",
    func=search.run,
)
```

```python
tool.run("python")
```

```text
'The official home of the Python Programming Language.'
```

'The official home of the Python Programming Language.'

## 元数据结果

通过 GoogleSearch 运行查询并返回摘要、标题和链接元数据。

- 摘要：结果的描述。
- 标题：结果的标题。
- 链接：结果的链接。

```python
search = GoogleSearchAPIWrapper()

def top5_results(query):
    return search.results(query, 5)

tool = Tool(
    name="Google Search Snippets",
    description="Search Google for recent results.",
    func=top5_results,
)
```

```python

```
