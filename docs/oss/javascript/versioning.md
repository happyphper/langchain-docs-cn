---
title: 版本控制
---
每个 LangChain 和 LangGraph 的版本号都遵循以下格式：`主版本号.次版本号.修订号`

- **主版本号**：包含破坏性 API 更新，需要修改代码。
- **次版本号**：包含新功能和改进，保持向后兼容性。
- **修订号**：包含错误修复和微小改进。

## 版本号规则

LangChain 和 LangGraph 遵循[语义化版本控制](https://semver.org/)原则：

- `1.0.0`：首个稳定版本，API 已可用于生产环境。
- `1.1.0`：以向后兼容的方式添加了新功能。
- `1.0.1`：向后兼容的错误修复。

## API 稳定性

我们通过以下方式传达 API 的稳定性：

### 稳定 API

所有没有特殊前缀的 API 都被视为稳定且可用于生产环境。我们为稳定功能保持向后兼容性，并且只在主版本中引入破坏性变更。

### Beta API

标记为 `beta` 的 API 功能完整，但可能会根据用户反馈进行微小调整。它们可以安全地用于生产环境，但在未来的版本中可能需要小的调整。

### Alpha API

标记为 `alpha` 的 API 是实验性的，可能会发生重大变更。在生产环境中使用这些 API 需谨慎。

### 已弃用 API

标记为 `deprecated` 的 API 将在未来的主版本中被移除。在可能的情况下，我们会指定计划移除的版本。处理弃用 API 的方法：

1.  切换到推荐的替代 API。
2.  遵循迁移指南（随主版本一同发布）。
3.  在可用时使用自动化迁移工具。

### 内部 API

某些 API 通过以下方式明确标记为“内部”：

- 部分文档会提及内部 API 并说明其性质。如果文档指出某物是内部的，它可能会发生变化。
- 函数、方法和其他对象以单个下划线 **`_`** 作为前缀。这是 Python 中表示私有内容的约定；任何以单个 **`_`** 开头的方法都是内部 API。
    - **例外情况：** 某些方法以 `_` 为前缀，但不包含实现。这些方法*旨在*由提供实现的子类重写。此类方法通常是 LangChain **公共 API** 的一部分。

## 发布周期

:::: details 主版本发布

主版本发布（例如，`1.0.0` → `2.0.0`）可能包含：

- 破坏性的 API 变更
- 已弃用功能的移除
- 重大的架构改进

我们提供：

- 详细的迁移指南
- 尽可能提供自动化迁移工具
- 对前一个主版本的延长支持期

::::

:::: details 次版本发布

次版本发布（例如，`1.0.0` → `1.1.0`）包含：

- 新功能和能力
- 性能改进
- 新的可选参数
- 向后兼容的增强功能

::::

:::: details 修订版本发布

修订版本发布（例如，`1.0.0` → `1.0.1`）包含：

- 错误修复
- 安全更新
- 文档改进
- 不涉及 API 变更的性能优化

::::

## 版本支持策略

- **最新的主版本**：完全支持，处于积极开发状态（ACTIVE 状态）
- **前一个主版本**：在下一个主版本发布后的 12 个月内提供安全更新和关键错误修复（MAINTENANCE 状态）
- **更早的版本**：仅提供社区支持

### 长期支持 (LTS) 版本

LangChain 和 LangGraph 1.0 均被指定为 LTS 版本：
- 版本 1.0 将保持 ACTIVE 状态，直到版本 2.0 发布
- 版本 2.0 发布后，版本 1.0 将进入 MAINTENANCE 模式至少 1 年
- LTS 版本遵循语义化版本控制 (semver)，允许在次版本之间安全升级
- 旧版本（LangChain 0.3 和 LangGraph 0.4）将保持 MAINTENANCE 模式直到 2026 年 12 月

有关发布状态和支持时间线的详细信息，请参阅[发布策略](/oss/release-policy)。

## 检查您的版本

要检查已安装的版本：

::: code-group

```javascript [LangChain]
import { version } from "langchain/package.json";
console.log(version);
```

```javascript [LangGraph]
import { version } from "@langchain/langgraph/package.json";
console.log(version);
```

:::

## 升级

::: code-group

```bash [LangChain]
# 升级到最新版本
npm update langchain @langchain/core

# 安装特定版本
npm install langchain@1.0.0 @langchain/core@1.0.0
```

```bash [LangGraph]
# 升级到最新版本
npm update @langchain/langgraph

# 安装特定版本
npm install @langchain/langgraph@1.0.0
```

:::

## 预发布版本

我们偶尔会发布 alpha 和 beta 版本用于早期测试：

- **Alpha**（例如，`1.0.0a1`）：早期预览版，预计会有重大变更。
- **Beta**（例如，`1.0.0b1`）：功能完整版，可能会有微小变更。
- **候选发布版**（例如，`1.0.0rc1`）：稳定版发布前的最终测试版。

## 另请参阅

- [发布策略](/oss/release-policy) - 详细的发布和弃用策略
- [版本发布](/oss/releases) - 特定版本的发布说明和迁移指南
