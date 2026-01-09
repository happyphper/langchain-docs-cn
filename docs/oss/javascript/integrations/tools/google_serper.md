---
title: Google Serper
---
本笔记本将介绍如何使用 `Google Serper` 组件进行网络搜索。首先，您需要在 [serper.dev](https://serper.dev) 注册一个免费账户并获取您的 API 密钥。

```python
pip install -qU  langchain-community langchain-openai
```

```python
import os
import pprint

os.environ["SERPER_API_KEY"] = "your-serper-api-key"
```

```python
from langchain_community.utilities import GoogleSerperAPIWrapper

search = GoogleSerperAPIWrapper()
```

```python
search.run("Obama's first name?")
```

```text
'Barack Hussein Obama II'
```

## 作为自问自答搜索代理的一部分

为了创建一个使用 Google Serper 工具的代理，请安装 LangGraph

```python
pip install -qU langgraph langchain-openai
```

并使用 @[`create_agent`] 功能来初始化一个 ReAct 代理。您还需要设置您的 OPENAI_API_KEY（访问 [platform.openai.com](https://platform.openai.com)）以便访问 OpenAI 的聊天模型。

```python
from langchain.chat_models import init_chat_model
from langchain_community.utilities import GoogleSerperAPIWrapper
from langchain.tools import Tool
from langchain.agents import create_agent

os.environ["OPENAI_API_KEY"] = "[your openai key]"

model = init_chat_model("gpt-4o-mini", model_provider="openai", temperature=0)
search = GoogleSerperAPIWrapper()
tools = [
    Tool(
        name="Intermediate_Answer",
        func=search.run,
        description="useful for when you need to ask with search",
    )
]
agent = create_agent(model, tools)

events = agent.stream(
    {
        "messages": [
            ("user", "What is the hometown of the reigning men's U.S. Open champion?")
        ]
    },
    stream_mode="values",
)

for event in events:
    event["messages"][-1].pretty_print()
```

## 获取包含元数据的结果

如果您还想以结构化的方式获取包含元数据的结果，我们将使用包装器的 `results` 方法。

```python
search = GoogleSerperAPIWrapper()
results = search.results("Apple Inc.")
pprint.pp(results)
```

```text
{'searchParameters': {'q': 'Apple Inc.',
                      'gl': 'us',
                      'hl': 'en',
                      'type': 'search',
                      'num': 10,
                      'engine': 'google'},
 'knowledgeGraph': {'title': 'Apple',
                    'type': 'Technology company',
                    'website': 'http://www.apple.com/',
                    'imageUrl': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5ITHsQzdzkkFWKinRe1Y4FUbC_Vy3R_M&s=0',
                    'description': 'Apple Inc. is an American multinational '
                                   'corporation and technology company '
                                   'headquartered in Cupertino, California, in '
                                   'Silicon Valley. It is best known for its '
                                   'consumer electronics, software, and '
                                   'services.',
                    'descriptionSource': 'Wikipedia',
                    'descriptionLink': 'https://en.wikipedia.org/wiki/Apple_Inc.',
                    'attributes': {'Customer service': '1 (800) 275-2273',
                                   'Founders': 'Steve Jobs, Steve Wozniak, and '
                                               'Ronald Wayne',
                                   'Founded': 'April 1, 1976, Los Altos, CA',
                                   'Headquarters': 'Cupertino, CA',
                                   'CEO': 'Tim Cook (Aug 24, 2011–)'}},
 'organic': [{'title': 'Apple',
              'link': 'https://www.apple.com/',
              'snippet': 'Discover the innovative world of Apple and shop '
                         'everything iPhone, iPad, Apple Watch, Mac, and Apple '
                         'TV, plus explore accessories, entertainment, ...',
              'sitelinks': [{'title': 'Career Opportunities',
                             'link': 'https://www.apple.com/careers/us/'},
                            {'title': 'Support',
                             'link': 'https://support.apple.com/'},
                            {'title': 'Investor Relations',
                             'link': 'https://investor.apple.com/investor-relations/default.aspx'},
                            {'title': 'Apple Leadership',
                             'link': 'https://www.apple.com/leadership/'},
                            {'title': 'Store',
                             'link': 'https://www.apple.com/store'}],
              'position': 1},
             {'title': 'Apple Inc. - Wikipedia',
              'link': 'https://en.wikipedia.org/wiki/Apple_Inc.',
              'snippet': 'Apple Inc. is an American multinational corporation '
                         'and technology company headquartered in Cupertino, '
                         'California, in Silicon Valley. It is best known for '
                         '...',
              'position': 2},
             {'title': 'Apple Inc. (AAPL) Stock Price Today - WSJ',
              'link': 'https://www.wsj.com/market-data/quotes/AAPL',
              'snippet': 'Apple Inc. engages in the design, manufacture, and '
                         'sale of smartphones, personal computers, tablets, '
                         'wearables and accessories, and other varieties of '
                         'related ...',
              'position': 3},
             {'title': 'Apple Inc. | History, Products, Headquarters, & Facts '
                       '- Britannica',
              'link': 'https://www.britannica.com/money/Apple-Inc',
              'snippet': 'American manufacturer of personal computers, '
                         'smartphones, and tablet computers. Apple was the '
                         'first successful personal computer company and ...',
              'date': '5 days ago',
              'position': 4},
             {'title': 'Apple Inc. (AAPL) Company Profile & Facts - Yahoo '
                       'Finance',
              'link': 'https://finance.yahoo.com/quote/AAPL/profile/',
              'snippet': 'See the company profile for Apple Inc. (AAPL) '
                         'including business summary, industry/sector '
                         'information, number of employees, business summary, '
                         '...',
              'position': 5},
             {'title': 'AAPL: Apple Inc Stock Price Quote - NASDAQ GS - '
                       'Bloomberg',
              'link': 'https://www.bloomberg.com/quote/AAPL:US',
              'snippet': 'Apple Inc. designs, manufactures, and markets '
                         'smartphones, personal computers, tablets, wearables '
                         'and accessories, and sells a variety of related '
                         'accessories.',
              'position': 6}],
 'images': [{'title': 'Apple Inc. - Wikipedia',
             'imageUrl': 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
             'link': 'https://en.wikipedia.org/wiki/Apple_Inc.'},
            {'title': 'Apple Inc. - Wikipedia',
             'imageUrl': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Aerial_view_of_Apple_Park_dllu.jpg/330px-Aerial_view_of_Apple_Park_dllu.jpg',
             'link': 'https://en.wikipedia.org/wiki/Apple_Inc.'},
            {'title': 'Apple',
             'imageUrl': 'https://www.apple.com/ac/structured-data/images/open_graph_logo.png?202110180743',
             'link': 'https://www.apple.com/'},
            {'title': 'Apple Store - Find a Store - Apple',
             'imageUrl': 'https://rtlimages.apple.com/cmc/dieter/store/16_9/R289.png?resize=672:378&output-format=jpg&output-quality=85&interpolation=progressive-bicubic',
             'link': 'https://www.apple.com/retail/'},
            {'title': 'Apple | LinkedIn',
             'imageUrl': 'https://media.licdn.com/dms/image/v2/C560BAQHdAaarsO-eyA/company-logo_200_200/company-logo_200_200/0/1630637844948/apple_logo?e=2147483647&v=beta&t=pOXzU29XHyAnHt2zp2JryxZvMBdKpqxkkbDWtZ_pnEk',
             'link': 'https://www.linkedin.com/company/apple'},
            {'title': 'The Founding of Apple Computer, Inc. - This Month in '
                      'Business ...',
             'imageUrl': 'https://tile.loc.gov/storage-services/service/pnp/highsm/49100/49193r.jpg',
             'link': 'https://guides.loc.gov/this-month-in-business-history/april/apple-computer-founded'},
            {'title': 'Apple Inc. (AAPL) Stock Price, News, Quote & History - '
                      'Yahoo Finance',
             'imageUrl': 'https://s.yimg.com/uu/api/res/1.2/wsqdHHH05iioDnVbAb2WPQ--~B/aD01NzY7dz0xMDI0O2FwcGlkPXl0YWNoeW9u/https://media.zenfs.com/en/Benzinga/8f4e6ec4860c044f97cc63cfdd74b4f2.cf.webp',
             'link': 'https://finance.yahoo.com/quote/AAPL/'},
            {'title': 'Apple Store - Find a Store - Apple',
             'imageUrl': 'https://rtlimages.apple.com/cmc/dieter/store/16_9/R219.png?resize=672:378&output-format=jpg&output-quality=85&interpolation=progressive-bicubic',
             'link': 'https://www.apple.com/retail/'},
            {'title': 'Apple Store - Find a Store - Apple',
             'imageUrl': 'https://rtlimages.apple.com/cmc/dieter/store/16_9/R420.png?resize=672:378&output-format=jpg&output-quality=85&interpolation=progressive-bicubic',
             'link': 'https://www.apple.com/retail/'}],
 'peopleAlsoAsk': [{'question': 'What is the Apple Inc?',
                    'snippet': 'It is best known for its consumer electronics, '
                               'software, and services. Founded in 1976 as '
                               'Apple Computer Company by Steve Jobs, Steve '
                               'Wozniak and Ronald Wayne, the company was '
                               'incorporated by Jobs and Wozniak as Apple '
                               'Computer, Inc. the following year. It was '
                               'renamed Apple Inc.',
                    'title': 'Apple Inc. - Wikipedia',
                    'link': 'https://en.wikipedia.org/wiki/Apple_Inc.'},
                   {'question': 'Is Apple an LLC or Inc.?',
                    'snippet': 'Apple Inc., located at One Apple Park Way, '
                               'Cupertino, California, for users in the United '
                               'States, including Puerto Rico.',
                    'title': 'Legal - Privacy Policy Affiliated Company - '
                             'Apple',
                    'link': 'https://www.apple.com/legal/privacy/en-ww/affiliated-company/'}],
 'relatedSearches': [{'query': 'apple inc คืออะไร'},
                     {'query': 'Apple Inc full form'},
                     {'query': 'Apple Inc address'},
                     {'query': 'Apple Inc investor relations'},
                     {'query': 'Apple Inc industry'},
                     {'query': 'Apple Inc careers'},
                     {'query': 'Apple Inc Net worth'}],
 'credits': 1}
```

## 搜索 Google 图片

我们也可以使用此包装器查询 Google 图片。例如：

```python
search = GoogleSerperAPIWrapper(type="images")
results = search.results("Lion")
pprint.pp(results)
```

```text
{'searchParameters': {'q': 'Lion',
'gl': 'us',
'hl': 'en',
'type': 'images',
'num': 10,
'engine': 'google'},
 'images': [{'title': 'Lion - Wikipedia',
'imageUrl': 'https://upload.wikimedia.org/wikipedia/commons/a/a6/020_The_lion_king_Snyggve_in_the_Serengeti_National_Park_Photo_by_Giles_Laurent.jpg',
'imageWidth': 5168,
'imageHeight': 3448,
'thumbnailUrl': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_HGdbfaRDdKJpWDDdD0AkS58dHashCEbqH9yTMz4j7lQIC6iD&s',
'thumbnailWidth': 275,
'thumbnailHeight': 183,
'source': 'Wikipedia',
'domain': 'en.wikipedia.org',
'link': 'https://en.wikipedia.org/wiki/Lion',
'googleUrl': 'https://www.google.com/imgres?imgurl=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fa%2Fa6%2F020_The_lion_king_Snyggve_in_the_Serengeti_National_Park_Photo_by_Giles_Laurent.jpg&tbnid=iu_QQ3Z8fGxRvM&imgrefurl=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FLion&docid=0P9ZPIi_HU4dMM&w=5168&h=3448&ved=0ahUKEwjl5-H3hfmMAxUMvokEHY6wD3gQvFcIAigA',
'position': 1},
{'title': 'Lion | Characteristics, Habitat, & Facts | Britannica',
'imageUrl': 'https://cdn.britannica.com/29/150929-050-547070A1/lion-Kenya-Masai-Mara-National-Reserve.jpg',
'imageWidth': 1600,
'imageHeight': 1085,
'thumbnailUrl': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCqaKY_THr0IBZN8c-2VApnnbuvKmnsWjfrwKoWHFR9w3eN5o&s',
'thumbnailWidth': 273,
'thumbnailHeight': 185,
'source': 'Britannica',
'domain': 'www.britannica.com',
'link': 'https://www.britannica.com/animal/lion',
'googleUrl': 'https://www.google.com/imgres?imgurl=https%3A%2F%2Fcdn.britannica.com%2F29%2F150929-050-547070A1%2Flion-Kenya-Masai-Mara-National-Reserve.jpg&tbnid=DBk5Qx3rVV587M&imgrefurl=https%3A%2F%2Fwww.britannica.com%2Fanimal%2Flion&docid=Zp2R2-BbubSvqM&w=1600&h=1085&ved=0ahUKEwjl5-H3hfmMAxUMvokEHY6wD3gQvFcIAygB',
'position': 2},
{'title': 'Lion',
'imageUrl': 'https://i.natgeofe.com/k/1d33938b-3d02-4773-91e3-70b113c3b8c7/lion-male-roar.jpg?wp=1&w=1084.125&h=609',
'imageWidth': 1083,
'imageHeight': 609,
'thumbnailUrl': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDDPsOQpmuAhyuNY28gdM0msnIfqxIlLi01CudMaojO5w0xmM&s',
'thumbnailWidth': 300,
'thumbnailHeight': 168,
'source': 'National Geographic Kids',
'domain': 'kids.nationalgeographic.com',
'link': 'https://kids.nationalgeographic.com/animals/mammals/facts/lion',
'googleUrl': 'https://www.google.com/imgres?imgurl=https%3A%2F%2Fi.natgeofe.com%2Fk%2F1d33938b-3d02-4773-91e3-70b113c3b8c7%2Flion-male-roar.jpg%3Fwp%3D1%26w%3D1084.125%26h%3D609&tbnid=P9Vzzl57Ow4obM&imgrefurl=https%3A%2F%2Fkids.nationalgeographic.com%2Fanimals%2Fmammals%2Ffacts%2Flion&docid=r48PKzcCogU0oM&w=1083&h=609&ved=0ahUKEwjl5-H3hfmMAxUMvokEHY6wD3gQvFcIBCgC',
'position': 3},
{'title': 'Lion | Characteristics, Habitat, & Facts | Britannica',
'imageUrl': 'https://cdn.britannica.com/30/150930-120-D3D93F1E/lion-panthea-leo-Namibia.jpg',
'imageWidth': 900,
'imageHeight': 675,
'thumbnailUrl': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYxxLBZ8F_59YdYFJu6y8Zfhf64kMNbrD94uNF0gj9Wgtr4B2k&s',
'thumbnailWidth': 259,
'thumbnailHeight': 194,
'source': 'Britannica',
'domain': 'www.britannica.com',
'link': 'https://www.britannica.com/animal/lion',
'googleUrl': 'https://www.google.com/imgres?imgurl=https%3A%2F%2Fcdn.britannica.com%2F30%2F150930-120-D3D93F1E%2Flion-panthea-leo-Nam
