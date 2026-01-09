---
title: 组织和工作空间操作参考
sidebarTitle: Organization and workspace operations
mode: wide
---
本页面提供了[工作区](/langsmith/administration-overview#workspaces)和[组织](/langsmith/administration-overview#organizations)操作的完整参考表，并列出了可以执行这些操作的角色。

列表中包含了 LangSmith 的 API 操作以及：

- 哪些系统角色可以执行每个操作。
- 所需的特定权限字符串。
- 关于部分访问或特殊情况的说明。

<Info>

有关 LangSmith RBAC 系统的概述、角色定义和权限概念，请参阅[基于角色的访问控制](/langsmith/rbac)。

</Info>

## 目录

| 组织级操作 | 工作区级操作 |
|-------------------------------|---------------------------|
| **核心管理：**<br/>• [组织设置](#organization-settings)：组织信息和配置<br/>• [工作区](#workspaces)：工作区管理<br/>• [组织成员](#organization-members)：成员管理<br/>• [角色和权限](#roles-and-permissions)：自定义角色 | **核心资源：**<br/>• [项目](#projects)：组织追踪和运行<br/>• [运行](#runs)：单个执行追踪<br/>• [数据集](#datasets)：用于评估的测试数据集<br/>• [示例](#examples)：单个数据集示例<br/>• [实验](#experiments)：对比实验 |
| **安全和认证：**<br/>• [SSO 和认证](#sso-and-authentication)：单点登录设置<br/>• [SCIM](#scim)：身份配置<br/>• [访问策略](#access-policies)：基于属性的访问控制 | **监控和分析：**<br/>• [规则](#rules)：自动化运行规则<br/>• [警报](#alerts)：监控警报规则<br/>• [反馈](#feedback)：输出上的评分和标签<br/>• [标注队列](#annotation-queues)：人工审核队列<br/>• [图表](#charts)：自定义可视化 |
| **计费和账户：**<br/>• [计费和支付](#billing-and-payments)：订阅管理<br/>• [API 密钥](#api-keys)：组织级密钥 | **开发和配置：**<br/>• [提示词](#prompts)：提示词模板 (LangChain Hub)<br/>• [部署](#deployments)：部署配置<br/>• [MCP 服务器](#mcp-servers)：模型上下文协议服务器 |
| **分析：**<br/>• [图表和仪表板](#organization-charts-and-dashboards)：组织级可视化<br/>• [使用情况和分析](#usage-and-analytics)：使用情况追踪和 TTL 设置 | **工作区管理：**<br/>• [工作区设置](#workspace-settings-and-management)：成员、设置<br/>• [标签](#tags)：元数据标签系统<br/>• [批量导出](#bulk-exports)：数据导出操作 |

**附加信息：**

- [用户级操作](#user-level-operations)：所有认证用户可执行的操作
- [权限继承](#permission-inheritance)：角色在组织/工作区间的继承方式

## 图例

- ✓ **允许**：拥有此角色的用户可以执行此操作
- ✗ **不允许**：拥有此角色的用户不能执行此操作
- ⚠ **部分**：用户拥有有限访问权限（参见说明）

## 组织级操作

<Info>

组织级操作由组织角色控制，这些角色独立于 RBAC 功能。在[基于角色的访问控制](/langsmith/rbac#organization-roles)指南中了解更多信息。

</Info>

### 组织设置

| 操作 | 组织管理员 | 组织用户 | 组织查看者 | 所需权限 |
|-----------|:---------:|:--------:|:----------:|---------------------|
| 查看组织信息 | ✓ | ✓ | ✓ | `organization:read` |
| 查看组织仪表板 | ✓ | ✓ | ✓ | `organization:read` |
| 更新组织信息 | ✓ | ✗ | ✗ | `organization:manage` |
| 查看计费信息 | ✓ | ✓ | ✓ | `organization:read` |
| 查看公司信息 | ✓ | ✓ | ✓ | `organization:read` |
| 设置公司信息 | ✓ | ✗ | ✗ | `organization:manage` |

### 工作区

组织级工作区管理操作。

| 操作 | 组织管理员 | 组织用户 | 组织查看者 | 所需权限 |
|-----------|:---------:|:--------:|:----------:|---------------------|
| 列出所有工作区 | ✓ | ✓ | ✓ | `organization:read` |
| 创建工作区 | ✓ | ✗ | ✗ | `organization:manage` |

### 组织成员

| 操作 | 组织管理员 | 组织用户 | 组织查看者 | 所需权限 |
|-----------|:---------:|:--------:|:----------:|---------------------|
| 查看组织成员 | ✓ | ✓ | ✓ | `organization:read` |
| 查看活跃组织成员 | ✓ | ✓ | ✓ | `organization:read` |
| 查看待处理组织成员 | ✓ | ✓ | ✓ | `organization:read` |
| 邀请成员加入组织 | ✓ | ✗ | ✗ | `organization:manage` |
| 批量邀请成员 | ✓ | ✗ | ✗ | `organization:manage` |
| 添加基础认证成员 | ✓ | ✗ | ✗ | `organization:manage` |
| 移除组织成员 | ✓ | ✗ | ✗ | `organization:manage` |
| 更新组织成员角色 | ✓ | ✗ | ✗ | `organization:manage` |
| 删除待处理组织成员 | ✓ | ✗ | ✗ | `organization:manage` |

### 角色和权限

| 操作 | 组织管理员 | 组织用户 | 组织查看者 | 所需权限 |
|-----------|:---------:|:--------:|:----------:|---------------------|
| 列出组织角色 | ✓ | ✓ | ✓ | `organization:read` |
| 列出可用权限 | ✓ | ✓ | ✓ | N/A (用户级) |
| 创建自定义角色 | ✓ | ✗ | ✗ | `organization:manage` |
| 更新自定义角色 | ✓ | ✗ | ✗ | `organization:manage` |
| 删除自定义角色 | ✓ | ✗ | ✗ | `organization:manage` |

### SSO 和认证

| 操作 | 组织管理员 | 组织用户 | 组织查看者 | 所需权限 |
|-----------|:---------:|:--------:|:----------:|---------------------|
| 查看 SSO 设置 | ✓ | ✓ | ✓ | `organization:read` |
| 创建 SSO 设置 | ✓ | ✗ | ✗ | `organization:manage` |
| 更新 SSO 设置 | ✓ | ✗ | ✗ | `organization:manage` |
| 删除 SSO 设置 | ✓ | ✗ | ✗ | `organization:manage` |
| 查看登录方法 | ✓ | ✓ | ✓ | `organization:read` |
| 更新允许的登录方法 | ✓ | ✗ | ✗ | `organization:manage` |
| 设置默认 SSO 配置 | ✓ | ✗ | ✗ | `organization:manage` |

### SCIM

用于用户配置的跨域身份管理系统。

| 操作 | 组织管理员 | 组织用户 | 组织查看者 | 所需权限 |
|-----------|:---------:|:--------:|:----------:|---------------------|
| 列出 SCIM 令牌 | ✓ | ✓ | ✓ | `organization:read` |
| 获取 SCIM 令牌 | ✓ | ✓ | ✓ | `organization:read` |
| 创建 SCIM 令牌 | ✓ | ✗ | ✗ | `organization:manage` |
| 更新 SCIM 令牌 | ✓ | ✗ | ✗ | `organization:manage` |
| 删除 SCIM 令牌 | ✓ | ✗ | ✗ | `organization:manage` |

### 访问策略

用于细粒度权限的基于属性的访问控制 (ABAC) 策略。

<Note>

ABAC 处于私有预览阶段。

</Note>

| 操作 | 组织管理员 | 组织用户 | 组织查看者 | 所需权限 |
|-----------|:---------:|:--------:|:----------:|---------------------|
| 列出访问策略 | ✓ | ✓ | ✓ | `organization:read` |
| 获取访问策略 | ✓ | ✓ | ✓ | `organization:read` |
| 创建访问策略 | ✓ | ✗ | ✗ | `organization:manage` |
| 删除访问策略 | ✓ | ✗ | ✗ | `organization:manage` |
| 将访问策略附加到角色 | ✓ | ✗ | ✗ | `organization:manage` |

### 计费和支付

| 操作 | 组织管理员 | 组织用户 | 组织查看者 | 所需权限 |
|-----------|:---------:|:--------:|:----------:|---------------------|
| 创建 Stripe 设置意图 | ✓ | ✗ | ✗ | `organization:manage` |
| 处理支付方式创建 | ✓ | ✗ | ✗ | `organization:manage` |
| 更改支付计划 | ✓ | ✗ | ✗ | `organization:manage` |
| 创建 Stripe 结账会话 | ✓ | ✗ | ✗ | `organization:manage` |
| 确认结账完成 | ✓ | ✗ | ✗ | `organization:manage` |
| 创建 Stripe 账户链接 | ✓ | ✗ | ✗ | `organization:manage` |

### API 密钥

| 操作 | 组织管理员 | 组织用户 | 组织查看者 | 所需权限 |
|-----------|:---------:|:--------:|:----------:|---------------------|
| 列出组织范围的 API 密钥 | ✓ | ✓ | ✓ | `organization:read` |
| 创建组织范围的 API 密钥 (工作区范围)* | ✓ | ⚠ | ✗ | `organization:pats:create` |
| 创建组织范围的 API 密钥 (组织范围)* | ✓ | ✗ | ✗ | `organization:pats:create` + `organization:manage` |
| 列出个人访问令牌 | ✓ | ✓ | ✗ | `organization:read` |
| 创建个人访问令牌 | ✓ | ✓ | ✗ | `organization:pats:create` |
| 删除个人访问令牌 | ✓ | ✓ | ✗ | `organization:read` |

<Note>

\* 组织用户只能为其担任工作区管理员的工作区创建工作区范围的 API 密钥。组织范围的 API 密钥需要组织管理员角色。

</Note>

### 组织图表和仪表板

| 操作 | 组织管理员 | 组织用户 | 组织查看者 | 所需权限 |
|-----------|:---------:|:--------:|:----------:|---------------------|
| 列出组织图表 | ✓ | ✓ | ✓ | `organization:read` |
| 按 ID 获取组织图表 | ✓ | ✓ | ✓ | `organization:read` |
| 创建组织图表 | ✓ | ✗ | ✗ | `organization:manage` |
| 更新组织图表 | ✓ | ✗ | ✗ | `organization:manage` |
| 删除组织图表 | ✓ | ✗ | ✗ | `organization:manage` |
| 渲染组织图表 | ✓ | ✓ | ✓ | `organization:read` |
| 获取组织图表部分 | ✓ | ✓ | ✓ | `organization:read` |
| 创建组织图表部分 | ✓ | ✗ | ✗ | `organization:manage` |
| 更新组织图表部分 | ✓ | ✗ | ✗ | `organization:manage` |
| 删除组织图表部分 | ✓ | ✗ | ✗ | `organization:manage` |
| 渲染组织图表部分 | ✓ | ✓ | ✓ | `organization:read` |

### 使用情况和分析

| 操作 | 组织管理员 | 组织用户 | 组织查看者 | 所需权限 |
|-----------|:---------:|:--------:|:----------:|---------------------|
| 查看组织使用情况 | ✓ | ✓ | ✓ | `organization:read` |
| 查看 TTL 设置 | ✓ | ✓ | ✓ | `organization:read` |
| 更新或插入 TTL 设置 | ✓ | ✗ | ✗ | `organization:manage` |

## 工作区级操作

这些操作由[工作区级角色和权限](/langsmith/rbac#workspace-roles)控制。

<Tip>

要了解每个角色的含义及其整体能力，请参阅[基于角色的访问控制](/langsmith/rbac)指南。

</Tip>

### 项目

项目用于组织来自 LLM 应用程序的追踪和运行。

| 操作 | 工作区管理员 | 工作区编辑者 | 工作区查看者 | 所需权限 |
|-----------|:---------------:|:--------------:|:----------------:|---------------------|
| 创建新项目 | ✓ | ✗ | ✗ | `projects:create` |
| 查看项目列表 | ✓ | ✓ | ✓ | `projects:read` |
| 查看项目详情 | ✓ | ✓ | ✓ | `projects:read` |
| 查看预构建仪表板 | ✓ | ✓ | ✓ | `projects:read` |
| 查看项目元数据 (前 K 个值) | ✓ | ✓ | ✓ | `projects:read` |
| 更新项目元数据 (名称、描述、标签) | ✓ | ✓ | ✗ | `projects:update` |
| 创建筛选视图 | ✓ | ✗ | ✗ | `projects:create` |
| 查看筛选视图 | ✓ | ✓ | ✓ | `projects:read` |
| 查看特定筛选视图 | ✓ | ✓ | ✓ | `projects:read` |
| 更新筛选视图 | ✓ | ✓ | ✗ | `projects:update` |
| 删除筛选视图 | ✓ | ✗ | ✗ | `projects:delete` |
| 删除项目 | ✓ | ✗ | ✗ | `projects:delete` |
| 删除多个项目 | ✓ | ✗ | ✗ | `projects:delete` |
| 获取洞察任务 (Beta) | ✓ | ✓ | ✓ | `projects:read` |
| 获取特定洞察任务 (Beta) | ✓ | ✓ | ✓ | `projects:read` |
| 创建洞察任务 (Beta) | ✓ | ✓ | ✓ | `projects:read` + `rules:create` |
| 更新洞察任务 (Beta) | ✓ | ✓ | ✗ | `projects:update` |
| 删除洞察任务 (Beta) | ✓ | ✗ | ✗ | `projects:delete` |
| 获取洞察任务配置 (Beta) | ✓ | ✓ | ✓ | `rules:read` |
| 创建洞察任务配置 (Beta) | ✓ | ✓ | ✗ | `rules:create` |
| 自动生成洞察任务配置 (Beta) | ✓ | ✓ | ✗ | `rules:create` |
| 更新洞察任务配置 (Beta) | ✓ | ✓ | ✗ | `rules:update` |
| 删除洞察任务配置 (Beta) | ✓ | ✓ | ✗ | `rules:delete` |
| 从洞察任务获取运行集群 (Beta) | ✓ | ✓ | ✓ | `projects:read` |
| 从洞察任务获取运行 (Beta) | ✓ | ✓ | ✓ | `projects:read` |

### 运行

来自 LLM 应用程序的单个执行追踪和跨度。

| 操作 | 工作区管理员 | 工作区编辑者 | 工作区查看者 | 所需权限 |
|-----------|:---------------:|:--------------:|:----------------:|---------------------|
| 从 SDK 发送追踪 (包括单次运行、批量、多部分和 OTEL) | ✓ | ✓ | ✗ | `runs:create` |
| 查看特定运行 | ✓ | ✓ | ✓ | `runs:read` |
| 查看线程预览 | ✓ | ✓ | ✓ | `runs:read` |
| 查询/列出运行 | ✓ | ✓ | ✓ | `runs:read` |
| 查看运行统计信息 | ✓ | ✓ | ✓ | `runs:read` |
| 查看分组运行统计信息 | ✓ | ✓ | ✓ | `runs:read` |
| 按表达式分组运行 | ✓ | ✓ | ✓ | `runs:read` |
| 从自然语言生成筛选查询 | ✓ | ✓ | ✓ | `runs:read` |
| 预取运行 | ✓ | ✓ | ✓ | `runs:read` |
| 更新运行 (PATCH) | ✓ | ✓ | ✗ | `runs:create` |
| 查看运行共享状态 | ✓ | ✓ | ✓ | `runs:read` |
| 公开共享运行 | ✓ | ✓ | ✗ | `runs:share` |
| 取消共享运行 | ✓ | ✓ | ✗ | `runs:share` |
| 按追踪 ID 或元数据删除运行 | ✓ | ✗ | ✗ | `runs:delete` |

### 规则

基于运行条件触发操作的自动化运行规则。

| 操作 | 工作区管理员 | 工作区编辑者 | 工作区查看者 | 所需权限 |
|-----------|:---------------:|:--------------:|:----------------:|---------------------|
| 列出所有运行规则 | ✓ | ✓ | ✓ | `rules:read` |
| 创建运行规则 | ✓ | ✓ | ✗ | `rules:create` |
| 更新运行规则 | ✓ | ✓ | ✗ | `rules:update` |
| 删除运行规则 | ✓ | ✓ | ✗ | `rules:delete` |
| 查看规则日志 | ✓ | ✓ | ✓ | `rules:read` |
| 获取最后应用的规则 | ✓ | ✓ | ✓ | `rules:read` |
| 手动触发规则 | ✓ | ✓ | ✗ | `rules:update` |
| 触发多个规则 | ✓ | ✓ | ✗ | `rules:update` |

### 警报

用于监控运行条件的警报规则。

| 操作 | 工作区管理员 | 工作区编辑者 | 工作区查看者 | 所需权限 |
|-----------|:---------------:|:--------------:|:----------------:|---------------------|
| 创建警报规则 | ✓ | ✓ | ✓ | `runs:read` |
| 更新警报规则 | ✓ | ✓ | ✓ | `runs:read` |
| 删除警报规则 | ✓ | ✓ | ✓ | `runs:read` |
| 获取警报规则 | ✓ | ✓ | ✓ | `runs:read` |
| 列出警报规则 | ✓ | ✓ | ✓ | `runs:read` |
| 测试警报操作 | ✓ | ✓ | ✓ | `runs:read` |

### 数据集

用于评估的包含示例的测试数据集。

| 操作 | 工作区管理员 | 工作区编辑者 | 工作区查看者 | 所需权限 |
|-----------|:---------------:|:--------------:|:----------------:|---------------------|
| 创建数据集 | ✓ | ✓ | ✗ | `datasets:create` |
| 列出数据集 | ✓ | ✓ | ✓ | `dat
