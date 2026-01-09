---
title: ChatGPT 插件
---

<Warning>

<strong>已弃用</strong>

OpenAI 已[弃用插件](https://openai.com/index/chatgpt-plugins/)。

</Warning>

本示例展示了如何在 LangChain 抽象层中使用 ChatGPT 插件。

注意 1：目前这仅适用于无需身份验证的插件。

注意 2：几乎肯定有其他方法可以实现此功能，这只是初步尝试。如果您有更好的想法，请提交 PR！

```python
pip install -qU langchain-community
```

```python
from langchain_community.tools import AIPluginTool
```

```python
from langchain.agents import AgentType, initialize_agent, load_tools
from langchain_openai import ChatOpenAI
```

```python
tool = AIPluginTool.from_plugin_url("https://www.klarna.com/.well-known/ai-plugin.json")
```

```python
llm = ChatOpenAI(temperature=0)
tools = load_tools(["requests_all"])
tools += [tool]

agent_chain = initialize_agent(
    tools, llm, agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION, verbose=True
)
agent_chain.run("what t shirts are available in klarna?")
```

```text
> Entering new AgentExecutor chain...
我需要检查 Klarna 购物 API，看看是否有关于可用 T 恤的信息。
Action: KlarnaProducts
Action Input: None
Observation: 使用指南：使用 Klarna 插件获取任何购物或研究目的的相关产品建议。发送的查询不应包含停用词，如冠词、介词和限定词。当搜索与产品相关的词语（如产品名称、品牌、型号或类别）时，API 效果最佳。链接将始终返回并应展示给用户。

OpenAPI 规范: {'openapi': '3.0.1', 'info': {'version': 'v0', 'title': 'Open AI Klarna product Api'}, 'servers': [{'url': 'https://www.klarna.com/us/shopping'}], 'tags': [{'name': 'open-ai-product-endpoint', 'description': 'Open AI Product Endpoint. Query for products.'}], 'paths': {'/public/openai/v0/products': {'get': {'tags': ['open-ai-product-endpoint'], 'summary': 'API for fetching Klarna product information', 'operationId': 'productsUsingGET', 'parameters': [{'name': 'q', 'in': 'query', 'description': 'query, must be between 2 and 100 characters', 'required': True, 'schema': {'type': 'string'}}, {'name': 'size', 'in': 'query', 'description': 'number of products returned', 'required': False, 'schema': {'type': 'integer'}}, {'name': 'budget', 'in': 'query', 'description': 'maximum price of the matching product in local currency, filters results', 'required': False, 'schema': {'type': 'integer'}}], 'responses': {'200': {'description': 'Products found', 'content': {'application/json': {'schema': {'$ref': '#/components/schemas/ProductResponse'}}}}, '503': {'description': 'one or more services are unavailable'}}, 'deprecated': False}}}, 'components': {'schemas': {'Product': {'type': 'object', 'properties': {'attributes': {'type': 'array', 'items': {'type': 'string'}}, 'name': {'type': 'string'}, 'price': {'type': 'string'}, 'url': {'type': 'string'}}, 'title': 'Product'}, 'ProductResponse': {'type': 'object', 'properties': {'products': {'type': 'array', 'items': {'$ref': '#/components/schemas/Product'}}}, 'title': 'ProductResponse'}}}}
Thought: 我需要使用 Klarna 购物 API 来搜索 T 恤。
Action: requests_get
Action Input: https://www.klarna.com/us/shopping/public/openai/v0/products?q=t%20shirts
Observation: {"products":[{"name":"Lacoste Men's Pack of Plain T-Shirts","url":"https://www.klarna.com/us/shopping/pl/cl10001/3202043025/Clothing/Lacoste-Men-s-Pack-of-Plain-T-Shirts/?utm_source=openai","price":"$26.60","attributes":["Material:Cotton","Target Group:Man","Color:White,Black"]},{"name":"Hanes Men's Ultimate 6pk. Crewneck T-Shirts","url":"https://www.klarna.com/us/shopping/pl/cl10001/3201808270/Clothing/Hanes-Men-s-Ultimate-6pk.-Crewneck-T-Shirts/?utm_source=openai","price":"$13.82","attributes":["Material:Cotton","Target Group:Man","Color:White"]},{"name":"Nike Boy's Jordan Stretch T-shirts","url":"https://www.klarna.com/us/shopping/pl/cl359/3201863202/Children-s-Clothing/Nike-Boy-s-Jordan-Stretch-T-shirts/?utm_source=openai","price":"$14.99","attributes":["Material:Cotton","Color:White,Green","Model:Boy","Size (Small-Large):S,XL,L,M"]},{"name":"Polo Classic Fit Cotton V-Neck T-Shirts 3-Pack","url":"https://www.klarna.com/us/shopping/pl/cl10001/3203028500/Clothing/Polo-Classic-Fit-Cotton-V-Neck-T-Shirts-3-Pack/?utm_source=openai","price":"$29.95","attributes":["Material:Cotton","Target Group:Man","Color:White,Blue,Black"]},{"name":"adidas Comfort T-shirts Men's 3-pack","url":"https://www.klarna.com/us/shopping/pl/cl10001/3202640533/Clothing/adidas-Comfort-T-shirts-Men-s-3-pack/?utm_source=openai","price":"$14.99","attributes":["Material:Cotton","Target Group:Man","Color:White,Black","Neckline:Round"]}]}
Thought: Klarna 上可用的 T 恤有 Lacoste Men's Pack of Plain T-Shirts, Hanes Men's Ultimate 6pk. Crewneck T-Shirts, Nike Boy's Jordan Stretch T-shirts, Polo Classic Fit Cotton V-Neck T-Shirts 3-Pack, 和 adidas Comfort T-shirts Men's 3-pack。
Final Answer: Klarna 上可用的 T 恤有 Lacoste Men's Pack of Plain T-Shirts, Hanes Men's Ultimate 6pk. Crewneck T-Shirts, Nike Boy's Jordan Stretch T-shirts, Polo Classic Fit Cotton V-Neck T-Shirts 3-Pack, 和 adidas Comfort T-shirts Men's 3-pack。

> Finished chain.
```

```text
"The available t shirts in Klarna are Lacoste Men's Pack of Plain T-Shirts, Hanes Men's Ultimate 6pk. Crewneck T-Shirts, Nike Boy's Jordan Stretch T-shirts, Polo Classic Fit Cotton V-Neck T-Shirts 3-Pack, and adidas Comfort T-shirts Men's 3-pack."
```

```python

```
