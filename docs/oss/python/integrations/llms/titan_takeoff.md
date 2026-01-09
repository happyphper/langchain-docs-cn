---
title: Titan Takeoff
---
`TitanML` 通过我们的训练、压缩和推理优化平台，帮助企业构建和部署更好、更小、更便宜、更快的 NLP 模型。

我们的推理服务器 [Titan Takeoff](https://docs.titanml.co/docs/intro) 只需一条命令即可在您的本地硬件上部署 LLM。它支持大多数生成式模型架构，例如 Falcon、Llama 2、GPT2、T5 等等。如果您在使用特定模型时遇到问题，请通过 [hello@titanml.co](mailto:hello@titanml.co) 告知我们。

## 使用示例

以下是一些帮助您开始使用 Titan Takeoff Server 的示例。在运行这些命令之前，您需要确保 Takeoff Server 已在后台启动。更多信息请参阅 [启动 Takeoff 的文档页面](https://docs.titanml.co/docs/Docs/launching/)。

```python
import time

# 注意：导入 TitanTakeoffPro 同样有效，两者在底层使用相同的对象
from langchain_community.llms import TitanTakeoff
from langchain_core.callbacks import CallbackManager, StreamingStdOutCallbackHandler
from langchain_core.prompts import PromptTemplate
```

### 示例 1

假设 Takeoff 在您的机器上使用默认端口（即 localhost:3000）运行，基本用法如下。

```python
llm = TitanTakeoff()
output = llm.invoke("What is the weather in London in August?")
print(output)
```

### 示例 2

指定端口和其他生成参数

```python
llm = TitanTakeoff(port=3000)
# 完整的参数列表可在 https://docs.titanml.co/docs/next/apis/Takeoff%20inference_REST_API/generate#request 找到
output = llm.invoke(
    "What is the largest rainforest in the world?",
    consumer_group="primary",
    min_new_tokens=128,
    max_new_tokens=512,
    no_repeat_ngram_size=2,
    sampling_topk=1,
    sampling_topp=1.0,
    sampling_temperature=1.0,
    repetition_penalty=1.0,
    regex_string="",
    json_schema=None,
)
print(output)
```

### 示例 3

使用 generate 处理多个输入

```python
llm = TitanTakeoff()
rich_output = llm.generate(["What is Deep Learning?", "What is Machine Learning?"])
print(rich_output.generations)
```

### 示例 4

流式输出

```python
llm = TitanTakeoff(
    streaming=True, callback_manager=CallbackManager([StreamingStdOutCallbackHandler()])
)
prompt = "What is the capital of France?"
output = llm.invoke(prompt)
print(output)
```

### 示例 5

使用 LCEL

```python
llm = TitanTakeoff()
prompt = PromptTemplate.from_template("Tell me about {topic}")
chain = prompt | llm
output = chain.invoke({"topic": "the universe"})
print(output)
```

### 示例 6

使用 TitanTakeoff Python 包装器启动读取器。如果您在首次启动 Takeoff 时没有创建任何读取器，或者想要添加另一个，可以在初始化 TitanTakeoff 对象时进行。只需将要启动的模型配置列表作为 `models` 参数传入即可。

```python
# Llama 模型的配置，您可以指定以下参数：
#   model_name (str): 要使用的模型名称
#   device: (str): 用于推理的设备，cuda 或 cpu
#   consumer_group (str): 将读取器放入的消费者组
#   tensor_parallel (Optional[int]): 您希望模型拆分到的 GPU 数量
#   max_seq_length (int): 用于推理的最大序列长度，默认为 512
#   max_batch_size (int_: 用于请求连续批处理的最大批次大小
llama_model = {
    "model_name": "TheBloke/Llama-2-7b-Chat-AWQ",
    "device": "cuda",
    "consumer_group": "llama",
}
llm = TitanTakeoff(models=[llama_model])

# 模型需要时间来启动，所需时间取决于模型大小和您的网络连接速度
time.sleep(60)

prompt = "What is the capital of France?"
output = llm.invoke(prompt, consumer_group="llama")
print(output)
```
