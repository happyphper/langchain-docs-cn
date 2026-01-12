---
title: TensorFlow Datasets
---
>[TensorFlow Datasets](https://www.tensorflow.org/datasets) 是一个可直接使用的数据集集合，适用于 TensorFlow 或其他 Python 机器学习框架，例如 Jax。所有数据集都以 [tf.data.Datasets](https://www.tensorflow.org/api_docs/python/tf/data/Dataset) 的形式公开，从而实现了易于使用且高性能的输入流水线。要开始使用，请参阅[指南](https://www.tensorflow.org/datasets/overview)和[数据集列表](https://www.tensorflow.org/datasets/catalog/overview#all_datasets)。

## 安装与设置

你需要安装 `tensorflow` 和 `tensorflow-datasets` Python 包。

::: code-group

```bash [pip]
pip install tensorflow
```

```bash [uv]
uv add tensorflow
```

:::

::: code-group

```bash [pip]
pip install tensorflow-dataset
```

```bash [uv]
uv add tensorflow-dataset
```

:::

## 文档加载器

查看[使用示例](/oss/javascript/integrations/document_loaders/tensorflow_datasets)。

```python
from langchain_community.document_loaders import TensorflowDatasetLoader
```
