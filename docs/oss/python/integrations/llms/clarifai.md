---
title: Clarifai
---
>[Clarifai](https://www.clarifai.com/) 是一个 AI 平台，提供涵盖数据探索、数据标注、模型训练、评估和推理的完整 AI 生命周期。

本示例将介绍如何使用 LangChain 与 `Clarifai` [模型](https://clarifai.com/explore/models) 进行交互。

要使用 Clarifai，您必须拥有一个账户和一个个人访问令牌 (PAT) 密钥。
[点击此处](https://clarifai.com/settings/security) 获取或创建 PAT。

# 依赖项

```python
# 安装所需的依赖项
pip install -qU  clarifai
```

```python
# 将 clarifai pat 令牌声明为环境变量，或者您可以在 clarifai 类中将其作为参数传递。
import os

os.environ["CLARIFAI_PAT"] = "CLARIFAI_PAT_TOKEN"
```

# 导入

这里我们将设置个人访问令牌。您可以在 Clarifai 账户的 [settings/security](https://clarifai.com/settings/security) 下找到您的 PAT。

```python
# 请登录并从 https://clarifai.com/settings/security 获取您的 API 密钥
from getpass import getpass

CLARIFAI_PAT = getpass()
```

```python
# 导入所需的模块
from langchain_classic.chains import LLMChain
from langchain_community.llms import Clarifai
from langchain_core.prompts import PromptTemplate
```

# 输入

创建一个用于 LLM 链的提示模板：

```python
template = """问题：{question}

回答：让我们一步步思考。"""

prompt = PromptTemplate.from_template(template)
```

# 设置

设置模型所在的用户 ID 和应用 ID。您可以在 [clarifai.com/explore/models](https://clarifai.com/explore/models) 上找到公共模型列表。

您还需要初始化模型 ID，如果需要，还要初始化模型版本 ID。有些模型有许多版本，您可以选择适合您任务的版本。

或者，您可以使用 model_url（例如："[clarifai.com/anthropic/completion/models/claude-v2](https://clarifai.com/anthropic/completion/models/claude-v2)"）进行初始化。

```python
USER_ID = "openai"
APP_ID = "chat-completion"
MODEL_ID = "GPT-3_5-turbo"

# 您可以将特定的模型版本作为 model_version_id 参数提供。
# MODEL_VERSION_ID = "MODEL_VERSION_ID"
# 或者

MODEL_URL = "https://clarifai.com/openai/chat-completion/models/GPT-4"
```

```python
# 初始化一个 Clarifai LLM
clarifai_llm = Clarifai(user_id=USER_ID, app_id=APP_ID, model_id=MODEL_ID)
# 或者
# 通过模型 URL 初始化
clarifai_llm = Clarifai(model_url=MODEL_URL)
```

```python
# 创建 LLM 链
llm_chain = LLMChain(prompt=prompt, llm=clarifai_llm)
```

# 运行链

```python
question = "贾斯汀·比伯出生那年，哪支 NFL 球队赢得了超级碗？"

llm_chain.run(question)
```

```text
' 好的，以下是解决这个问题的步骤：\n\n1. 贾斯汀·比伯出生于 1994 年 3 月 1 日。\n\n2. 他出生那年举行的超级碗是第 28 届超级碗。\n\n3. 第 28 届超级碗于 1994 年 1 月 30 日举行。\n\n4. 参加第 28 届超级碗的两支球队是达拉斯牛仔队和布法罗比尔队。\n\n5. 达拉斯牛仔队以 30-13 击败布法罗比尔队，赢得了第 28 届超级碗。\n\n因此，在贾斯汀·比伯出生那年赢得超级碗的 NFL 球队是达拉斯牛仔队。'
```

## 使用 GPT 的推理参数进行模型预测

或者，您可以使用带有推理参数（如 temperature、max_tokens 等）的 GPT 模型。

```python
# 将参数初始化为字典。
params = dict(temperature=str(0.3), max_tokens=100)
```

```python
clarifai_llm = Clarifai(user_id=USER_ID, app_id=APP_ID, model_id=MODEL_ID)
llm_chain = LLMChain(
    prompt=prompt, llm=clarifai_llm, llm_kwargs={"inference_params": params}
)
```

```python
question = "可以组成多少个三位偶数，使得如果其中一位数字是 5，则下一位数字必须是 7？"

llm_chain.run(question)
```

```text
'步骤 1：第一位数字可以是 1 到 9 中的任意偶数，除了 5。所以第一位数字有 4 种选择。\n\n步骤 2：如果第一位数字不是 5，那么第二位数字必须是 7。所以第二位数字只有 1 种选择。\n\n步骤 3：第三位数字可以是 0 到 9 中的任意偶数，除了 5 和 7。所以有 '
```

为提示列表生成响应

```python
# 我们可以使用 _generate 为提示列表生成响应。
clarifai_llm._generate(
    [
        "请用 5 句话帮我总结美国独立战争的事件",
        "用有趣的方式解释火箭科学",
        "为大学运动会创建一个欢迎致辞的脚本",
    ],
    inference_params=params,
)
```

```text
LLMResult(generations=[[Generation(text=' 以下是美国独立战争关键事件的 5 句话总结：\n\n美国独立战争始于美国殖民者与英国政府之间因“无代表不纳税”等问题而日益紧张的局势。1775 年，英国军队与美国民兵在列克星敦和康科德爆发战斗，开始了独立战争。大陆会议任命乔治·华盛顿为大陆军总司令，大陆军随后赢得了对英军的关键胜利。1776 年，《独立宣言》获得通过，正式宣布 13 个美洲殖民地脱离英国统治。经过多年战斗，独立战争以 1781 年英军在约克镇战败并承认美国独立而告终。')], [Generation(text=" 以下是对火箭科学的幽默解释：\n\n火箭科学太简单了，简直就是儿戏！只要把一个装满爆炸性液体的大金属管绑在屁股上，然后点燃引信。能出什么错呢？发射！嗖的一声，你马上就能飞到月球了。只要记住戴上头盔，否则当你离开大气层时，你的头可能会像青春痘一样爆开。\n\n制造火箭也是小菜一碟。只需混合一些辛辣的香料、大蒜粉、辣椒粉、少许火药，瞧——火箭燃料就做好了！如果你想要额外的冲击力，可以加一点小苏打和醋。摇匀后倒入你的 DIY 苏打瓶火箭中。退后一步，看着那个小家伙一飞冲天！\n\n引导火箭是整个家庭的乐趣。只需系好安全带，按下一些随机按钮，看看你最终会到哪里。这就像终极惊喜假期！你永远不知道你是会到达金星，坠毁在火星上，还是快速穿过土星环。\n\n如果出了什么问题，别担心。火箭科学轻松愉快。只需用一些胶带和强力胶进行现场故障排除，你马上就能回到正轨。有了这些，谁还需要任务控制中心！")], [Generation(text=" 以下是大学运动会欢迎致辞的草稿：\n\n大家早上好，欢迎来到我们大学一年一度的运动会！今天看到这么多学生、教职员工、校友和嘉宾齐聚一堂，庆祝我们大学的体育精神和运动成就，真是太棒了。\n\n首先，让我们感谢所有在幕后辛勤工作的组织者、志愿者、教练和工作人员，是你们使这次活动成为可能。没有你们的奉献和承诺，我们的运动会就不会举行。\n\n我还要感谢今天在场的所有学生运动员。你们的才华、精神和决心激励着我们。体育具有独特的力量，能够团结和激励我们的社区。通过个人和团队运动，你们展现了专注、协作、毅力和韧性——这些品质将使你们在赛场内外都受益匪浅。\n\n竞争精神和公平竞赛是任何体育赛事的核心价值。我鼓励你们所有人今天都热情地参与竞争。尽你所能，享受乐趣。无论结果如何，都要为你同伴运动员的努力和体育精神鼓掌。\n\n无论输赢，这个运动会都是我们建立友谊和创造终生回忆的日子。让我们把它变成所有人健身和友谊的一天。那么，让比赛开始吧。祝大家玩得开心！")]], llm_output=None, run=None)
```

```python

```
