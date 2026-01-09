---
title: JSON 工具包
---
本笔记本展示了一个与大型 `JSON/dict` 对象交互的智能体（agent）。
当您需要回答关于 JSON 数据块的问题，而该数据块太大无法放入 LLM 的上下文窗口时，这非常有用。智能体能够迭代地探索数据块，以找到回答用户问题所需的信息。

在下面的示例中，我们使用 OpenAI API 的 OpenAPI 规范，您可以在[这里](https://github.com/openai/openai-openapi/blob/master/openapi.yaml)找到它。

我们将使用 JSON 智能体来回答一些关于该 API 规范的问题。

```python
pip install -qU langchain-community
```

## 初始化

```python
import yaml
from langchain_community.agent_toolkits import JsonToolkit, create_json_agent
from langchain_community.tools.json.tool import JsonSpec
from langchain_openai import OpenAI
```

```python
with open("openai_openapi.yml") as f:
    data = yaml.load(f, Loader=yaml.FullLoader)
json_spec = JsonSpec(dict_={}, max_value_length=4000)
json_toolkit = JsonToolkit(spec=json_spec)

json_agent_executor = create_json_agent(
    llm=OpenAI(temperature=0), toolkit=json_toolkit, verbose=True
)
```

## 单个工具

让我们看看 Jira 工具包内部有哪些独立的工具。

```python
[(el.name, el.description) for el in json_toolkit.get_tools()]
```

```text
[('json_spec_list_keys',
  '\n    Can be used to list all keys at a given path. \n    Before calling this you should be SURE that the path to this exists.\n    The input is a text representation of the path to the dict in Python syntax (e.g. data["key1"][0]["key2"]).\n    '),
 ('json_spec_get_value',
  '\n    Can be used to see value in string format at a given path.\n    Before calling this you should be SURE that the path to this exists.\n    The input is a text representation of the path to the dict in Python syntax (e.g. data["key1"][0]["key2"]).\n    ')]
```

## 示例：获取请求所需的 POST 参数

```python
json_agent_executor.run(
    "What are the required parameters in the request body to the /completions endpoint?"
)
```

```text
> Entering new AgentExecutor chain...
Action: json_spec_list_keys
Action Input: data
Observation: ['openapi', 'info', 'servers', 'tags', 'paths', 'components', 'x-oaiMeta']
Thought: I should look at the paths key to see what endpoints exist
Action: json_spec_list_keys
Action Input: data["paths"]
Observation: ['/engines', '/engines/{engine_id}', '/completions', '/edits', '/images/generations', '/images/edits', '/images/variations', '/embeddings', '/engines/{engine_id}/search', '/files', '/files/{file_id}', '/files/{file_id}/content', '/answers', '/classifications', '/fine-tunes', '/fine-tunes/{fine_tune_id}', '/fine-tunes/{fine_tune_id}/cancel', '/fine-tunes/{fine_tune_id}/events', '/models', '/models/{model}', '/moderations']
Thought: I should look at the /completions endpoint to see what parameters are required
Action: json_spec_list_keys
Action Input: data["paths"]["/completions"]
Observation: ['post']
Thought: I should look at the post key to see what parameters are required
Action: json_spec_list_keys
Action Input: data["paths"]["/completions"]["post"]
Observation: ['operationId', 'tags', 'summary', 'requestBody', 'responses', 'x-oaiMeta']
Thought: I should look at the requestBody key to see what parameters are required
Action: json_spec_list_keys
Action Input: data["paths"]["/completions"]["post"]["requestBody"]
Observation: ['required', 'content']
Thought: I should look at the required key to see what parameters are required
Action: json_spec_get_value
Action Input: data["paths"]["/completions"]["post"]["requestBody"]["required"]
Observation: True
Thought: I should look at the content key to see what parameters are required
Action: json_spec_list_keys
Action Input: data["paths"]["/completions"]["post"]["requestBody"]["content"]
Observation: ['application/json']
Thought: I should look at the application/json key to see what parameters are required
Action: json_spec_list_keys
Action Input: data["paths"]["/completions"]["post"]["requestBody"]["content"]["application/json"]
Observation: ['schema']
Thought: I should look at the schema key to see what parameters are required
Action: json_spec_list_keys
Action Input: data["paths"]["/completions"]["post"]["requestBody"]["content"]["application/json"]["schema"]
Observation: ['$ref']
Thought: I should look at the $ref key to see what parameters are required
Action: json_spec_get_value
Action Input: data["paths"]["/completions"]["post"]["requestBody"]["content"]["application/json"]["schema"]["$ref"]
Observation: #/components/schemas/CreateCompletionRequest
Thought: I should look at the CreateCompletionRequest schema to see what parameters are required
Action: json_spec_list_keys
Action Input: data["components"]["schemas"]["CreateCompletionRequest"]
Observation: ['type', 'properties', 'required']
Thought: I should look at the required key to see what parameters are required
Action: json_spec_get_value
Action Input: data["components"]["schemas"]["CreateCompletionRequest"]["required"]
Observation: ['model']
Thought: I now know the final answer
Final Answer: The required parameters in the request body to the /completions endpoint are 'model'.

> Finished chain.
```

```text
"The required parameters in the request body to the /completions endpoint are 'model'."
```

```python

```
