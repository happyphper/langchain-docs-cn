---
title: 英特尔仅权重量化
---
## 使用 Intel Extension for Transformers 流水线对 Huggingface 模型进行仅权重量化

可以通过 `WeightOnlyQuantPipeline` 类，使用仅权重量化（Weight-Only Quantization）在本地运行 Hugging Face 模型。

[Hugging Face 模型中心](https://huggingface.co/models) 托管了超过 12 万个模型、2 万个数据集和 5 万个演示应用（Spaces），所有内容均为开源且公开可用。这是一个在线平台，人们可以轻松协作并共同构建机器学习项目。

可以通过这个本地流水线包装器类从 LangChain 调用这些模型。

要使用它，你应该安装 `transformers` Python [包](https://pypi.org/project/transformers/)，以及 [pytorch](https://pytorch.org/get-started/locally/) 和 [intel-extension-for-transformers](https://github.com/intel/intel-extension-for-transformers)。

```python
pip install transformers --quiet
pip install intel-extension-for-transformers
```

### 模型加载

可以通过使用 `from_model_id` 方法指定模型参数来加载模型。模型参数包括 intel_extension_for_transformers 中的 `WeightOnlyQuantConfig` 类。

```python
from intel_extension_for_transformers.transformers import WeightOnlyQuantConfig
from langchain_community.llms.weight_only_quantization import WeightOnlyQuantPipeline

conf = WeightOnlyQuantConfig(weight_dtype="nf4")
hf = WeightOnlyQuantPipeline.from_model_id(
    model_id="google/flan-t5-large",
    task="text2text-generation",
    quantization_config=conf,
    pipeline_kwargs={"max_new_tokens": 10},
)
```

也可以通过直接传入一个现有的 `transformers` 流水线来加载模型。

```python
from intel_extension_for_transformers.transformers import AutoModelForSeq2SeqLM
from transformers import AutoTokenizer, pipeline

model_id = "google/flan-t5-large"
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForSeq2SeqLM.from_pretrained(model_id)
pipe = pipeline(
    "text2text-generation", model=model, tokenizer=tokenizer, max_new_tokens=10
)
hf = WeightOnlyQuantPipeline(pipeline=pipe)
```

### 创建链

将模型加载到内存后，你可以将其与提示词组合以形成一个链。

```python
from langchain_core.prompts import PromptTemplate

template = """问题：{question}

答案：让我们一步步思考。"""
prompt = PromptTemplate.from_template(template)

chain = prompt | hf

question = "什么是脑电图？"

print(chain.invoke({"question": question}))
```

### CPU 推理

目前 intel-extension-for-transformers 仅支持 CPU 设备推理。即将支持英特尔 GPU。在带有 CPU 的机器上运行时，你可以指定 `device="cpu"` 或 `device=-1` 参数将模型放在 CPU 设备上。默认值为 `-1` 用于 CPU 推理。

```python
conf = WeightOnlyQuantConfig(weight_dtype="nf4")
llm = WeightOnlyQuantPipeline.from_model_id(
    model_id="google/flan-t5-large",
    task="text2text-generation",
    quantization_config=conf,
    pipeline_kwargs={"max_new_tokens": 10},
)

template = """问题：{question}

答案：让我们一步步思考。"""
prompt = PromptTemplate.from_template(template)

chain = prompt | llm

question = "什么是脑电图？"

print(chain.invoke({"question": question}))
```

### 批量 CPU 推理

你也可以在 CPU 上以批处理模式运行推理。

```python
conf = WeightOnlyQuantConfig(weight_dtype="nf4")
llm = WeightOnlyQuantPipeline.from_model_id(
    model_id="google/flan-t5-large",
    task="text2text-generation",
    quantization_config=conf,
    pipeline_kwargs={"max_new_tokens": 10},
)

chain = prompt | llm.bind(stop=["\n\n"])

questions = []
for i in range(4):
    questions.append({"question": f"数字 {i} 用法语怎么说？"})

answers = chain.batch(questions)
for answer in answers:
    print(answer)
```

### Intel-extension-for-transformers 支持的数据类型

我们支持将权重量化为以下数据类型进行存储（WeightOnlyQuantConfig 中的 weight_dtype）：

* **int8**：使用 8 位数据类型。
* **int4_fullrange**：与普通的 int4 范围 [-7,7] 相比，使用 int4 范围的 -8 值。
* **int4_clip**：裁剪并保留 int4 范围内的值，将其他值设为零。
* **nf4**：使用归一化的浮点 4 位数据类型。
* **fp4_e2m1**：使用常规的浮点 4 位数据类型。"e2" 表示 2 位用于指数，"m1" 表示 1 位用于尾数。

虽然这些技术以 4 位或 8 位存储权重，但计算仍然在 float32、bfloat16 或 int8 中进行（WeightOnlyQuantConfig 中的 compute_dtype）：

* **fp32**：使用 float32 数据类型进行计算。
* **bf16**：使用 bfloat16 数据类型进行计算。
* **int8**：使用 8 位数据类型进行计算。

### 支持的算法矩阵

intel-extension-for-transformers 中支持的量化算法（WeightOnlyQuantConfig 中的 algorithm）：

| 算法 | PyTorch | LLM Runtime |
|:--------------:|:----------:|:----------:|
| RTN | &#10004; | &#10004; |
| AWQ | &#10004; | 敬请期待 |
| TEQ | &#10004; | 敬请期待 |

> **RTN：** 一种我们可以非常直观地想到的量化方法。它不需要额外的数据集，是一种非常快速的量化方法。一般来说，RTN 会将权重转换为均匀分布的整数数据类型，但有些算法，如 Qlora，提出了一种非均匀的 NF4 数据类型并证明了其理论最优性。

> **AWQ：** 证明了仅保护 1% 的重要权重就可以大大减少量化误差。重要权重通道是通过观察每个通道的激活和权重分布来选择的。重要权重在量化前会乘以一个大的缩放因子，然后进行量化以进行保留。

> **TEQ：** 一种可训练的等效变换，在仅权重量化中保持 FP32 精度。它受到 AWQ 的启发，同时提供了一种新的解决方案来搜索激活和权重之间的最佳逐通道缩放因子。
