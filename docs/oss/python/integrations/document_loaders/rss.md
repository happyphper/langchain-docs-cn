---
title: RSS 订阅源
---
本文介绍了如何从一系列 RSS 订阅源 URL 加载 HTML 新闻文章，并将其转换为可用于下游处理的文档格式。

```python
pip install -qU  feedparser newspaper3k listparser
```

```python
from langchain_community.document_loaders import RSSFeedLoader
```

```python
urls = ["https://news.ycombinator.com/rss"]
```

传入 URL 以将其加载到 Document 中

```python
loader = RSSFeedLoader(urls=urls)
data = loader.load()
print(len(data))
```

```python
print(data[0].page_content)
```

```text
(next Rich)

04 August 2023

Rich Hickey

今天，我怀着复杂的心情宣布（这是早已计划的）我从商业软件开发领域退休，并离开我在 Nubank 的职位。看到 Clojure 和 Datomic 在大规模应用中取得成功，这令人激动不已。

我期待继续与 Alex、Stu、Fogus 以及许多其他人一起，作为一名独立的开发者，领导 Clojure 的维护和增强工作。我们为 1.12 及后续版本规划了许多有用的功能。社区依然友好、成熟且富有成效，并正在将 Clojure 带入许多有趣的新领域。

我想特别强调并感谢 Nubank 对 Alex、Fogus 以及核心团队乃至整个 Clojure 社区的持续赞助。

Stu 将继续在 Nubank 领导 Datomic 的开发工作，Datomic 团队在那里不断壮大和蓬勃发展。我对 Datomic 新的免费可用性将带来的前景感到特别兴奋。

我在 Cognitect 的时光是我职业生涯的亮点。我从团队中的每一个人身上都学到了东西，并对我们所有的互动永远心怀感激。要感谢的人太多，但我必须向 Stu 和 Justin 表达我最诚挚的感激和爱意，感谢他们（多次）对我及我的想法给予信任，并始终是最好的伙伴和朋友，充分体现了正直的理念。当然还有 Alex Miller——他拥有许多我所缺乏的技能，没有他那不屈不挠的精神、积极的态度和友谊，Clojure 就不会取得今天的成就。

通过 Clojure 和 Cognitect，我结交了许多朋友，我希望在未来能继续培育这些友谊。

退休让我回到了最初开发 Clojure 时所拥有的自由和独立。旅程仍在继续！
```

你可以向 NewsURLLoader 传递参数，这些参数将用于加载文章。

```python
loader = RSSFeedLoader(urls=urls, nlp=True)
data = loader.load()
print(len(data))
```

```text
Error fetching or processing https://twitter.com/andrewmccalip/status/1687405505604734978, exception: You must `parse()` an article first!
Error processing entry https://twitter.com/andrewmccalip/status/1687405505604734978, exception: list index out of range
```

```text
13
```

```python
data[0].metadata["keywords"]
```

```python
['nubank',
 'alex',
 'stu',
 'taking',
 'team',
 'remains',
 'rich',
 'clojure',
 'thank',
 'planned',
 'datomic']
```

```python
data[0].metadata["summary"]
```

```text
'It’s been thrilling to see Clojure and Datomic successfully applied at scale.\nI look forward to continuing to lead ongoing work maintaining and enhancing Clojure with Alex, Stu, Fogus and many others, as an independent developer once again.\nThe community remains friendly, mature and productive, and is taking Clojure into many interesting new domains.\nI want to highlight and thank Nubank for their ongoing sponsorship of Alex, Fogus and the core team, as well as the Clojure community at large.\nStu will continue to lead the development of Datomic at Nubank, where the Datomic team grows and thrives.'
```

你也可以使用 OPML 文件，例如 Feedly 的导出文件。可以传入 URL 或 OPML 内容。

```python
with open("example_data/sample_rss_feeds.opml", "r") as f:
        loader = RSSFeedLoader(opml=f.read())
data = loader.load()
print(len(data))
```

```text
Error fetching http://www.engadget.com/rss-full.xml, exception: Error fetching http://www.engadget.com/rss-full.xml, exception: document declared as us-ascii, but parsed as utf-8
```

```text
20
```

```python
data[0].page_content
```

```text
'The electric vehicle startup Fisker made a splash in Huntington Beach last night, showing off a range of new EVs it plans to build alongside the Fisker Ocean, which is slowly beginning deliveries in Europe and the US. With shades of Lotus circa 2010, it seems there\'s something for most tastes, with a powerful four-door GT, a versatile pickup truck, and an affordable electric city car.\n\n"We want the world to know that we have big plans and intend to move into several different segments, redefining each with our unique blend of design, innovation, and sustainability," said CEO Henrik Fisker.\n\nStarting with the cheapest, the Fisker PEAR—a cutesy acronym for "Personal Electric Automotive Revolution"—is said to use 35 percent fewer parts than other small EVs. Although it\'s a smaller car, the PEAR seats six thanks to front and rear bench seats. Oh, and it has a frunk, which the company is calling the "froot," something that will satisfy some British English speakers like Ars\' friend and motoring journalist Jonny Smith.\n\nBut most exciting is the price—starting at $29,900 and scheduled for 2025. Fisker plans to contract with Foxconn to build the PEAR in Lordstown, Ohio, meaning it would be eligible for federal tax incentives.\n\nAdvertisement\n\nThe Fisker Alaska is the company\'s pickup truck, built on a modified version of the platform used by the Ocean. It has an extendable cargo bed, which can be as little as 4.5 feet (1,371 mm) or as much as 9.2 feet (2,804 mm) long. Fisker claims it will be both the lightest EV pickup on sale and the most sustainable pickup truck in the world. Range will be an estimated 230–240 miles (370–386 km).\n\nThis, too, is slated for 2025, and also at a relatively affordable price, starting at $45,400. Fisker hopes to build this car in North America as well, although it isn\'t saying where that might take place.\n\nFinally, there\'s the Ronin, a four-door GT that bears more than a passing resemblance to the Fisker Karma, Henrik Fisker\'s 2012 creation. There\'s no price for this one, but Fisker says its all-wheel drive powertrain will boast 1,000 hp (745 kW) and will hit 60 mph from a standing start in two seconds—just about as fast as modern tires will allow. Expect a massive battery in this one, as Fisker says it\'s targeting a 600-mile (956 km) range.\n\n"Innovation and sustainability, along with design, are our three brand values. By 2027, we intend to produce the world’s first climate-neutral vehicle, and as our customers reinvent their relationships with mobility, we want to be a leader in software-defined transportation," Fisker said.'
```

```python

```
