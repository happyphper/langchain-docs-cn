---
title: 易
---
[01.AI](https://www.lingyiwanwu.com/en) 由李开复博士创立，是一家处于 AI 2.0 前沿的全球化公司。他们提供尖端的大型语言模型，包括参数规模从 6B 到数千亿不等的 Yi 系列模型。01.AI 还提供多模态模型、开放的 API 平台以及 Yi-34B/9B/6B 和 Yi-VL 等开源选项。

```python
## 安装使用该集成所需的 langchain 包
pip install -qU langchain-community
```

## 前提条件

访问 Yi LLM API 需要一个 API 密钥。请访问 [www.lingyiwanwu.com/](https://www.lingyiwanwu.com/) 获取您的 API 密钥。申请 API 密钥时，您需要指定是用于国内（中国）还是国际用途。

## 使用 Yi LLM

```python
import os

os.environ["YI_API_KEY"] = "YOUR_API_KEY"

from langchain_community.llms import YiLLM

# 加载模型
llm = YiLLM(model="yi-large")

# 如果需要，可以指定区域（默认为 "auto"）
# llm = YiLLM(model="yi-large", region="domestic")  # 或 "international"

# 基本用法
res = llm.invoke("What's your name?")
print(res)
```

```python
# Generate 方法
res = llm.generate(
    prompts=[
        "Explain the concept of large language models.",
        "What are the potential applications of AI in healthcare?",
    ]
)
print(res)
```

```python
# 流式输出
for chunk in llm.stream("Describe the key features of the Yi language model series."):
    print(chunk, end="", flush=True)
```

```python
# 异步流式输出
import asyncio

async def run_aio_stream():
    async for chunk in llm.astream(
        "Write a brief on the future of AI according to Dr. Kai-Fu Lee's vision."
    ):
        print(chunk, end="", flush=True)

asyncio.run(run_aio_stream())
```

```python
# 调整参数
llm_with_params = YiLLM(
    model="yi-large",
    temperature=0.7,
    top_p=0.9,
)

res = llm_with_params(
    "Propose an innovative AI application that could benefit society."
)
print(res)
```
