---
title: OpenVINO
---
[OpenVINO™](https://github.com/openvinotoolkit/openvino) 是一个用于优化和部署 AI 推理的开源工具包。OpenVINO™ Runtime 能够实现在各种硬件[设备](https://github.com/openvinotoolkit/openvino?tab=readme-ov-file#supported-hardware-matrix)上运行经过优化的同一模型。它可以在多种用例中加速深度学习性能，例如：语言 + 大语言模型 (LLMs)、计算机视觉、自动语音识别等。

可以通过 `HuggingFacePipeline` [类](https://python.langchain.com/docs/integrations/llms/huggingface_pipeline) 在本地运行 OpenVINO 模型。要使用 OpenVINO 部署模型，可以指定 `backend="openvino"` 参数来触发 OpenVINO 作为后端推理框架。

要使用此功能，您需要安装带有 OpenVINO 加速器的 `optimum-intel` Python [包](https://github.com/huggingface/optimum-intel?tab=readme-ov-file#installation)。

```python
pip install -U-strategy eager "optimum[openvino,nncf]" langchain-huggingface --quiet
```

### 模型加载

可以通过使用 `from_model_id` 方法指定模型参数来加载模型。

如果您有英特尔 GPU，可以指定 `model_kwargs={"device": "GPU"}` 在其上进行推理。

```python
from langchain_huggingface import HuggingFacePipeline

ov_config = {"PERFORMANCE_HINT": "LATENCY", "NUM_STREAMS": "1", "CACHE_DIR": ""}

ov_llm = HuggingFacePipeline.from_model_id(
    model_id="gpt2",
    task="text-generation",
    backend="openvino",
    model_kwargs={"device": "CPU", "ov_config": ov_config},
    pipeline_kwargs={"max_new_tokens": 10},
)
```

也可以通过直接传入一个现有的 [`optimum-intel`](https://huggingface.co/docs/optimum/main/en/intel/inference) pipeline 来加载模型。

```python
from optimum.intel.openvino import OVModelForCausalLM
from transformers import AutoTokenizer, pipeline

model_id = "gpt2"
device = "CPU"
tokenizer = AutoTokenizer.from_pretrained(model_id)
ov_model = OVModelForCausalLM.from_pretrained(
    model_id, export=True, device=device, ov_config=ov_config
)
ov_pipe = pipeline(
    "text-generation", model=ov_model, tokenizer=tokenizer, max_new_tokens=10
)
ov_llm = HuggingFacePipeline(pipeline=ov_pipe)
```

### 创建链

将模型加载到内存后，您可以将其与提示词组合形成一个链。

```python
from langchain_core.prompts import PromptTemplate

template = """Question: {question}

Answer: Let's think step by step."""
prompt = PromptTemplate.from_template(template)

chain = prompt | ov_llm

question = "What is electroencephalography?"

print(chain.invoke({"question": question}))
```

要获得不带提示词的响应，您可以使用 `skip_prompt=True` 绑定 LLM。

```python
chain = prompt | ov_llm.bind(skip_prompt=True)

question = "What is electroencephalography?"

print(chain.invoke({"question": question}))
```

### 使用本地 OpenVINO 模型进行推理

可以使用 CLI 将您的模型[导出](https://github.com/huggingface/optimum-intel?tab=readme-ov-file#export)为 OpenVINO IR 格式，并从本地文件夹加载模型。

```python
!optimum-cli export openvino --model gpt2 ov_model_dir
```

建议应用 8 位或 4 位权重量化，以使用 `--weight-format` 减少推理延迟和模型占用空间：

```python
!optimum-cli export openvino --model gpt2  --weight-format int8 ov_model_dir # 用于 8 位量化

!optimum-cli export openvino --model gpt2  --weight-format int4 ov_model_dir # 用于 4 位量化
```

```python
ov_llm = HuggingFacePipeline.from_model_id(
    model_id="ov_model_dir",
    task="text-generation",
    backend="openvino",
    model_kwargs={"device": "CPU", "ov_config": ov_config},
    pipeline_kwargs={"max_new_tokens": 10},
)

chain = prompt | ov_llm

question = "What is electroencephalography?"

print(chain.invoke({"question": question}))
```

您可以通过激活值的动态量化和 KV 缓存量化获得额外的推理速度提升。可以通过 `ov_config` 启用这些选项，如下所示：

```python
ov_config = {
    "KV_CACHE_PRECISION": "u8",
    "DYNAMIC_QUANTIZATION_GROUP_SIZE": "32",
    "PERFORMANCE_HINT": "LATENCY",
    "NUM_STREAMS": "1",
    "CACHE_DIR": "",
}
```

### 流式输出

您可以使用 `stream` 方法来获取 LLM 输出的流式结果，

```python
generation_config = {"skip_prompt": True, "pipeline_kwargs": {"max_new_tokens": 100}}
chain = prompt | ov_llm.bind(**generation_config)

for chunk in chain.stream(question):
    print(chunk, end="", flush=True)
```

更多信息请参考：

* [OpenVINO LLM 指南](https://docs.openvino.ai/2024/learn-openvino/llm_inference_guide.html)。

* [OpenVINO 文档](https://docs.openvino.ai/2024/home.html)。

* [OpenVINO 入门指南](https://www.intel.com/content/www/us/en/content-details/819067/openvino-get-started-guide.html)。

* [使用 LangChain 的 RAG 笔记本](https://github.com/openvinotoolkit/openvino_notebooks/tree/latest/notebooks/llm-rag-langchain)。
