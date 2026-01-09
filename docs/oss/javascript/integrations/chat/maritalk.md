---
title: Maritalk
---
<a href="https://colab.research.google.com/github/langchain-ai/langchain/blob/v0.3/docs/docs/integrations/chat/maritalk.ipynb" target="_parent"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab" /></a>

MariTalk 是由巴西公司 [Maritaca AI](https://www.maritaca.ai) 开发的助手。
MariTalk 基于经过专门训练以良好理解葡萄牙语的语言模型。

本笔记本通过两个示例演示了如何在 LangChain 中使用 MariTalk：

1.  一个关于如何使用 MariTalk 执行任务的简单示例。
2.  LLM + RAG：第二个示例展示了如何回答一个答案存在于长文档中的问题，而该文档超出了 MariTalk 的令牌限制。为此，我们将使用一个简单的搜索器（BM25）首先在文档中搜索最相关的部分，然后将这些部分提供给 MariTalk 来回答问题。

## 安装

首先，使用以下命令安装 LangChain 库（及其所有依赖项）：

```python
!pip install langchain langchain-core langchain-community httpx
```

## API 密钥

您需要一个 API 密钥，可以从 chat.maritaca.ai 的 "Chaves da API" 部分获取。

### 示例 1 - 宠物名字建议

让我们定义我们的语言模型 ChatMaritalk，并使用您的 API 密钥进行配置。

```python
from langchain_community.chat_models import ChatMaritalk
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts.chat import ChatPromptTemplate

llm = ChatMaritalk(
    model="sabia-2-medium",  # 可用模型：sabia-2-small 和 sabia-2-medium
    api_key="",  # 在此处插入您的 API 密钥
    temperature=0.7,
    max_tokens=100,
)

output_parser = StrOutputParser()

chat_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You are an assistant specialized in suggesting pet names. Given the animal, you must suggest 4 names.",
        ),
        ("human", "I have a {animal}"),
    ]
)

chain = chat_prompt | llm | output_parser

response = chain.invoke({"animal": "dog"})
print(response)  # 应该回答类似 "1. Max\n2. Bella\n3. Charlie\n4. Rocky" 的内容
```

### 流式生成

对于涉及生成长文本的任务，例如创建一篇长文章或翻译大型文档，在文本生成过程中分部分接收响应，而不是等待完整文本，可能是有利的。这使得应用程序响应更迅速、效率更高，尤其是在生成文本很长时。我们提供了两种方法来满足这一需求：一种是同步的，另一种是异步的。

#### 同步方式

```python
from langchain.messages import HumanMessage

messages = [HumanMessage(content="Suggest 3 names for my dog")]

for chunk in llm.stream(messages):
    print(chunk.content, end="", flush=True)
```

#### 异步方式

```python
from langchain.messages import HumanMessage

async def async_invoke_chain(animal: str):
    messages = [HumanMessage(content=f"Suggest 3 names for my {animal}")]
    async for chunk in llm._astream(messages):
        print(chunk.message.content, end="", flush=True)

await async_invoke_chain("dog")
```

### 示例 2 - RAG + LLM：UNICAMP 2024 入学考试问答系统

对于此示例，我们需要安装一些额外的库：

```python
!pip install unstructured rank_bm25 pdf2image pdfminer-six pikepdf pypdf unstructured_inference fastapi kaleido uvicorn "pillow<10.1.0" pillow_heif -q
```

#### 加载数据库

第一步是使用通知中的信息创建一个数据库。为此，我们将从 COMVEST 网站下载通知，并将提取的文本分割成 500 个字符的窗口。

```python
from langchain_community.document_loaders import OnlinePDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

# 加载 COMVEST 2024 通知
loader = OnlinePDFLoader(
    "https://www.comvest.unicamp.br/wp-content/uploads/2023/10/31-2023-Dispoe-sobre-o-Vestibular-Unicamp-2024_com-retificacao.pdf"
)
data = loader.load()

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500, chunk_overlap=100, separators=["\n", " ", ""]
)
texts = text_splitter.split_documents(data)
```

#### 创建搜索器

现在我们有了数据库，我们需要一个搜索器。对于此示例，我们将使用一个简单的 BM25 作为搜索系统，但这可以替换为任何其他搜索器（例如通过嵌入向量进行搜索）。

```python
from langchain_community.retrievers import BM25Retriever

retriever = BM25Retriever.from_documents(texts)
```

#### 组合搜索系统 + LLM

现在我们有了搜索器，我们只需要实现一个指定任务的提示词并调用链。

```python
from langchain_classic.chains.question_answering import load_qa_chain

prompt = """Baseado nos seguintes documentos, responda a pergunta abaixo.

{context}

Pergunta: {query}
"""

qa_prompt = ChatPromptTemplate.from_messages([("human", prompt)])

chain = load_qa_chain(llm, chain_type="stuff", verbose=True, prompt=qa_prompt)

query = "Qual o tempo máximo para realização da prova?"

docs = retriever.invoke(query)

chain.invoke(
    {"input_documents": docs, "query": query}
)  # 应该输出类似："O tempo máximo para realização da prova é de 5 horas."
```
