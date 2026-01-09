---
title: LASER 语言无关句子表征嵌入（由 Meta AI 开发）
---
>[LASER](https://github.com/facebookresearch/LASER/) 是由 Meta AI Research 团队开发的 Python 库，用于为超过 147 种语言创建多语言句子嵌入（截至 2024 年 2 月 25 日）。
>
>- 支持的语言列表见 [github.com/facebookresearch/flores/blob/main/flores200/README.md#languages-in-flores-200](https://github.com/facebookresearch/flores/blob/main/flores200/README.md#languages-in-flores-200)

## 依赖项

要在 LangChain 中使用 LaserEmbed，请安装 `laser_encoders` Python 包。

```python
pip install laser_encoders
```

## 导入

```python
from langchain_community.embeddings.laser import LaserEmbeddings
```

## 实例化 Laser

### 参数

- `lang: Optional[str]`
>如果为空，将默认使用多语言 LASER 编码器模型（称为 "laser2"）。
支持的语言和语言代码列表可在此处找到：[这里](https://github.com/facebookresearch/flores/blob/main/flores200/README.md#languages-in-flores-200)
和 [这里](https://github.com/facebookresearch/LASER/blob/main/laser_encoders/language_list.py)
。

```python
# 示例实例化
embeddings = LaserEmbeddings(lang="eng_Latn")
```

## 用法

### 生成文档嵌入

```python
document_embeddings = embeddings.embed_documents(
    ["This is a sentence", "This is some other sentence"]
)
```

### 生成查询嵌入

```python
query_embeddings = embeddings.embed_query("This is a query")
```
