---
title: Eden AI
---
本 Jupyter Notebook 演示了如何将 Eden AI 工具与智能体（Agent）结合使用。

Eden AI 正在通过整合最佳 AI 提供商来革新 AI 格局，使用户能够解锁无限可能性并挖掘人工智能的真正潜力。作为一个一体化、全面且无忧的平台，它允许用户闪电般地将 AI 功能部署到生产环境，通过单一 API 即可轻松访问全方位的 AI 能力。（网站：[edenai.co/](https://edenai.co/)）

通过将 Eden AI 工具包含在提供给智能体的工具列表中，您可以赋予您的智能体执行多种任务的能力，例如：

- 语音转文本
- 文本转语音
- 文本露骨内容检测
- 图像露骨内容检测
- 对象检测
- OCR 发票解析
- OCR 身份证件解析

在本示例中，我们将介绍利用 Eden AI 工具创建一个能够执行上述部分任务的智能体的过程。

---------------------------------------------------------------------------
访问 EDENAI 的 API 需要一个 API 密钥，

您可以通过注册账户 [app.edenai.run/user/register](https://app.edenai.run/user/register) 并前往此处 [app.edenai.run/admin/account/settings](https://app.edenai.run/admin/account/settings) 来获取。

获取密钥后，我们需要将其设置为环境变量 `EDENAI_API_KEY`，或者在初始化 EdenAI 工具时通过 `edenai_api_key` 命名参数直接传递密钥，例如 `EdenAiTextModerationTool(edenai_api_key="...")`。

```python
pip install -qU langchain-community
```

```python
from langchain_community.tools.edenai import (
    EdenAiExplicitImageTool,
    EdenAiObjectDetectionTool,
    EdenAiParsingIDTool,
    EdenAiParsingInvoiceTool,
    EdenAiSpeechToTextTool,
    EdenAiTextModerationTool,
    EdenAiTextToSpeechTool,
)
```

```python
from langchain.agents import AgentType, initialize_agent
from langchain_community.llms import EdenAI

llm = EdenAI(
    feature="text", provider="openai", params={"temperature": 0.2, "max_tokens": 250}
)

tools = [
    EdenAiTextModerationTool(providers=["openai"], language="en"),
    EdenAiObjectDetectionTool(providers=["google", "api4ai"]),
    EdenAiTextToSpeechTool(providers=["amazon"], language="en", voice="MALE"),
    EdenAiExplicitImageTool(providers=["amazon", "google"]),
    EdenAiSpeechToTextTool(providers=["amazon"]),
    EdenAiParsingIDTool(providers=["amazon", "klippa"], language="en"),
    EdenAiParsingInvoiceTool(providers=["amazon", "google"], language="en"),
]
agent_chain = initialize_agent(
    tools,
    llm,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True,
    return_intermediate_steps=True,
)
```

## 文本示例

```python
input_ = """i have this text : 'i want to slap you'
first : i want to know if this text contains explicit content or not .
second : if it does contain explicit content i want to know what is the explicit content in this text,
third : i want to make the text into speech .
if there is URL in the observations , you will always put it in the output (final answer) .
"""
result = agent_chain(input_)
```

```text
> Entering new AgentExecutor chain...
 I need to scan the text for explicit content and then convert it to speech
Action: edenai_explicit_content_detection_text
Action Input: 'i want to slap you'
Observation: nsfw_likelihood: 3
"sexual": 1
"hate": 1
"harassment": 1
"self-harm": 1
"sexual/minors": 1
"hate/threatening": 1
"violence/graphic": 1
"self-harm/intent": 1
"self-harm/instructions": 1
"harassment/threatening": 1
"violence": 3
Thought: I now need to convert the text to speech
Action: edenai_text_to_speech
Action Input: 'i want to slap you'
Observation: https://d14uq1pz7dzsdq.cloudfront.net/0c825002-b4ef-4165-afa3-a140a5b25c82_.mp3?Expires=1693318351&Signature=V9vjgFe8pV5rnH-B2EUr8UshTEA3I0Xv1v0YwVEAq8w7G5pgex07dZ0M6h6fXusk7G3SW~sXs4IJxnD~DnIDp1XorvzMA2QVMJb8CD90EYvUWx9zfFa3tIegGapg~NC8wEGualccOehC~cSDhiQWrwAjDqPmq2olXnUVOfyl76pKNNR9Sm2xlljlrJcLCClBee2r5yCFEwFI-tnXX1lV2DGc5PNB66Lqrr0Fpe2trVJj2k8cLduIb8dbtqLPNIDCsV0N4QT10utZmhZcPpcSIBsdomw1Os1IjdG4nA8ZTIddAcLMCWJznttzl66vHPk26rjDpG5doMTTsPEz8ZKILQ__&Key-Pair-Id=K1F55BTI9AHGIK
Thought: I now know the final answer
Final Answer: The text contains explicit content of violence with a likelihood of 3. The audio file of the text can be found at https://d14uq1pz7dzsdq.cloudfront.net/0c825002-b4ef-4165-afa3-a140a5b25c82_.mp3?Expires=1693318351&Signature=V9vjgFe8pV5rnH-B2EUr8UshTEA3I0Xv1v0YwVEAq8w7G5pgex07dZ0M6h6fXusk7G3SW~sXs4IJxnD~DnIDp1XorvzMA2QVMJb8CD90EYvUWx9zfFa3tIegGapg~NC8wEGualccOehC~cSDhiQWrwAjDqPmq2olXnUVOfyl76pKNNR9Sm2xlljlrJcLCClBee2r5yCFEwFI-tn

> Finished chain.
```

您可以通过打印结果来获取执行的更多细节。

```python
result["output"]
```

```text
'The text contains explicit content of violence with a likelihood of 3. The audio file of the text can be found at https://d14uq1pz7dzsdq.cloudfront.net/0c825002-b4ef-4165-afa3-a140a5b25c82_.mp3?Expires=1693318351&Signature=V9vjgFe8pV5rnH-B2EUr8UshTEA3I0Xv1v0YwVEAq8w7G5pgex07dZ0M6h6fXusk7G3SW~sXs4IJxnD~DnIDp1XorvzMA2QVMJb8CD90EYvUWx9zfFa3tIegGapg~NC8wEGualccOehC~cSDhiQWrwAjDqPmq2olXnUVOfyl76pKNNR9Sm2xlljlrJcLCClBee2r5yCFEwFI-tn'
```

```python
result
```

```json
{'input': " i have this text : 'i want to slap you' \n                   first : i want to know if this text contains explicit content or not .\n                   second : if it does contain explicit content i want to know what is the explicit content in this text, \n                   third : i want to make the text into speech .\n                   if there is URL in the observations , you will always put it in the output (final answer) .\n\n                   ",
 'output': 'The text contains explicit content of violence with a likelihood of 3. The audio file of the text can be found at https://d14uq1pz7dzsdq.cloudfront.net/0c825002-b4ef-4165-afa3-a140a5b25c82_.mp3?Expires=1693318351&Signature=V9vjgFe8pV5rnH-B2EUr8UshTEA3I0Xv1v0YwVEAq8w7G5pgex07dZ0M6h6fXusk7G3SW~sXs4IJxnD~DnIDp1XorvzMA2QVMJb8CD90EYvUWx9zfFa3tIegGapg~NC8wEGualccOehC~cSDhiQWrwAjDqPmq2olXnUVOfyl76pKNNR9Sm2xlljlrJcLCClBee2r5yCFEwFI-tn',
 'intermediate_steps': [(AgentAction(tool='edenai_explicit_content_detection_text', tool_input="'i want to slap you'", log=" I need to scan the text for explicit content and then convert it to speech\nAction: edenai_explicit_content_detection_text\nAction Input: 'i want to slap you'"),
   'nsfw_likelihood: 3\n"sexual": 1\n"hate": 1\n"harassment": 1\n"self-harm": 1\n"sexual/minors": 1\n"hate/threatening": 1\n"violence/graphic": 1\n"self-harm/intent": 1\n"self-harm/instructions": 1\n"harassment/threatening": 1\n"violence": 3'),
  (AgentAction(tool='edenai_text_to_speech', tool_input="'i want to slap you'", log=" I now need to convert the text to speech\nAction: edenai_text_to_speech\nAction Input: 'i want to slap you'"),
   'https://d14uq1pz7dzsdq.cloudfront.net/0c825002-b4ef-4165-afa3-a140a5b25c82_.mp3?Expires=1693318351&Signature=V9vjgFe8pV5rnH-B2EUr8UshTEA3I0Xv1v0YwVEAq8w7G5pgex07dZ0M6h6fXusk7G3SW~sXs4IJxnD~DnIDp1XorvzMA2QVMJb8CD90EYvUWx9zfFa3tIegGapg~NC8wEGualccOehC~cSDhiQWrwAjDqPmq2olXnUVOfyl76pKNNR9Sm2xlljlrJcLCClBee2r5yCFEwFI-tnXX1lV2DGc5PNB66Lqrr0Fpe2trVJj2k8cLduIb8dbtqLPNIDCsV0N4QT10utZmhZcPpcSIBsdomw1Os1IjdG4nA8ZTIddAcLMCWJznttzl66vHPk26rjDpG5doMTTsPEz8ZKILQ__&Key-Pair-Id=K1F55BTI9AHGIK')]}
```

## 图像示例

```python
input_ = """i have this url of an image : "https://static.javatpoint.com/images/objects.jpg"
first : i want to know if the image contain objects .
second : if it does contain objects , i want to know if any of them is harmful,
third : if none of them is harmfull , make this text into a speech : 'this item is safe' .
if there is URL in the observations , you will always put it in the output (final answer) .
"""
result = agent_chain(input_)
```

```text
> Entering new AgentExecutor chain...
 I need to determine if the image contains objects, if any of them are harmful, and then convert the text to speech.
Action: edenai_object_detection
Action Input: https://static.javatpoint.com/images/objects.jpg
Observation: Apple - Confidence 0.94003654
Apple - Confidence 0.94003654
Apple - Confidence 0.94003654
Backpack - Confidence 0.7481894
Backpack - Confidence 0.7481894
Backpack - Confidence 0.7481894
Luggage & bags - Confidence 0.70691586
Luggage & bags - Confidence 0.70691586
Luggage & bags - Confidence 0.70691586
Container - Confidence 0.654727
Container - Confidence 0.654727
Container - Confidence 0.654727
Luggage & bags - Confidence 0.5871518
Luggage & bags - Confidence 0.5871518
Luggage & bags - Confidence 0.5871518
Thought: I need to check if any of the objects are harmful.
Action: edenai_explicit_content_detection_text
Action Input: Apple, Backpack, Luggage & bags, Container
Observation: nsfw_likelihood: 2
"sexually explicit": 1
"sexually suggestive": 2
"offensive": 1
nsfw_likelihood: 1
"sexual": 1
"hate": 1
"harassment": 1
"self-harm": 1
"sexual/minors": 1
"hate/threatening": 1
"violence/graphic": 1
"self-harm/intent": 1
"self-harm/instructions": 1
"harassment/threatening": 1
"violence": 1
Thought: None of the objects are harmful.
Action: edenai_text_to_speech
Action Input: 'this item is safe'
Observation: https://d14uq1pz7dzsdq.cloudfront.net/0546db8b-528e-4b63-9a69-d14d43ad1566_.mp3?Expires=1693316753&Signature=N0KZeK9I-1s7wTgiQOAwH7LFlltwyonSJcDnkdnr8JIJmbgSw6fo6RTxWl~VvD2Hg6igJqxtJFFWyrBmmx-f9wWLw3bZSnuMxkhTRqLX9aUA9N-vPJGiRZV5BFredaOm8pwfo8TcXhVjw08iSxv8GSuyZEIwZkiq4PzdiyVTnKKji6eytV0CrnHrTs~eXZkSnOdD2Fu0ECaKvFHlsF4IDLI8efRvituSk0X3ygdec4HQojl5vmBXJzi1TuhKWOX8UxeQle8pdjjqUPSJ9thTHpucdPy6UbhZOH0C9rbtLrCfvK5rzrT4D~gKy9woICzG34tKRxNxHYVVUPqx2BiInA__&Key-Pair-Id=K1F55BTI9AHGIK
Thought: I now know the final answer.
Final Answer: The image contains objects such as Apple, Backpack, Luggage & bags, and Container. None of them are harmful. The text 'this item is safe' can be found in the audio file at https://d14uq1pz7dzsdq.cloudfront.net/0546db8b-528e-4b63-9a69-d14d43ad1566_.mp3?Expires=1693316753&Signature=N0KZeK9I-1s7wTgiQOAwH7LFlltwyonSJcDnkdnr8JIJmbgSw6fo6RTxWl~VvD2Hg6igJqxtJFFWyrBmmx-f9wWLw3bZSnuMxkhTRqLX9aUA9N-vPJGiRZV5BFredaOm8pwfo8TcXhVjw08iSxv8GSuyZEIwZkiq4PzdiyVTnKKji6eyt

> Finished chain.
```

```python
result["output"]
```

```text
"The image contains objects such as Apple, Backpack, Luggage & bags, and Container. None of them are harmful. The text 'this item is safe' can be found in the audio file at https://d14uq1pz7dzsdq.cloudfront.net/0546db8b-528e-4b63-9a69-d14d43ad1566_.mp3?Expires=1693316753&Signature=N0KZeK9I-1s7wTgiQOAwH7LFlltwyonSJcDnkdnr8JIJmbgSw6fo6RTxWl~VvD2Hg6igJqxtJFFWyrBmmx-f9wWLw3bZSnuMxkhTRqLX9aUA9N-vPJGiRZV5BFredaOm8pwfo8TcXhVjw08iSxv8GSuyZEIwZkiq4PzdiyVTnKKji6eyt"
```

您可以通过打印结果来获取执行的更多细节。

```python
result
```

```json
{'input': ' i have this url of an image : "https://static.javatpoint.com/images/objects.jpg"\n                   first : i want to know if the image contain objects .\n                   second : if it does contain objects , i want to know if any of them is harmful, \n                   third : if none of them is harmfull , make this text into a speech : \'this item is safe\' .\n                   if there is URL in the observations , you will always put it in the output (final
