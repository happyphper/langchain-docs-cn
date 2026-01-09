---
title: Bearly 代码解释器
---
> Bearly 代码解释器支持远程执行代码。这使其成为智能体（agent）的完美代码沙箱，可以安全地实现诸如代码解释器之类的功能。

在此获取您的 API 密钥：[bearly.ai/dashboard/developers](https://bearly.ai/dashboard/developers)

```python
pip install -qU langchain-community
```

在本笔记本中，我们将创建一个使用 Bearly 与数据交互的智能体示例。

```python
from langchain_community.tools import BearlyInterpreterTool
```

```python
from langchain.agents import AgentType, initialize_agent
from langchain_openai import ChatOpenAI
```

初始化解释器

```python
bearly_tool = BearlyInterpreterTool(api_key="...")
```

让我们向沙箱中添加一些文件

```python
bearly_tool.add_file(
    source_path="sample_data/Bristol.pdf", target_path="Bristol.pdf", description=""
)
bearly_tool.add_file(
    source_path="sample_data/US_GDP.csv", target_path="US_GDP.csv", description=""
)
```

现在创建一个 `Tool` 对象。这是必要的，因为我们已经添加了文件，我们希望工具描述能反映这一点。

```python
tools = [bearly_tool.as_tool()]
```

```python
tools[0].name
```

```text
'bearly_interpreter'
```

```python
print(tools[0].description)
```

```text
在沙箱环境中评估 Python 代码。每次执行时环境都会重置。您必须每次都发送完整的脚本并打印输出。脚本应为可评估的纯 Python 代码，格式应为 Python 格式而非 Markdown。代码不应包裹在反引号中。所有 Python 包，包括 requests、matplotlib、scipy、numpy、pandas 等均可用。如果有任何文件输出，请将其写入执行路径相对的 "output/" 目录。输出只能从目录、stdout 和 stdin 读取。不要使用像 plot.show() 这样的方法，因为它不会生效，而是将它们写入 `output/` 目录，并会返回一个文件链接。使用 print() 打印任何输出和结果，以便捕获输出。

评估环境中可用的文件如下：
- 路径：`Bristol.pdf`
 前四行：[]
 描述：``
- 路径：`US_GDP.csv`
 前四行：['DATE,GDP\n', '1947-01-01,243.164\n', '1947-04-01,245.968\n', '1947-07-01,249.585\n']
 描述：``
```

初始化一个智能体

```python
llm = ChatOpenAI(model="gpt-4", temperature=0)
agent = initialize_agent(
    tools,
    llm,
    agent=AgentType.OPENAI_FUNCTIONS,
    verbose=True,
    handle_parsing_errors=True,
)
```

```python
# 提取 PDF 内容
agent.run("What is the text on page 3 of the pdf?")
```

```python
> Entering new AgentExecutor chain...

Invoking: `bearly_interpreter` with `{'python_code': "import PyPDF2\n\n# Open the PDF file in read-binary mode\npdf_file = open('Bristol.pdf', 'rb')\n\n# Create a PDF file reader object\npdf_reader = PyPDF2.PdfFileReader(pdf_file)\n\n# Get the text from page 3\npage_obj = pdf_reader.getPage(2)\npage_text = page_obj.extractText()\n\n# Close the PDF file\npdf_file.close()\n\nprint(page_text)"}`

{'stdout': '', 'stderr': 'Traceback (most recent call last):\n  File "/tmp/project/main.py", line 7, in <module>\n    pdf_reader = PyPDF2.PdfFileReader(pdf_file)\n  File "/venv/lib/python3.10/site-packages/PyPDF2/_reader.py", line 1974, in __init__\n    deprecation_with_replacement("PdfFileReader", "PdfReader", "3.0.0")\n  File "/venv/lib/python3.10/site-packages/PyPDF2/_utils.py", line 369, in deprecation_with_replacement\n    deprecation(DEPR_MSG_HAPPENED.format(old_name, removed_in, new_name))\n  File "/venv/lib/python3.10/site-packages/PyPDF2/_utils.py", line 351, in deprecation\n    raise DeprecationError(msg)\nPyPDF2.errors.DeprecationError: PdfFileReader is deprecated and was removed in PyPDF2 3.0.0. Use PdfReader instead.\n', 'fileLinks': [], 'exitCode': 1}
Invoking: `bearly_interpreter` with `{'python_code': "from PyPDF2 import PdfReader\n\n# Open the PDF file\npdf = PdfReader('Bristol.pdf')\n\n# Get the text from page 3\npage = pdf.pages[2]\npage_text = page.extract_text()\n\nprint(page_text)"}`

{'stdout': '1 COVID-19 at Work: \nExposing h ow risk is assessed and its consequences in England and Sweden \nPeter Andersson and Tonia Novitz* \n1.Introduction\nT\nhe crisis which arose suddenly at the beginning of 2020 relating to coronavirus was immediately \ncentred on risk. Predictions ha d to be made swiftly regarding how it would spread, who it might \naffect and what measures could be taken to prevent exposure in everyday so cial interaction, \nincluding in the workplace. This was in no way a straightforward assessment, because initially so \nmuch was unknown. Those gaps in our knowledge have since, partially, been ameliorated. It is \nevident that not all those exposed to COVID-19 become ill, and many who contract the virus remain \nasymptomatic, so that the odds on becoming seriously ill may seem small. But those odds are also stacked against certain segments of the population. The likelihood of mortality and morbidity are associated  with age and ethnicity as well as pre -existing medical conditions (such as diabetes), but \nalso with poverty which correlates to the extent of exposure in certain occupations.\n1 Some risks \narise which remain  less predictable, as previously healthy people with no signs of particular \nvulnerability can experience serious long term illness as well and in rare cases will even die.2 \nPerceptions of risk in different countries have led to particular measures taken, ranging from handwashing to social distancing, use of personal protective equipment (PPE) such as face coverings, and even ‘lockdowns’ which have taken various forms.\n3 Use of testing and vaccines \nalso bec ame part of the remedial landscape, with their availability and administration  being \n*This paper is part of the project An  i nclusive and sustainable Swedish labour law – the way\nahead, dnr. 2017-03134 financed by the Swedish research council led by Petra Herzfeld Olssonat Stockholm University. The authors would like to thank her and other participants, Niklas\nBruun and Erik Sjödin for their helpful comments on earlier drafts. A much shorter article titled\n‘Risk Assessment and COVID -19: Systems at work (or not) in England and Sweden’ is published\nin the (2021) Comparative Labour and Social Security Review /\n Revue de droit comparé du\ntravail et de la sécurité sociale.\n1 Public Health England, Disparities in the risk and outcomes of COVID-19 (2 June 2020 -\nhttps://assets.publishing.service.gov.uk/government/uploads/ system /uploads/attachment_data/file\n/890258/disparities_review.pdf.\n2 Nisreen A. Alwan, ‘Track COVID- 19 sickness, not just positive tests and deaths’ ( 2020)\n584.7820 Nature  170- 171; Elisabeth Mahase, ‘Covid-19: What do we know about “long covid”?’\n(2020) BMJ  370.\n3 Sarah Dryhurst, Claudia R. Schneider, John Kerr, Alexandra LJ Freeman, Gabriel Recchia,\nAnne Marthe Van Der Bles, David Spiegelhalter, and Sander van der Linden, ‘Risk perceptionsof COVID-19 around the world’ (2020) 23(7- 8) Journal of Risk Research  994; Wändi Bruine de\nBruin, and Daniel Bennett, ‘Relationships between initial COVID -19 risk perceptions and\nprotective health behaviors: A national survey’ (2020) 59(2) American Journal of Prev entive\nMedicine  157; and Simon Deakin and Gaofeng Meng, ‘The Governance of Covid- 19:\nAnthropogenic Risk, Evolutionary Learning, and the Future of the Social State’ (2020)49(4) Industrial Law Journal  539.\n', 'stderr': '', 'fileLinks': [], 'exitCode': 0}PDF 第 3 页的文本是：

"1 COVID-19 at Work:
Exposing how risk is assessed and its consequences in England and Sweden
Peter Andersson and Tonia Novitz*
1.Introduction
The crisis which arose suddenly at the beginning of 2020 relating to coronavirus was immediately
centred on risk. Predictions had to be made swiftly regarding how it would spread, who it might
affect and what measures could be taken to prevent exposure in everyday social interaction,
including in the workplace. This was in no way a straightforward assessment, because initially so
much was unknown. Those gaps in our knowledge have since, partially, been ameliorated. It is
evident that not all those exposed to COVID-19 become ill, and many who contract the virus remain
asymptomatic, so that the odds on becoming seriously ill may seem small. But those odds are also stacked against certain segments of the population. The likelihood of mortality and morbidity are associated  with age and ethnicity as well as pre-existing medical conditions (such as diabetes), but
also with poverty which correlates to the extent of exposure in certain occupations.
1 Some risks
arise which remain  less predictable, as previously healthy people with no signs of particular
vulnerability can experience serious long term illness as well and in rare cases will even die.2
Perceptions of risk in different countries have led to particular measures taken, ranging from handwashing to social distancing, use of personal protective equipment (PPE) such as face coverings, and even ‘lockdowns’ which have taken various forms.
3 Use of testing and vaccines
also became part of the remedial landscape, with their availability and administration  being
*This paper is part of the project An  inclusive and sustainable Swedish labour law – the way
ahead, dnr. 2017-03134 financed by the Swedish research council led by Petra Herzfeld Olssonat Stockholm University. The authors would like to thank her and other participants, Niklas
Bruun and Erik Sjödin for their helpful comments on earlier drafts. A much shorter article titled
‘Risk Assessment and COVID -19: Systems at work (or not) in England and Sweden’ is published
in the (2021) Comparative Labour and Social Security Review /
 Revue de droit comparé du
travail et de la sécurité sociale.
1 Public Health England, Disparities in the risk and outcomes of COVID-19 (2 June 2020 -
https://assets.publishing.service.gov.uk/government/uploads/ system /uploads/attachment_data/file
/890258/disparities_review.pdf.
2 Nisreen A. Alwan, ‘Track COVID- 19 sickness, not just positive tests and deaths’ ( 2020)
584.7820 Nature  170- 171; Elisabeth Mahase, ‘Covid-19: What do we know about “long covid”?’
(2020) BMJ  370.
3 Sarah Dryhurst, Claudia R. Schneider, John Kerr, Alexandra LJ Freeman, Gabriel Recchia,
Anne Marthe Van Der Bles, David Spiegelhalter, and Sander van der Linden, ‘Risk perceptionsof COVID-19 around the world’ (2020) 23(7- 8) Journal of Risk Research  994; Wändi Bruine de
Bruin, and Daniel Bennett, ‘Relationships between initial COVID -19 risk perceptions and
protective health behaviors: A national survey’ (2020) 59(2) American Journal of Preventive
Medicine  157; and Simon Deakin and Gaofeng Meng, ‘The Governance of Covid- 19:
Anthropogenic Risk, Evolutionary Learning, and the Future of the Social State’ (2020)49(4) Industrial Law Journal  539."

> Finished chain.
```

```text
'The text on page 3 of the PDF is:\n\n"1 COVID-19 at Work: \nExposing how risk is assessed and its consequences in England and Sweden \nPeter Andersson and Tonia Novitz* \n1.Introduction\nThe crisis which arose suddenly at the beginning of 2020 relating to coronavirus was immediately \ncentred on risk. Predictions had to be made swiftly regarding how it would spread, who it might \naffect and what measures could be taken to prevent exposure in everyday social interaction, \nincluding in the workplace. This was in no way a straightforward assessment, because initially so \nmuch was unknown. Those gaps in our knowledge have since, partially, been ameliorated. It is \nevident that not all those exposed to COVID-19 become ill, and many who contract the virus remain \nasymptomatic, so that the odds on becoming seriously ill may seem small. But those odds are also stacked against certain segments of the population. The likelihood of mortality and morbidity are associated  with age and ethnicity as well as pre-existing medical conditions (such as diabetes), but \nalso with poverty which correlates to the extent of exposure in certain occupations.\n1 Some risks \narise which remain  less predictable, as previously healthy people with no signs of particular \nvulnerability can experience serious long term illness as well and in rare cases will even die.2 \nPerceptions of risk in different countries have led to particular measures taken, ranging from handwashing to social distancing, use of personal protective equipment (PPE) such as face coverings, and even ‘lockdowns’ which have taken various forms.\n3 Use of testing and vaccines \nalso became part of the remedial landscape, with their availability and administration  being \n*This paper is part of the project An  inclusive and sustainable Swedish labour law – the way\nahead, dnr. 2017-03134 financed by the Swedish research council led by Petra Herzfeld Olssonat Stockholm University. The authors would like to thank her and other participants, Niklas\nBruun and Erik Sjödin for their helpful comments on earlier drafts. A much shorter article titled\n‘Risk Assessment and COVID -19: Systems at work (or not) in England and Sweden’ is published\nin the (2021) Comparative Labour and Social Security Review /\n Revue de droit comparé du\ntravail et de la sécurité sociale.\n1 Public Health England, Disparities in the risk and outcomes of COVID-19 (2 June 2020 -\nhttps://assets.publishing.service.gov.uk/government/uploads/ system /uploads/attachment_data/file\n/890258/disparities_review.pdf.\n2 Nisreen A. Alwan, ‘Track COVID- 19 sickness, not just positive tests and deaths’ ( 2020)\n584.7820 Nature  170- 171; Elisabeth Mahase, ‘Covid-19: What do we know about “long covid”?’\n(2020) BMJ  370.\n3 Sarah Dryhurst, Claudia R. Schneider, John Kerr, Alexandra LJ Freeman, Gabriel Recchia,\nAnne Marthe Van Der Bles, David Spiegelhalter, and Sander van der Linden, ‘Risk perceptionsof COVID-19 around the world’ (2020) 23(7- 8) Journal of Risk Research  994; Wändi Bruine de\nBruin, and Daniel Bennett, ‘Relationships between initial COVID -19 risk perceptions and\nprotective health behaviors: A national survey’ (2020) 59(2) American Journal of Preventive\nMedicine  157; and Simon Deakin and Gaofeng Meng, ‘The Governance of Covid- 19:\nAnthropogenic Risk, Evolutionary Learning, and the Future of the Social State’ (2020)49(4) Industrial Law Journal  539."'
```

```python
# 简单查询
agent.run("What was the US GDP in 2019?")
```

```text
> Entering new AgentExecutor chain...

Invoking: `bearly_interpreter` with `{'python_code': "import pandas as pd\n\n# Load the data\nus_gdp = pd.read_csv('US_GDP.csv')\n\n# Convert the 'DATE' column to datetime\nus_gdp['DATE'] = pd.to_datetime(us_gdp['DATE'])\n\n# Filter the data for the year 2019\nus_gdp_2019 = us_gdp[us_gdp['DATE'].dt.year == 2019]\n\n# Print the GDP for 2019\nprint(us_gdp_2019['GDP'].values)"}`

{'stdout': '[21104.133 21384.775 21694.282 21902.39 ]\n', 'stderr': '', 'fileLinks': [], 'exitCode': 0}2019 年各季度的美国 GDP 如下：

- 第一季度：21104.1330 亿美元
- 第二季度：21384.7750 亿美元
- 第三季度：21694.2820 亿美元
- 第四季度：21902.3900 亿美元

> Finished chain.
```

```text
'The US GDP for each quarter in 2019 was as follows:\n\n- Q1: 21104.133 billion dollars\n- Q2: 21384.775 billion dollars\n- Q3: 21694.282 billion dollars\n- Q4: 21902.39 billion dollars'
```

```python
# 计算
agent.run("What would the GDP be in 2030 if the latest GDP number grew by 50%?")
```

```text
> Entering new AgentExecutor chain...

Invoking: `bearly_interpreter` with `{'python_code': "import pandas as pd\n\n# Load the data\nus_gdp = pd.read_csv('US_GDP.csv')\n\n# Get the latest GDP\nlatest_gdp = us_gdp['GDP'].iloc[-1]\n\n# Calculate the GDP in 2030 if the latest GDP number grew by 50%\ngdp_2030 = latest_gdp * 1.5\nprint(gdp_2030)"}`

{'stdout': '40594.518\n', 'stderr': '', 'fileLinks': [], 'exitCode': 0}如果最新的 GDP 数字增长 50%，那么 2030 年的 GDP
