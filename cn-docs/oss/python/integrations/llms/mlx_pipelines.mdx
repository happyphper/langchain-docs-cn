---
title: MLX 本地流水线
---
MLX 模型可以通过 `MLXPipeline` 类在本地运行。

[MLX 社区](https://huggingface.co/mlx-community)托管了超过 150 个模型，所有模型都是开源的，并公开在 Hugging Face 模型中心（一个人们可以轻松协作并共同构建 ML 的在线平台）上。

这些模型可以通过此本地管道包装器从 LangChain 调用，也可以通过 MlXPipeline 类调用其托管的推理端点。有关 mlx 的更多信息，请参阅 [示例仓库](https://github.com/ml-explore/mlx-examples/tree/main/llms) 中的 notebook。

要使用它，您应该安装 `mlx-lm` Python [包](https://pypi.org/project/mlx-lm/) 以及 [transformers](https://pypi.org/project/transformers/)。您也可以安装 `huggingface_hub`。

```python
pip install -qU  mlx-lm transformers huggingface_hub
```

### 模型加载

可以通过使用 `from_model_id` 方法指定模型参数来加载模型。

```python
from langchain_community.llms.mlx_pipeline import MLXPipeline

pipe = MLXPipeline.from_model_id(
    "mlx-community/quantized-gemma-2b-it",
    pipeline_kwargs={"max_tokens": 10, "temp": 0.1},
)
```

也可以通过直接传入一个现有的 `transformers` 管道来加载。

```python
from mlx_lm import load

model, tokenizer = load("mlx-community/quantized-gemma-2b-it")
pipe = MLXPipeline(model=model, tokenizer=tokenizer)
```

### 创建链

将模型加载到内存后，您可以将其与提示词组合以形成一个链。

```python
from langchain_core.prompts import PromptTemplate

template = """Question: {question}

Answer: Let's think step by step."""
prompt = PromptTemplate.from_template(template)

chain = prompt | pipe

question = "What is electroencephalography?"

print(chain.invoke({"question": question}))
```
