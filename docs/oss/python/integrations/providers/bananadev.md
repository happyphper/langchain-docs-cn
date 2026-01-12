---
title: BananaDev
---
>[Banana](https://www.banana.dev/) 为 AI 模型提供无服务器 GPU 推理、CI/CD 构建流水线以及一个简单的 Python 框架 (`Potassium`) 来部署您的模型。

本页介绍了如何在 LangChain 中使用 [Banana](https://www.banana.dev) 生态系统。

## 安装与设置

- 安装 Python 包 `banana-dev`：

::: code-group

```bash [pip]
pip install banana-dev
```

```bash [uv]
uv add banana-dev
```

:::

- 从 [Banana.dev 仪表板](https://app.banana.dev) 获取 Banana API 密钥，并将其设置为环境变量 (`BANANA_API_KEY`)。
- 从模型的详情页面获取您的模型密钥和 URL 别名。

## 定义您的 Banana 模板

您需要为您的 Banana 应用设置一个 GitHub 仓库。您可以使用 [本指南](https://docs.banana.dev/banana-docs/) 在 5 分钟内快速上手。

或者，对于一个开箱即用的 LLM 示例，您可以查看 Banana 的 [CodeLlama-7B-Instruct-GPTQ](https://github.com/bananaml/demo-codellama-7b-instruct-gptq) GitHub 仓库。只需 fork 它并在 Banana 内部署即可。

其他入门仓库可在 [此处](https://github.com/orgs/bananaml/repositories?q=demo-&type=all&language=&sort=) 找到。

## 构建 Banana 应用

要在 LangChain 中使用 Banana 应用，您必须在返回的 JSON 中包含 `outputs` 键，并且其值必须是字符串。

```python
# 将结果作为字典返回
result = {'outputs': result}
```

一个推理函数的示例如下：

```python
@app.handler("/")
def handler(context: dict, request: Request) -> Response:
    """Handle a request to generate code from a prompt."""
    model = context.get("model")
    tokenizer = context.get("tokenizer")
    max_new_tokens = request.json.get("max_new_tokens", 512)
    temperature = request.json.get("temperature", 0.7)
    prompt = request.json.get("prompt")
    prompt_template=f'''[INST] Write code to solve the following coding problem that obeys the constraints and passes the example test cases. Please wrap your code answer using ```:
    {prompt}
    [/INST]
    '''
    input_ids = tokenizer(prompt_template, return_tensors='pt').input_ids.cuda()
    output = model.generate(inputs=input_ids, temperature=temperature, max_new_tokens=max_new_tokens)
    result = tokenizer.decode(output[0])
    return Response(json={"outputs": result}, status=200)
```

此示例来自 [CodeLlama-7B-Instruct-GPTQ](https://github.com/bananaml/demo-codellama-7b-instruct-gptq) 中的 `app.py` 文件。

## LLM

```python
from langchain_community.llms import Banana
```

查看 [使用示例](/oss/python/integrations/llms/banana)。
