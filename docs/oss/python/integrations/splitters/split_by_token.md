---
title: 按标记分割
---
语言模型有令牌（token）限制。你不应超过令牌限制。因此，当你[将文本分割](/oss/python/integrations/splitters/)成块时，计算令牌数量是一个好主意。存在许多分词器（tokenizer）。在计算文本中的令牌时，你应该使用与语言模型相同的分词器。

## tiktoken

<Note>

<strong>[tiktoken](https://github.com/openai/tiktoken) 是由 `OpenAI` 创建的快速 `BPE` 分词器。</strong>

</Note>

我们可以使用 `tiktoken` 来估算使用的令牌数。对于 OpenAI 模型，这可能更准确。

1.  文本如何分割：按传入的字符分割。
2.  块大小如何测量：通过 `tiktoken` 分词器。

<a href="https://reference.langchain.com/python/langchain_text_splitters/#langchain_text_splitters.CharacterTextSplitter" target="_blank" rel="noreferrer" class="link">CharacterTextSplitter</a>、<a href="https://reference.langchain.com/python/langchain_text_splitters/#langchain_text_splitters.RecursiveCharacterTextSplitter" target="_blank" rel="noreferrer" class="link">RecursiveCharacterTextSplitter</a> 和 <a href="https://reference.langchain.com/python/langchain_text_splitters/#langchain_text_splitters.TokenTextSplitter" target="_blank" rel="noreferrer" class="link">TokenTextSplitter</a> 可以直接与 `tiktoken` 一起使用。

```python
pip install --upgrade --quiet langchain-text-splitters tiktoken
```

```python
from langchain_text_splitters import CharacterTextSplitter

# 这是一个我们可以分割的长文档。
with open("state_of_the_union.txt") as f:
    state_of_the_union = f.read()
```

要使用 <a href="https://reference.langchain.com/python/langchain_text_splitters/#langchain_text_splitters.CharacterTextSplitter" target="_blank" rel="noreferrer" class="link">CharacterTextSplitter</a> 进行分割，然后使用 `tiktoken` 合并块，请使用其 `.from_tiktoken_encoder()` 方法。请注意，此方法的分割结果可能大于 `tiktoken` 分词器测量的块大小。

`.from_tiktoken_encoder()` 方法接受 `encoding_name`（例如 `cl100k_base`）或 `model_name`（例如 `gpt-4`）作为参数。所有其他参数，如 `chunk_size`、`chunk_overlap` 和 `separators` 都用于实例化 `CharacterTextSplitter`：

```python
text_splitter = CharacterTextSplitter.from_tiktoken_encoder(
    encoding_name="cl100k_base", chunk_size=100, chunk_overlap=0
)
texts = text_splitter.split_text(state_of_the_union)
```

```python
print(texts[0])
```

```text
Madam Speaker, Madam Vice President, our First Lady and Second Gentleman. Members of Congress and the Cabinet. Justices of the Supreme Court. My fellow Americans.

Last year COVID-19 kept us apart. This year we are finally together again.

Tonight, we meet as Democrats Republicans and Independents. But most importantly as Americans.

With a duty to one another to the American people to the Constitution.
```

要对块大小实施硬性约束，我们可以使用 `RecursiveCharacterTextSplitter.from_tiktoken_encoder`，其中每个分割如果大小超过限制，将被递归分割：

```python
from langchain_text_splitters import RecursiveCharacterTextSplitter

text_splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
    model_name="gpt-4",
    chunk_size=100,
    chunk_overlap=0,
)
```

我们还可以加载 `TokenTextSplitter` 分割器，它直接与 `tiktoken` 配合使用，并确保每个分割都小于块大小。

```python
from langchain_text_splitters import TokenTextSplitter

text_splitter = TokenTextSplitter(chunk_size=10, chunk_overlap=0)

texts = text_splitter.split_text(state_of_the_union)
print(texts[0])
```

```text
Madam Speaker, Madam Vice President, our
```

某些书面语言（例如中文和日文）的字符会编码为两个或更多令牌。直接使用 `TokenTextSplitter` 可能会将一个字符的令牌分割到两个块中，导致出现格式错误的 Unicode 字符。使用 `RecursiveCharacterTextSplitter.from_tiktoken_encoder` 或 `CharacterTextSplitter.from_tiktoken_encoder` 来确保块包含有效的 Unicode 字符串。

## spaCy

<Note>

[spaCy](https://spacy.io/) 是一个用于高级自然语言处理的开源软件库，使用 Python 和 Cython 编程语言编写。

</Note>

LangChain 实现了基于 [spaCy 分词器](https://spacy.io/api/tokenizer) 的分割器。

1.  文本如何分割：通过 `spaCy` 分词器。
2.  块大小如何测量：按字符数。

```python
pip install --upgrade --quiet  spacy
```

```python
# 这是一个我们可以分割的长文档。
with open("state_of_the_union.txt") as f:
    state_of_the_union = f.read()
```

```python
from langchain_text_splitters import SpacyTextSplitter

text_splitter = SpacyTextSplitter(chunk_size=1000)

texts = text_splitter.split_text(state_of_the_union)
print(texts[0])
```

```text
Madam Speaker, Madam Vice President, our First Lady and Second Gentleman.

Members of Congress and the Cabinet.

Justices of the Supreme Court.

My fellow Americans.

Last year COVID-19 kept us apart.

This year we are finally together again.

Tonight, we meet as Democrats Republicans and Independents.

But most importantly as Americans.

With a duty to one another to the American people to the Constitution.

And with an unwavering resolve that freedom will always triumph over tyranny.

Six days ago, Russia’s Vladimir Putin sought to shake the foundations of the free world thinking he could make it bend to his menacing ways.

But he badly miscalculated.

He thought he could roll into Ukraine and the world would roll over.

Instead he met a wall of strength he never imagined.

He met the Ukrainian people.

From President Zelenskyy to every Ukrainian, their fearlessness, their courage, their determination, inspires the world.
```

## SentenceTransformers

[SentenceTransformersTokenTextSplitter](https://python.langchain.com/api_reference/text_splitters/sentence_transformers/langchain_text_splitters.sentence_transformers.SentenceTransformersTokenTextSplitter.html) 是一个专为 sentence-transformer 模型设计的文本分割器。其默认行为是将文本分割成适合你希望使用的 sentence-transformer 模型令牌窗口的块。

要根据 sentence-transformers 分词器分割文本并约束令牌计数，请实例化一个 `SentenceTransformersTokenTextSplitter`。你可以选择指定：

-   `chunk_overlap`：令牌重叠的整数计数；
-   `model_name`：sentence-transformer 模型名称，默认为 `"sentence-transformers/all-mpnet-base-v2"`；
-   `tokens_per_chunk`：每个块所需的令牌数。

```python
from langchain_text_splitters import SentenceTransformersTokenTextSplitter

splitter = SentenceTransformersTokenTextSplitter(chunk_overlap=0)
text = "Lorem "

count_start_and_stop_tokens = 2
text_token_count = splitter.count_tokens(text=text) - count_start_and_stop_tokens
print(text_token_count)
```

```text
2
```

```python
token_multiplier = splitter.maximum_tokens_per_chunk // text_token_count + 1

# `text_to_split` 无法放入单个块中
text_to_split = text * token_multiplier

print(f"tokens in text to split: {splitter.count_tokens(text=text_to_split)}")
```

```text
tokens in text to split: 514
```

```python
text_chunks = splitter.split_text(text=text_to_split)

print(text_chunks[1])
```

```text
lorem
```

## NLTK

<Note>

<strong>[自然语言工具包](https://en.wikipedia.org/wiki/Natural_Language_Toolkit)，或更常见的 [NLTK](https://www.nltk.org/)，是一套用 Python 编程语言编写的用于符号和统计自然语言处理 (NLP) 的库和程序套件。</strong>

</Note>

我们不仅可以根据 "\n\n" 进行分割，还可以使用 `NLTK` 基于 [NLTK 分词器](https://www.nltk.org/api/nltk.tokenize.html) 进行分割。

1.  文本如何分割：通过 `NLTK` 分词器。
2.  块大小如何测量：按字符数。

```python
# pip install nltk
```

```python
# 这是一个我们可以分割的长文档。
with open("state_of_the_union.txt") as f:
    state_of_the_union = f.read()
```

```python
from langchain_text_splitters import NLTKTextSplitter

text_splitter = NLTKTextSplitter(chunk_size=1000)
```

```python
texts = text_splitter.split_text(state_of_the_union)
print(texts[0])
```

```text
Madam Speaker, Madam Vice President, our First Lady and Second Gentleman.

Members of Congress and the Cabinet.

Justices of the Supreme Court.

My fellow Americans.

Last year COVID-19 kept us apart.

This year we are finally together again.

Tonight, we meet as Democrats Republicans and Independents.

But most importantly as Americans.

With a duty to one another to the American people to the Constitution.

And with an unwavering resolve that freedom will always triumph over tyranny.

Six days ago, Russia’s Vladimir Putin sought to shake the foundations of the free world thinking he could make it bend to his menacing ways.

But he badly miscalculated.

He thought he could roll into Ukraine and the world would roll over.

Instead he met a wall of strength he never imagined.

He met the Ukrainian people.

From President Zelenskyy to every Ukrainian, their fearlessness, their courage, their determination, inspires the world.

Groups of citizens blocking tanks with their bodies.
```

## KoNLPY

<Note>

[KoNLPy: Python 中的韩语 NLP](https://konlpy.org/en/latest/) 是一个用于韩语自然语言处理 (NLP) 的 Python 包。

</Note>

令牌分割涉及将文本分割成更小、更易管理的单元，称为令牌。这些令牌通常是单词、短语、符号或其他对进一步处理和分析至关重要的有意义的元素。在英语等语言中，令牌分割通常涉及按空格和标点符号分隔单词。令牌分割的有效性在很大程度上取决于分词器对语言结构的理解，确保生成有意义的令牌。由于为英语设计的分词器无法理解其他语言（例如韩语）的独特语义结构，因此它们不能有效地用于韩语处理。

### 使用 KoNLPy 的 Kkma 分析器进行韩语令牌分割
对于韩语文本，KoNLPY 包含一个称为 `Kkma`（Korean Knowledge Morpheme Analyzer）的形态分析器。`Kkma` 提供韩语文本的详细形态分析。它将句子分解为单词，并将单词分解为各自的语素，识别每个令牌的词性。它可以将文本块分割成单独的句子，这对于处理长文本特别有用。

### 使用注意事项
虽然 `Kkma` 以其详细的分析而闻名，但需要注意的是，这种精确性可能会影响处理速度。因此，`Kkma` 最适合那些分析深度优先于快速文本处理的应用场景。

```python
# pip install konlpy
```

```python
# 这是一个我们想要分割成其组成句子的长韩语文档。
with open("./your_korean_doc.txt") as f:
    korean_document = f.read()
```

```python
from langchain_text_splitters import KonlpyTextSplitter

text_splitter = KonlpyTextSplitter()
```

```python
texts = text_splitter.split_text(korean_document)
# 句子用 "\n\n" 字符分割。
print(texts[0])
```

```text
춘향전 옛날에 남원에 이 도령이라는 벼슬아치 아들이 있었다.

그의 외모는 빛나는 달처럼 잘생겼고, 그의 학식과 기예는 남보다 뛰어났다.

한편, 이 마을에는 춘향이라는 절세 가인이 살고 있었다.

춘 향의 아름다움은 꽃과 같아 마을 사람들 로부터 많은 사랑을 받았다.

어느 봄날, 도령은 친구들과 놀러 나갔다가 춘 향을 만 나 첫 눈에 반하고 말았다.

두 사람은 서로 사랑하게 되었고, 이내 비밀스러운 사랑의 맹세를 나누었다.

하지만 좋은 날들은 오래가지 않았다.

도령의 아버지가 다른 곳으로 전근을 가게 되어 도령도 떠나 야만 했다.

이별의 아픔 속에서도, 두 사람은 재회를 기약하며 서로를 믿고 기다리기로 했다.

그러나 새로 부임한 관아의 사또가 춘 향의 아름다움에 욕심을 내 어 그녀에게 강요를 시작했다.

춘 향 은 도령에 대한 자신의 사랑을 지키기 위해, 사또의 요구를 단호히 거절했다.

이에 분노한 사또는 춘 향을 감옥에 가두고 혹독한 형벌을 내렸다.

이야기는 이 도령이 고위 관직에 오른 후, 춘 향을 구해 내는 것으로 끝난다.

두 사람은 오랜 시련 끝에 다시 만나게 되고, 그들의 사랑은 온 세상에 전해 지며 후세에까지 이어진다.

- 춘향전 (The Tale of Chunhyang)
```

## Hugging Face 分词器

[Hugging Face](https://huggingface.co/docs/tokenizers/index) 有许多分词器。

我们使用 Hugging Face 分词器，即 [GPT2TokenizerFast](https://huggingface.co/Ransaka/gpt2-tokenizer-fast) 来计算文本的令牌长度。

1.  文本如何分割：按传入的字符分割。
2.  块大小如何测量：通过 `Hugging Face` 分词器计算的令牌数。

```python
from transformers import GPT2TokenizerFast

tokenizer = GPT2TokenizerFast.from_pretrained("gpt2")
```

```python
# 这是一个我们可以分割的长文档。
with open("state_of_the_union.txt") as f:
    state_of_the_union = f.read()
from langchain_text_splitters import CharacterTextSplitter
```

```python
text_splitter = CharacterTextSplitter.from_huggingface_tokenizer(
    tokenizer, chunk_size=100, chunk_overlap=0
)
texts = text_splitter.split_text(state_of_the_union)
```

```python
print(texts[0])
```

```text
Madam Speaker, Madam Vice President, our First Lady and Second Gentleman. Members of Congress and the Cabinet. Justices of the Supreme Court. My fellow Americans.

Last year COVID-19 kept us apart. This year we are finally together again.

Tonight, we meet as Democrats Republicans and Independents. But most importantly as Americans.

With a duty to one another to the American people to the Constitution.
```

