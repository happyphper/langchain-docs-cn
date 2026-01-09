---
title: Gradio
---
`Hugging Face Spaces` 上有数千个 `Gradio` 应用。这个库让它们触手可及，成为您大语言模型（LLM）的得力工具 🦾

具体来说，`gradio-tools` 是一个 Python 库，用于将 `Gradio` 应用转换为工具，供基于大语言模型（LLM）的智能体（agent）使用，以完成任务。例如，LLM 可以使用一个 `Gradio` 工具转录它在网上找到的语音记录，然后为您总结。或者，它可以使用另一个 `Gradio` 工具对您 Google Drive 上的文档进行 OCR（光学字符识别），然后回答相关问题。

如果您想使用的空间不是预构建工具之一，创建自己的工具也非常简单。请参阅 gradio-tools 文档的相关部分以了解如何操作。欢迎所有贡献！

```python
pip install -qU  gradio_tools langchain-community
```

## 使用工具

```python
from gradio_tools.tools import StableDiffusionTool
```

```python
local_file_path = StableDiffusionTool().langchain.run(
    "Please create a photo of a dog riding a skateboard"
)
local_file_path
```

```text
Loaded as API: https://gradio-client-demos-stable-diffusion.hf.space ✔

Job Status: Status.STARTING eta: None
```

```text
'/Users/harrisonchase/workplace/langchain/docs/modules/agents/tools/integrations/b61c1dd9-47e2-46f1-a47c-20d27640993d/tmp4ap48vnm.jpg'
```

```python
from PIL import Image
```

```python
im = Image.open(local_file_path)
```

```python
from IPython.display import display

display(im)
```

## 在智能体中使用

```python
from gradio_tools.tools import (
    ImageCaptioningTool,
    StableDiffusionPromptGeneratorTool,
    StableDiffusionTool,
    TextToVideoTool,
)
from langchain.agents import initialize_agent
from langchain.memory import ConversationBufferMemory
from langchain_openai import OpenAI

llm = OpenAI(temperature=0)
memory = ConversationBufferMemory(memory_key="chat_history")
tools = [
    StableDiffusionTool().langchain,
    ImageCaptioningTool().langchain,
    StableDiffusionPromptGeneratorTool().langchain,
    TextToVideoTool().langchain,
]

agent = initialize_agent(
    tools, llm, memory=memory, agent="conversational-react-description", verbose=True
)
output = agent.run(
    input=(
        "Please create a photo of a dog riding a skateboard "
        "but improve my prompt prior to using an image generator."
        "Please caption the generated image and create a video for it using the improved prompt."
    )
)
```

```text
Loaded as API: https://gradio-client-demos-stable-diffusion.hf.space ✔
Loaded as API: https://taesiri-blip-2.hf.space ✔
Loaded as API: https://microsoft-promptist.hf.space ✔
Loaded as API: https://damo-vilab-modelscope-text-to-video-synthesis.hf.space ✔

> Entering new AgentExecutor chain...

Thought: Do I need to use a tool? Yes
Action: StableDiffusionPromptGenerator
Action Input: A dog riding a skateboard
Job Status: Status.STARTING eta: None

Observation: A dog riding a skateboard, digital painting, artstation, concept art, smooth, sharp focus, illustration, art by artgerm and greg rutkowski and alphonse mucha
Thought: Do I need to use a tool? Yes
Action: StableDiffusion
Action Input: A dog riding a skateboard, digital painting, artstation, concept art, smooth, sharp focus, illustration, art by artgerm and greg rutkowski and alphonse mucha
Job Status: Status.STARTING eta: None

Job Status: Status.PROCESSING eta: None

Observation: /Users/harrisonchase/workplace/langchain/docs/modules/agents/tools/integrations/2e280ce4-4974-4420-8680-450825c31601/tmpfmiz2g1c.jpg
Thought: Do I need to use a tool? Yes
Action: ImageCaptioner
Action Input: /Users/harrisonchase/workplace/langchain/docs/modules/agents/tools/integrations/2e280ce4-4974-4420-8680-450825c31601/tmpfmiz2g1c.jpg
Job Status: Status.STARTING eta: None

Observation: a painting of a dog sitting on a skateboard
Thought: Do I need to use a tool? Yes
Action: TextToVideo
Action Input: a painting of a dog sitting on a skateboard
Job Status: Status.STARTING eta: None
Due to heavy traffic on this app, the prediction will take approximately 73 seconds.For faster predictions without waiting in queue, you may duplicate the space using: Client.duplicate(damo-vilab/modelscope-text-to-video-synthesis)

Job Status: Status.IN_QUEUE eta: 73.89824726581574
Due to heavy traffic on this app, the prediction will take approximately 42 seconds.For faster predictions without waiting in queue, you may duplicate the space using: Client.duplicate(damo-vilab/modelscope-text-to-video-synthesis)

Job Status: Status.IN_QUEUE eta: 42.49370198879602

Job Status: Status.IN_QUEUE eta: 21.314297944849187

Observation: /var/folders/bm/ylzhm36n075cslb9fvvbgq640000gn/T/tmp5snj_nmzf20_cb3m.mp4
Thought: Do I need to use a tool? No
AI: Here is a video of a painting of a dog sitting on a skateboard.

> Finished chain.
```

```python

```
