---
title: 模态框
---
[Modal 云平台](https://modal.com/docs/guide) 提供了便捷、按需访问无服务器云计算的能力，可直接从您本地计算机的 Python 脚本调用。
使用 `modal` 来运行您自己的自定义 LLM 模型，而无需依赖 LLM API。

本示例将介绍如何使用 LangChain 与 `modal` 的 HTTPS [Web 端点](https://modal.com/docs/guide/webhooks) 进行交互。

[_使用 LangChain 进行问答_](https://modal.com/docs/guide/ex/potus_speech_qanda) 是另一个结合使用 LangChain 和 `Modal` 的示例。在那个示例中，Modal 端到端地运行 LangChain 应用程序，并使用 OpenAI 作为其 LLM API。

```python
pip install -qU  modal
```

```python
# 在 Modal 注册账户并获取新令牌。

!modal token new
```

```text
正在您的浏览器窗口中启动登录页面...
如果未显示，请手动将此 URL 复制到您的网络浏览器中：
https://modal.com/token-flow/tf-Dzm3Y01234mqmm1234Vcu3
```

[`langchain.llms.modal.Modal`](https://github.com/langchain-ai/langchain/blame/master/langchain/llms/modal.py) 集成类要求您部署一个 Modal 应用程序，该应用程序的 Web 端点需符合以下 JSON 接口规范：

1.  LLM 提示词作为 `"prompt"` 键下的 `str` 类型值被接收。
2.  LLM 响应作为 `"prompt"` 键下的 `str` 类型值被返回。

**请求 JSON 示例：**

```json
{
    "prompt": "Identify yourself, bot!",
    "extra": "args are allowed",
}
```

**响应 JSON 示例：**

```json
{
    "prompt": "This is the LLM speaking",
}
```

一个满足此接口的示例“虚拟” Modal Web 端点函数如下：

```python
...
...

class Request(BaseModel):
    prompt: str

@stub.function()
@modal.web_endpoint(method="POST")
def web(request: Request):
    _ = request  # ignore input
    return {"prompt": "hello world"}
```

*   有关设置满足此接口的端点的基础知识，请参阅 Modal 的 [Web 端点](https://modal.com/docs/guide/webhooks#passing-arguments-to-web-endpoints) 指南。
*   关于自定义 LLM 的起点，请参阅 Modal 的 ['使用 AutoGPTQ 运行 Falcon-40B'](https://modal.com/docs/guide/ex/falcon_gptq) 开源 LLM 示例！

一旦您部署了 Modal Web 端点，就可以将其 URL 传递给 `langchain.llms.modal.Modal` LLM 类。然后，这个类就可以作为您链中的一个构建块。

```python
from langchain_classic.chains import LLMChain
from langchain_community.llms import Modal
from langchain_core.prompts import PromptTemplate
```

```python
template = """Question: {question}

Answer: Let's think step by step."""

prompt = PromptTemplate.from_template(template)
```

```python
endpoint_url = "https://ecorp--custom-llm-endpoint.modal.run"  # 请替换为您部署的 Modal Web 端点的 URL
llm = Modal(endpoint_url=endpoint_url)
```

```python
llm_chain = LLMChain(prompt=prompt, llm=llm)
```

```python
question = "What NFL team won the Super Bowl in the year Justin Beiber was born?"

llm_chain.run(question)
```
