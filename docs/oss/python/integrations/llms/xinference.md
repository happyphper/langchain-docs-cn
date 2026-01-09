---
title: Xorbits Inference (Xinference)
---
[Xinference](https://github.com/xorbitsai/inference) 是一个功能强大且用途广泛的库，旨在为 LLM、语音识别模型和多模态模型提供服务，甚至可以在您的笔记本电脑上运行。它支持多种与 GGML 兼容的模型，例如 chatglm、baichuan、whisper、vicuna、orca 等。本笔记本演示了如何在 LangChain 中使用 Xinference。

## 安装

通过 PyPI 安装 `Xinference`：

```python
pip install -qU  "xinference[all]"
```

## 本地或分布式集群部署 Xinference

对于本地部署，运行 `xinference`。

要在集群中部署 Xinference，首先使用 `xinference-supervisor` 启动一个 Xinference 管理节点。您也可以使用 `-p` 选项指定端口，使用 `-H` 选项指定主机。默认端口是 9997。

然后，在您希望运行模型的每台服务器上，使用 `xinference-worker` 启动 Xinference 工作节点。

您可以查阅 [Xinference](https://github.com/xorbitsai/inference) 的 README 文件以获取更多信息。

## 包装器

要在 LangChain 中使用 Xinference，您需要首先启动一个模型。您可以使用命令行界面 (CLI) 来完成此操作：

```python
!xinference launch -n vicuna-v1.3 -f ggmlv3 -q q4_0
```

```text
Model uid: 7167b2b0-2a04-11ee-83f0-d29396a3f064
```

系统会返回一个模型 UID 供您使用。现在您可以在 LangChain 中使用 Xinference：

```python
from langchain_community.llms import Xinference

llm = Xinference(
    server_url="http://0.0.0.0:9997", model_uid="7167b2b0-2a04-11ee-83f0-d29396a3f064"
)

llm(
    prompt="Q: where can we visit in the capital of France? A:",
    generate_config={"max_tokens": 1024, "stream": True},
)
```

```text
' You can visit the Eiffel Tower, Notre-Dame Cathedral, the Louvre Museum, and many other historical sites in Paris, the capital of France.'
```

### 与 LLMChain 集成

```python
from langchain_classic.chains import LLMChain
from langchain_core.prompts import PromptTemplate

template = "Where can we visit in the capital of {country}?"

prompt = PromptTemplate.from_template(template)

llm_chain = LLMChain(prompt=prompt, llm=llm)

generated = llm_chain.run(country="France")
print(generated)
```

```text
A: You can visit many places in Paris, such as the Eiffel Tower, the Louvre Museum, Notre-Dame Cathedral, the Champs-Elysées, Montmartre, Sacré-Cœur, and the Palace of Versailles.
```

最后，当您不再需要使用该模型时，请将其终止：

```python
!xinference terminate --model-uid "7167b2b0-2a04-11ee-83f0-d29396a3f064"
```
