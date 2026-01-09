---
title: 公开分享或取消分享追踪记录
sidebarTitle: Share or unshare a trace publicly
---

<Warning>

<strong>公开分享追踪记录将使任何拥有链接的人都能访问。请确保您没有分享敏感信息。</strong>

如果您的自托管或混合部署的 LangSmith 位于 VPC 内，那么公开链接仅对在您 VPC 内通过身份验证的成员可访问。为了增强安全性，我们建议将您的实例配置为仅对有权访问您网络的用户可访问的私有 URL。

</Warning>

要公开分享追踪记录，只需在任何追踪记录视图的右上角点击 **分享** 按钮。
![分享追踪记录](/langsmith/images/share-trace.png)

这将打开一个对话框，您可以在其中复制追踪记录的链接。

任何拥有链接的人都可以访问已分享的追踪记录，即使他们没有 LangSmith 账户。他们将能够查看追踪记录，但不能编辑它。

要"取消分享"一个追踪记录，可以：

1. 在任何公开分享的追踪记录的右上角点击 **公开**，然后在对话框中点击 **取消分享**。
   ![取消分享追踪记录](/langsmith/images/unshare-trace.png)

2. 通过点击 **设置** -> **已分享的 URL** 导航到您组织的公开分享追踪记录列表，然后在您想要取消分享的追踪记录旁边点击 **取消分享**。
   ![从列表取消分享追踪记录](/langsmith/images/unshare-trace-list-share.png)
