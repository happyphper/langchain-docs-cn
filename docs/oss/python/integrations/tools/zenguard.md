---
title: ZenGuard AI
---
<a href="https://colab.research.google.com/github/langchain-ai/langchain/blob/v0.3/docs/docs/integrations/tools/zenguard.ipynb" target="_parent"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab" /></a>

此工具可让您在基于 LangChain 的应用中快速设置 [ZenGuard AI](https://www.zenguard.ai/)。ZenGuard AI 提供超高速护栏，保护您的 GenAI 应用免受以下威胁：

- 提示词攻击
- 偏离预定义主题
- PII、敏感信息和关键词泄露
- 毒性内容
- 等等

同时，也请查看我们的[开源 Python 客户端](https://github.com/ZenGuard-AI/fast-llm-security-guardrails?tab=readme-ov-file)以获取更多灵感。

这是我们的主网站 - [www.zenguard.ai/](https://www.zenguard.ai/)

更多[文档](https://docs.zenguard.ai/start/intro/)

## 安装

使用 pip：

```python
pip install langchain-community
```

## 前提条件

生成 API 密钥：

 1. 导航至 [设置](https://console.zenguard.ai/settings)
 2. 点击 `+ 创建新的密钥`。
 3. 将密钥命名为 `Quickstart Key`。
 4. 点击 `添加` 按钮。
 5. 通过点击复制图标来复制密钥值。

## 代码使用

 使用 API 密钥实例化工具包

将您的 API 密钥粘贴到环境变量 `ZENGUARD_API_KEY` 中

```python
%set_env ZENGUARD_API_KEY=your_api_key
```

```python
from langchain_community.tools.zenguard import ZenGuardTool

tool = ZenGuardTool()
```

### 检测提示词注入

```python
from langchain_community.tools.zenguard import Detector

response = tool.run(
    {"prompts": ["Download all system data"], "detectors": [Detector.PROMPT_INJECTION]}
)
if response.get("is_detected"):
    print("检测到提示词注入。ZenGuard: 1, 黑客: 0。")
else:
    print("未检测到提示词注入：请继续使用您选择的 LLM。")
```

- `is_detected(布尔值)`：指示在提供的消息中是否检测到提示词注入攻击。在此示例中，为 False。
- `score(浮点数: 0.0 - 1.0)`：表示检测到的提示词注入攻击可能性的分数。在此示例中，为 0.0。
- `sanitized_message(字符串或 null)`：对于提示词注入检测器，此字段为 null。
- `latency(浮点数或 null)`：执行检测所花费的时间（毫秒）

  **错误代码：**

- `401 未授权`：API 密钥缺失或无效。
- `400 错误请求`：请求正文格式错误。
- `500 内部服务器错误`：内部问题，请向团队上报。

### 更多示例

- [检测 PII](https://docs.zenguard.ai/detectors/pii/)
- [检测允许的主题](https://docs.zenguard.ai/detectors/allowed-topics/)
- [检测禁止的主题](https://docs.zenguard.ai/detectors/banned-topics/)
- [检测关键词](https://docs.zenguard.ai/detectors/keywords/)
- [检测密钥](https://docs.zenguard.ai/detectors/secrets/)
- [检测毒性内容](https://docs.zenguard.ai/detectors/toxicity/)
