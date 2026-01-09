---
title: Google Cloud Vertex AI 重排序器
---
> [Vertex Search Ranking API](https://cloud.google.com/generative-ai-app-builder/docs/ranking) 是 [Vertex AI Agent Builder](https://cloud.google.com/generative-ai-app-builder/docs/builder-apis) 中的独立 API 之一。它接收一个文档列表，并根据文档与查询的相关性对这些文档进行重新排序。与仅关注文档和查询语义相似性的嵌入（embeddings）相比，排名 API 可以提供文档对给定查询回答质量的精确分数。该 API 可用于在检索到一组初始候选文档后，提升搜索结果的质量。

> 排名 API 是无状态的，因此在调用 API 之前无需索引文档。您只需传入查询和文档即可。这使得该 API 非常适合对来自任何文档检索器的文档进行重新排序。

> 更多信息，请参阅 [对文档进行排序和重新排序](https://cloud.google.com/generative-ai-app-builder/docs/ranking)。

```python
pip install -qU langchain langchain-community langchain-google-community langchain-google-community[vertexaisearch] langchain-google-vertexai langchain-chroma langchain-text-splitters beautifulsoup4
```

### 设置

```python
PROJECT_ID = ""
REGION = ""
RANKING_LOCATION_ID = "global"  # @param {type:"string"}

# Initialize GCP project for Vertex AI
from google.cloud import aiplatform

aiplatform.init(project=PROJECT_ID, location=REGION)
```

### 加载和准备数据

在本示例中，我们将使用 [Google 维基页面](https://en.wikipedia.org/wiki/Google) 来演示 Vertex Ranking API 的工作原理。

我们使用标准的 `加载 -> 分割 -> 嵌入数据` 流程。

嵌入是使用 [Vertex Embeddings API](https://cloud.google.com/vertex-ai/generative-ai/docs/embeddings/get-text-embeddings#supported_models) 模型 `textembedding-gecko@003` 创建的。

```python
from langchain_chroma import Chroma
from langchain_community.document_loaders import WebBaseLoader
from langchain_google_vertexai import VertexAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter

vectordb = None

# Load wiki page
loader = WebBaseLoader("https://en.wikipedia.org/wiki/Google")
data = loader.load()

# Split doc into chunks
text_splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=5)
splits = text_splitter.split_documents(data)

print(f"Your {len(data)} documents have been split into {len(splits)} chunks")

if vectordb is not None:  # delete existing vectordb if it already exists
    vectordb.delete_collection()

embedding = VertexAIEmbeddings(model_name="textembedding-gecko@003")
vectordb = Chroma.from_documents(documents=splits, embedding=embedding)
```

```text
Your 1 documents have been split into 266 chunks
```

```python
import pandas as pd
from langchain_classic.retrievers.contextual_compression import ContextualCompressionRetriever
from langchain_google_community.vertex_rank import VertexAIRank

# Instantiate the VertexAIReranker with the SDK manager
reranker = VertexAIRank(
    project_id=PROJECT_ID,
    location_id=RANKING_LOCATION_ID,
    ranking_config="default_ranking_config",
    title_field="source",
    top_n=5,
)

basic_retriever = vectordb.as_retriever(search_kwargs={"k": 5})  # fetch top 5 documents

# Create the ContextualCompressionRetriever with the VertexAIRanker as a Reranker
retriever_with_reranker = ContextualCompressionRetriever(
    base_compressor=reranker, base_retriever=basic_retriever
)
```

### 测试 Vertex Ranking API

让我们用相同的查询来测试 `basic_retriever` 和 `retriever_with_reranker`，并比较检索到的文档。

Ranking API 接收来自 `basic_retriever` 的输入，并将其传递给 Ranking API。

排名 API 用于提高排序质量，并确定一个分数来指示每条记录与查询的相关性。

您可以看到未排序文档和已排序文档之间的区别。Ranking API 将语义上最相关的文档移动到 LLM 上下文窗口的顶部，从而帮助其形成更好的推理答案。

```python
import pandas as pd

# Use the basic_retriever and the retriever_with_reranker to get relevant documents
query = "how did the name google originate?"
retrieved_docs = basic_retriever.invoke(query)
reranked_docs = retriever_with_reranker.invoke(query)

# Create two lists of results for unranked and ranked docs
unranked_docs_content = [docs.page_content for docs in retrieved_docs]
ranked_docs_content = [docs.page_content for docs in reranked_docs]

# Create a comparison DataFrame using the padded lists
comparison_df = pd.DataFrame(
    {
        "Unranked Documents": unranked_docs_content,
        "Ranked Documents": ranked_docs_content,
    }
)

comparison_df
```

```html
  
<div id="df-43c4f5f2-c31d-4664-85dd-60cad39bd5fa" class="colab-df-container">

<div>
<style scoped>
.dataframe tbody tr th:only-of-type {
vertical-align: middle;
}

.dataframe tbody tr th {
vertical-align: top;
}

.dataframe thead th {
text-align: right;
}
</style>
<table border="1" class="dataframe">
<thead>
<tr style="text-align: right;">
<th></th>
<th>Unranked Documents</th>
<th>Ranked Documents</th>
</tr>
</thead>
<tbody>
<tr>
<th>0</th>
<td>^ a b Brin, Sergey; Page, Lawrence (1998). "The anatomy of a large-scale hypertextual Web search engine" (PDF). Computer Networks and ISDN Systems. 30 (1–7): 107–117. CiteSeerX 10.1.1.115.5930. doi:10.1016/S0169-7552(98)00110-X. ISSN 0169-7552. S2CID 7587743. Archived (PDF) from the original on September 27, 2015. Retrieved April 7, 2019.\n\n^ "About: RankDex". Archived from the original on January 20, 2012. Retrieved September 29, 2010., RankDex\n\n^ "Method for node ranking in a linked database". Google Patents. Archived from the original on October 15, 2015. Retrieved October 19, 2015.\n\n^ Koller, David (January 2004). "Origin of the name "Google"". Stanford University. Archived from the original on June 27, 2012.</td>
<td>The name "Google" originated from a misspelling of "googol",[211]\[212] which refers to the number represented by a 1 followed by one-hundred zeros. Page and Brin write in their original paper on PageRank:[33] "We chose our system name, Google, because it is a common spelling of googol, or 10100[,] and fits well with our goal of building very large-scale search engines." Having found its way increasingly into everyday language, the verb "google" was added to the Merriam Webster Collegiate Dictionary and the Oxford English Dictionary in 2006, meaning "to use the Google search engine to obtain information on the Internet."[213]\[214] Google's mission statement, from the outset, was "to organize the world's information and make it universally accessible and useful",[215] and its unofficial</td>
</tr>
<tr>
<th>1</th>
<td>Eventually, they changed the name to Google; the name of the search engine was a misspelling of the word googol,[21]\[36]\[37] a very large number written 10100 (1 followed by 100 zeros), picked to signify that the search engine was intended to provide large quantities of information.[38]</td>
<td>Eventually, they changed the name to Google; the name of the search engine was a misspelling of the word googol,[21]\[36]\[37] a very large number written 10100 (1 followed by 100 zeros), picked to signify that the search engine was intended to provide large quantities of information.[38]</td>
</tr>
<tr>
<th>2</th>
<td>The name "Google" originated from a misspelling of "googol",[211]\[212] which refers to the number represented by a 1 followed by one-hundred zeros. Page and Brin write in their original paper on PageRank:[33] "We chose our system name, Google, because it is a common spelling of googol, or 10100[,] and fits well with our goal of building very large-scale search engines." Having found its way increasingly into everyday language, the verb "google" was added to the Merriam Webster Collegiate Dictionary and the Oxford English Dictionary in 2006, meaning "to use the Google search engine to obtain information on the Internet."[213]\[214] Google's mission statement, from the outset, was "to organize the world's information and make it universally accessible and useful",[215] and its unofficial</td>
<td>^ Meijer, Bart (January 3, 2019). "Google shifted $23 billion to tax haven Bermuda in 2017: filing". Reuters. Archived from the original on January 3, 2019. Retrieved January 3, 2019. Google moved 19.9 billion euros ($22.7 billion) through a Dutch shell company to Bermuda in 2017, as part of an arrangement that allows it to reduce its foreign tax bill\n\n^ Hamburger, Tom; Gold, Matea (April 13, 2014). "Google, once disdainful of lobbying, now a master of Washington influence". The Washington Post. Archived from the original on October 27, 2017. Retrieved August 22, 2017.\n\n^ Koller, David (January 2004). "Origin of the name, "Google."". Stanford University. Archived from the original on June 27, 2012. Retrieved May 28, 2006.</td>
</tr>
<tr>
<th>3</th>
<td>^ Meijer, Bart (January 3, 2019). "Google shifted $23 billion to tax haven Bermuda in 2017: filing". Reuters. Archived from the original on January 3, 2019. Retrieved January 3, 2019. Google moved 19.9 billion euros ($22.7 billion) through a Dutch shell company to Bermuda in 2017, as part of an arrangement that allows it to reduce its foreign tax bill\n\n^ Hamburger, Tom; Gold, Matea (April 13, 2014). "Google, once disdainful of lobbying, now a master of Washington influence". The Washington Post. Archived from the original on October 27, 2017. Retrieved August 22, 2017.\n\n^ Koller, David (January 2004). "Origin of the name, "Google."". Stanford University. Archived from the original on June 27, 2012. Retrieved May 28, 2006.</td>
<td>^ a b Brin, Sergey; Page, Lawrence (1998). "The anatomy of a large-scale hypertextual Web search engine" (PDF). Computer Networks and ISDN Systems. 30 (1–7): 107–117. CiteSeerX 10.1.1.115.5930. doi:10.1016/S0169-7552(98)00110-X. ISSN 0169-7552. S2CID 7587743. Archived (PDF) from the original on September 27, 2015. Retrieved April 7, 2019.\n\n^ "About: RankDex". Archived from the original on January 20, 2012. Retrieved September 29, 2010., RankDex\n\n^ "Method for node ranking in a linked database". Google Patents. Archived from the original on October 15, 2015. Retrieved October 19, 2015.\n\n^ Koller, David (January 2004). "Origin of the name "Google"". Stanford University. Archived from the original on June 27, 2012.</td>
</tr>
<tr>
<th>4</th>
<td>^ Swant, Marty. "The World's Valuable Brands". Forbes. Archived from the original on October 18, 2020. Retrieved January 19, 2022.\n\n^ "Best Global Brands". Interbrand. Archived from the original on February 1, 2022. Retrieved March 7, 2011.\n\n^ a b c d "How we started and where we are today – Google". about.google. Archived from the original on April 22, 2020. Retrieved April 24, 2021.\n\n^ Brezina, Corona (2013). Sergey Brin, Larry Page, Eric Schmidt, and Google (1st ed.). New York: Rosen Publishing Group. p. 18. ISBN 978-1-4488-6911-4. LCCN 2011039480.\n\n^ a b c "Our history in depth". Google Company. Archived from the original on April 1, 2012. Retrieved July 15, 2017.</td>
<td>^ Swant, Marty. "The World's Valuable Brands". Forbes. Archived from the original on October 18, 2020. Retrieved January 19, 2022.\n\n^ "Best Global Brands". Interbrand. Archived from the original on February 1, 2022. Retrieved March 7, 2011.\n\n^ a b c d "How we started and where we are today – Google". about.google. Archived from the original on April 22, 2020. Retrieved April 24, 2021.\n\n^ Brezina, Corona (2013). Sergey Brin, Larry Page, Eric Schmidt, and Google (1st ed.). New York: Rosen Publishing Group. p. 18. ISBN 978-1-4488-6911-4. LCCN 2011039480.\n\n^ a b c "Our history in depth". Google Company. Archived from the original on April 1, 2012. Retrieved July 15, 2017.</td>
</tr>
</tbody>
</table>

</div>

    <div class="colab-df-buttons">

  <div class="colab-df-container">
    <button class="colab-df-convert" onclick="convertToInteractive('df-43c4f5f2-c31d-4664-85dd-60cad39bd5fa')"
title="Convert this dataframe to an interactive table."
style="display:none;">

  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960">
    <path d="M120-120v-720h720v720H120Zm60-500h600v-160H180v160Zm220 220h160v-160H400v160Zm0 220h160v-160H400v160ZM180-400h160v-160H180v160Zm440 0h160v-160H620v160ZM180-180h160v-160H180v160Zm440 0h160v-160H620v160Z"/>
  </svg>
    </button>

  <style>
.colab-df-container {
display:flex;
gap: 12px;
}

.colab-df-convert {
background-color: #E8F0FE;
border: none;
border-radius: 50%;
cursor: pointer;
display: none;
fill: #1967D2;
height: 32px;
padding: 0 0 0 0;
width: 32px;
}

.colab-df-convert:hover {
background-color: #E2EBFA;
box-shadow: 0px 1px 2px rgba(60, 64, 67, 0.3), 0px 1px 3px 1px rgba(60, 64, 67, 0.15);
fill: #174EA6;
}

.colab-df-buttons div {
margin-bottom: 4px;
}

[theme=dark] .colab-df-convert {
background-color: #3B4455;
fill: #D2E3FC;
}

[theme=dark] .colab-df-convert:hover {
background-color: #434B5C;
box-shadow: 0px 1px 3px 1px rgba(0, 0, 0, 0.15);
filter: drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.3));
fill: #FFFFFF;
}
  </style>

    <script>
const buttonEl =
document.querySelector('#df-43c4f5f2-c31d-4664-85dd-60cad39bd5fa button.colab-df-convert');
buttonEl.style.display =
google.colab.kernel.accessAllowed ? 'block' : 'none';

async function convertToInteractive(key) {
const element = document.querySelector('#df-43c4f5f2-c31d-4664-85dd-60cad39bd5fa');
const dataTable =
await google.colab.kernel.invokeFunction('convertToInteractive',
[key], {});
if (!dataTable) return;

const docLinkHtml = 'Like what you see? Visit the ' +
'<a target="_blank" href=https://colab.research.google.com/notebooks/data_table.ipynb>data table notebook</a>'
 + ' to learn more about interactive tables.';
element.innerHTML = '';
dataTable['output_type
