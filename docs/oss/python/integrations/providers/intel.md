---
title: 英特尔
---
>[Optimum Intel](https://github.com/huggingface/optimum-intel?tab=readme-ov-file#optimum-intel) 是 🤗 Transformers 和 Diffusers 库与英特尔提供的各种工具和库之间的接口，旨在加速英特尔架构上的端到端流程。

>[Intel® Extension for Transformers](https://github.com/intel/intel-extension-for-transformers?tab=readme-ov-file#intel-extension-for-transformers) (ITREX) 是一个创新的工具包，旨在通过在各种英特尔平台（包括英特尔 Gaudi2、英特尔 CPU 和英特尔 GPU）上实现基于 Transformer 的模型的最佳性能，来加速无处不在的 GenAI/LLM。

本页介绍如何在 LangChain 中使用 optimum-intel 和 ITREX。

## Optimum-intel

所有与 [optimum-intel](https://github.com/huggingface/optimum-intel.git) 和 [IPEX](https://github.com/intel/intel-extension-for-pytorch) 相关的功能。

### 安装

使用以下命令安装 optimum-intel 和 ipex：

::: code-group

```bash [pip]
pip install "optimum[neural-compressor]"
pip install intel_extension_for_pytorch
```

```bash [uv]
uv add "optimum[neural-compressor]"
uv add intel_extension_for_pytorch
```

:::

请按照以下指定的安装说明进行操作：

* 按照[此处](https://github.com/huggingface/optimum-intel)所示安装 optimum-intel。
* 按照[此处](https://intel.github.io/intel-extension-for-pytorch/index.html#installation?platform=cpu&version=v2.2.0%2Bcpu)所示安装 IPEX。

### 嵌入模型

查看[使用示例](/oss/integrations/text_embedding/optimum_intel)。
我们还提供了一个完整的教程笔记本 [`rag_with_quantized_embeddings.ipynb`](https://github.com/langchain-ai/langchain/blob/v0.3/cookbook/rag_with_quantized_embeddings.ipynb)，用于在 RAG 流程中使用该嵌入器。

```python
from langchain_community.embeddings import QuantizedBiEncoderEmbeddings
```

## Intel® Extension for Transformers (ITREX)
(ITREX) 是一个创新的工具包，用于在英特尔平台上加速基于 Transformer 的模型，特别是在第四代英特尔至强可扩展处理器 Sapphire Rapids（代号 Sapphire Rapids）上效果显著。

量化是一种通过使用更少的位数来表示权重来降低其精度的过程。仅权重量化（Weight-only quantization）特别侧重于量化神经网络的权重，同时保持其他组件（如激活值）的原始精度。

随着大语言模型 (LLMs) 变得越来越普遍，越来越需要新的和改进的量化方法，这些方法能够满足这些现代架构的计算需求，同时保持准确性。与 [常规量化](https://github.com/intel/intel-extension-for-transformers/blob/main/docs/quantization.md)（如 W8A8）相比，仅权重量化可能是平衡性能和准确性的更好折衷方案，因为我们将在下面看到，部署 LLMs 的瓶颈是内存带宽，而通常仅权重量化可以带来更好的准确性。

在这里，我们将介绍使用 ITREX 的嵌入模型和针对 Transformer 大语言模型的仅权重量化。仅权重量化是深度学习中用于减少神经网络内存和计算需求的一种技术。在深度神经网络的上下文中，模型参数（也称为权重）通常使用浮点数表示，这可能会消耗大量内存并需要密集的计算资源。

所有与 [intel-extension-for-transformers](https://github.com/intel/intel-extension-for-transformers) 相关的功能。

### 安装

安装 intel-extension-for-transformers。有关系统要求和其他安装提示，请参阅[安装指南](https://github.com/intel/intel-extension-for-transformers/blob/main/docs/installation.md)

::: code-group

```bash [pip]
pip install intel-extension-for-transformers
```

```bash [uv]
uv add intel-extension-for-transformers
```

:::

安装其他必需的包。

::: code-group

```bash [pip]
pip install -U torch onnx accelerate datasets
```

```bash [uv]
uv add torch onnx accelerate datasets
```

:::

### 嵌入模型

查看[使用示例](/oss/integrations/text_embedding/itrex)。

```python
from langchain_community.embeddings import QuantizedBgeEmbeddings
```

### 使用 ITREX 进行仅权重量化

查看[使用示例](/oss/integrations/llms/weight_only_quantization)。

## 配置参数详情

以下是 `WeightOnlyQuantConfig` 类的详细信息。

#### weight_dtype (string): 权重数据类型，默认为 "nf4"。
我们支持将权重量化为以下数据类型进行存储（WeightOnlyQuantConfig 中的 weight_dtype）：
* **int8**: 使用 8 位数据类型。
* **int4_fullrange**: 使用 int4 范围的 -8 值，与正常的 int4 范围 [-7,7] 相比。
* **int4_clip**: 裁剪并保留 int4 范围内的值，将其他值设为零。
* **nf4**: 使用归一化的浮点 4 位数据类型。
* **fp4_e2m1**: 使用常规的浮点 4 位数据类型。"e2" 表示 2 位用于指数，"m1" 表示 1 位用于尾数。

#### compute_dtype (string): 计算数据类型，默认为 "fp32"。
虽然这些技术以 4 或 8 位存储权重，但计算仍然在 float32、bfloat16 或 int8 中进行（WeightOnlyQuantConfig 中的 compute_dtype）：
* **fp32**: 使用 float32 数据类型进行计算。
* **bf16**: 使用 bfloat16 数据类型进行计算。
* **int8**: 使用 8 位数据类型进行计算。

#### llm_int8_skip_modules (模块名称列表): 跳过量化的模块，默认为 None。
这是一个要跳过量化的模块列表。

#### scale_dtype (string): 缩放因子数据类型，默认为 "fp32"。
目前仅支持 "fp32"（float32）。

#### mse_range (boolean): 是否在范围 [0.805, 1.0, 0.005] 内搜索最佳裁剪范围，默认为 False。
#### use_double_quant (boolean): 是否量化缩放因子，默认为 False。
暂不支持。
#### double_quant_dtype (string): 为双重量化保留。
#### double_quant_scale_dtype (string): 为双重量化保留。
#### group_size (int): 量化时的分组大小。
#### scheme (string): 权重被量化为何种格式。默认为 "sym"。
* **sym**: 对称量化。
* **asym**: 非对称量化。
#### algorithm (string): 用于提高准确性的算法。默认为 "RTN"。
* **RTN**: 最近舍入（RTN）是一种我们可以非常直观地想到的量化方法。
* **AWQ**: 仅保护 1% 的显著权重可以大大减少量化误差。显著权重通道是通过观察每个通道的激活和权重分布来选择的。显著权重在量化前会乘以一个大的缩放因子以进行保留，然后再进行量化。
* **TEQ**: 一种可训练的等效变换，在仅权重量化中保持 FP32 精度。
