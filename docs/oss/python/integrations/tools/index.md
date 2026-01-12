---
title: 工具与工具包
---
[工具](/oss/python/langchain/tools)是设计为由模型调用的实用程序：其输入设计为由模型生成，其输出设计为传回给模型。

工具包（toolkit）是旨在一起使用的工具集合。

## 搜索

下表展示了以某种形式执行在线搜索的工具：

| 工具/工具包 | 免费/付费 | 返回数据 |
|-------------|-----------|-------------|
| [Bing 搜索](/oss/python/integrations/tools/bing_search) | 付费 | URL、摘要、标题 |
| [Brave 搜索](/oss/python/integrations/tools/brave_search) | 免费 | URL、摘要、标题 |
| [DuckDuckgo 搜索](/oss/python/integrations/tools/ddg) | 免费 | URL、摘要、标题 |
| [Exa 搜索](/oss/python/integrations/tools/exa_search) | 每月 1000 次免费搜索 | URL、作者、标题、发布日期 |
| [Google 搜索](/oss/python/integrations/tools/google_search) | 付费 | URL、摘要、标题 |
| [Google Serper](/oss/python/integrations/tools/google_serper) | 免费 | URL、摘要、标题、搜索排名、网站链接 |
| [Jina 搜索](/oss/python/integrations/tools/jina_search) | 100 万响应令牌免费 | URL、摘要、标题、页面内容 |
| [Mojeek 搜索](/oss/python/integrations/tools/mojeek_search) | 付费 | URL、摘要、标题 |
| [Parallel 搜索](/oss/python/integrations/tools/parallel_search) | 付费 | URL、标题、摘录 |
| [SearchApi](/oss/python/integrations/tools/searchapi) | 注册时 100 次免费搜索 | URL、摘要、标题、搜索排名、网站链接、作者 |
| [SearxNG 搜索](/oss/python/integrations/tools/searx_search) | 免费 | URL、摘要、标题、类别 |
| [SerpApi](/oss/python/integrations/tools/serpapi) | 每月 250 次免费搜索 | 答案 |
| [Tavily 搜索](/oss/python/integrations/tools/tavily_search) | 每月 1000 次免费搜索 | URL、内容、标题、图片、答案 |
| [You.com 搜索](/oss/python/integrations/tools/you) | 免费 60 天 | URL、标题、页面内容 |

## 代码解释器

下表展示了可用作代码解释器的工具：

| 工具/工具包 | 支持的语言 | 沙盒生命周期 | 支持文件上传 | 返回类型 | 支持自托管 |
|-------------|-------------------|-----------------|---------------------|--------------|-------------------|
| [Azure 容器应用动态会话](/oss/python/integrations/tools/azure_dynamic_sessions) | Python | 1 小时 | ✅ | 文本、图像 | ❌ |
| [Bearly 代码解释器](/oss/python/integrations/tools/bearly) | Python | 执行时重置 | ✅ | 文本 | ❌ |
| [Riza 代码解释器](/oss/python/integrations/tools/riza) | Python、JavaScript、PHP、Ruby | 执行时重置 | ✅ | 文本 | ✅ |

## 生产力

下表展示了可用于在生产力工具中自动化任务的工具：

| 工具/工具包 | 定价 |
|-------------|---------|
| [GitHub 工具包](/oss/python/integrations/tools/github) | 免费 |
| [GitLab 工具包](/oss/python/integrations/tools/gitlab) | 个人项目免费 |
| [Gmail 工具包](/oss/python/integrations/tools/google_gmail) | 免费，每秒每用户配额单位限制为 250 |
| [Infobip 工具](/oss/python/integrations/tools/infobip) | 免费试用，之后可变定价 |
| [Jira 工具包](/oss/python/integrations/tools/jira) | 免费，有[速率限制](https://developer.atlassian.com/cloud/jira/platform/rate-limiting/) |
| [Office365 工具包](/oss/python/integrations/tools/office365) | 使用 Office365 免费，包含[速率限制](https://learn.microsoft.com/en-us/graph/throttling-limits) |
| [Slack 工具包](/oss/python/integrations/tools/slack) | 免费 |
| [Twilio 工具](/oss/python/integrations/tools/twilio) | 免费试用，之后采用[按量付费定价](https://www.twilio.com/en-us/pricing) |

## 网页浏览

下表展示了可用于在网页浏览器中自动化任务的工具：

| 工具/工具包 | 定价 | 支持与浏览器交互 |
|-------------|---------|---------------------------------------|
| [AgentQL 工具包](/oss/python/integrations/tools/agentql) | 免费试用，之后采用按量付费和固定费率计划 | ✅ |
| [Hyperbrowser 浏览器代理工具](/oss/python/integrations/tools/hyperbrowser_browser_agent_tools) | 免费试用，之后采用固定费率计划和预付费额度 | ✅ |
| [Hyperbrowser 网页抓取工具](/oss/python/integrations/tools/hyperbrowser_web_scraping_tools) | 免费试用，之后采用固定费率计划和预付费额度 | ❌ |
| [MultiOn 工具包](/oss/python/integrations/tools/multion) | 每天 40 次免费请求 | ✅ |
| [Oxylabs 网页抓取 API](/oss/python/integrations/tools/oxylabs) | 免费试用，之后采用固定费率计划和预付费额度 | ❌ |
| [PlayWright 浏览器工具包](/oss/python/integrations/tools/playwright) | 免费 | ✅ |
| [Requests 工具包](/oss/python/integrations/tools/requests) | 免费 | ❌ |

## 数据库

下表展示了可用于在数据库中自动化任务的工具：

| 工具/工具包 | 允许的操作 |
|-------------|-------------------|
| [Cassandra 数据库工具包](/oss/python/integrations/tools/cassandra_database) | SELECT 和模式自省 |
| [MCP 工具箱](/oss/python/integrations/tools/mcp_toolbox) | 任何 SQL 操作 |
| [SQLDatabase 工具包](/oss/python/integrations/tools/sql_database) | 任何 SQL 操作 |
| [Spark SQL 工具包](/oss/python/integrations/tools/spark_sql) | 任何 SQL 操作 |
| [Drasi 工具包](/oss/python/integrations/tools/drasi) | 实时数据库变更检测 |

## 金融

下表展示了可用于执行支付、购买等金融交易的工具：

| 工具/工具包 | 定价 | 能力 |
|-------------|---------|--------------|
| [GOAT](/oss/python/integrations/tools/goat) | 免费 | 创建和接收付款、购买实体商品、进行投资等。 |
| [Privy](/oss/python/integrations/tools/privy) | 免费 | 创建具有可配置权限的钱包，并快速执行交易。 |

## 集成平台

以下平台通过统一接口提供对多种工具和服务的访问：

| 工具/工具包 | 集成数量 | 定价 | 关键特性 |
|-------------|----------------------|---------|--------------|
| [Composio](/oss/python/integrations/tools/composio) | 500+ | 提供免费层级 | OAuth 处理、事件驱动的工作流、多用户支持 |

## 所有工具和工具包

<Columns :cols="3">
<Card title="ADS4GPTs" icon="link" href="/oss/integrations/tools/ads4gpts" arrow="true" cta="查看指南" />
<Card title="AgentQL" icon="link" href="/oss/integrations/tools/agentql" arrow="true" cta="查看指南" />
<Card title="AINetwork 工具包" icon="link" href="/oss/integrations/tools/ainetwork" arrow="true" cta="查看指南" />
<Card title="Alpha Vantage" icon="link" href="/oss/integrations/tools/alpha_vantage" arrow="true" cta="查看指南" />
<Card title="Amadeus 工具包" icon="link" href="/oss/integrations/tools/amadeus" arrow="true" cta="查看指南" />
<Card title="Anchor 浏览器" icon="link" href="/oss/integrations/tools/anchor_browser" arrow="true" cta="查看指南" />
<Card title="Apify Actor" icon="link" href="/oss/integrations/tools/apify_actors" arrow="true" cta="查看指南" />
<Card title="ArXiv" icon="link" href="/oss/integrations/tools/arxiv" arrow="true" cta="查看指南" />
<Card title="AskNews" icon="link" href="/oss/integrations/tools/asknews" arrow="true" cta="查看指南" />
<Card title="AWS Lambda" icon="link" href="/oss/integrations/tools/awslambda" arrow="true" cta="查看指南" />
<Card title="Azure AI 服务工具包" icon="link" href="/oss/integrations/tools/azure_ai_services" arrow="true" cta="查看指南" />
<Card title="Azure 认知服务工具包" icon="link" href="/oss/integrations/tools/azure_cognitive_services" arrow="true" cta="查看指南" />
<Card title="Azure 容器应用动态会话" icon="link" href="/oss/integrations/tools/azure_dynamic_sessions" arrow="true" cta="查看指南" />
<Card title="Shell (bash)" icon="link" href="/oss/integrations/tools/bash" arrow="true" cta="查看指南" />
<Card title="Bearly 代码解释器" icon="link" href="/oss/integrations/tools/bearly" arrow="true" cta="查看指南" />
<Card title="Bing 搜索" icon="link" href="/oss/integrations/tools/bing_search" arrow="true" cta="查看指南" />
<Card title="Bodo DataFrames" icon="link" href="/oss/integrations/tools/bodo" arrow="true" cta="查看指南" />
<Card title="Brave 搜索" icon="link" href="/oss/integrations/tools/brave_search" arrow="true" cta="查看指南" />
<Card title="BrightData 网页抓取 API" icon="link" href="/oss/integrations/tools/brightdata-webscraperapi" arrow="true" cta="查看指南" />
<Card title="BrightData SERP" icon="link" href="/oss/integrations/tools/brightdata_serp" arrow="true" cta="查看指南" />
<Card title="BrightData Unlocker" icon="link" href="/oss/integrations/tools/brightdata_unlocker" arrow="true" cta="查看指南" />
<Card title="Cassandra 数据库工具包" icon="link" href="/oss/integrations/tools/cassandra_database" arrow="true" cta="查看指南" />
<Card title="CDP" icon="link" href="/oss/integrations/tools/cdp_agentkit" arrow="true" cta="查看指南" />
<Card title="ChatGPT 插件" icon="link" href="/oss/integrations/tools/chatgpt_plugins" arrow="true" cta="查看指南" />
<Card title="ClickUp 工具包" icon="link" href="/oss/integrations/tools/clickup" arrow="true" cta="查看指南" />
<Card title="Cogniswitch 工具包" icon="link" href="/oss/integrations/tools/cogniswitch" arrow="true" cta="查看指南" />
<Card title="Compass DeFi 工具包" icon="link" href="/oss/integrations/tools/compass" arrow="true" cta="查看指南" />
<Card title="Composio" icon="link" href="/oss/integrations/tools/composio" arrow="true" cta="查看指南" />
<Card title="Connery 工具包" icon="link" href="/oss/integrations/tools/connery" arrow="true" cta="查看指南" />
<Card title="Dall-E 图像生成器" icon="link" href="/oss/integrations/tools/dalle_image_generator" arrow="true" cta="查看指南" />
<Card title="Dappier" icon="link" href="/oss/integrations/tools/dappier" arrow="true" cta="查看指南" />
<Card title="Databricks Unity Catalog" icon="link" href="/oss/integrations/tools/databricks" arrow="true" cta="查看指南" />
<Card title="DataForSEO" icon="link" href="/oss/integrations/tools/dataforseo" arrow="true" cta="查看指南" />
<Card title="Dataherald" icon="link" href="/oss/integrations/tools/dataherald" arrow="true" cta="查看指南" />
<Card title="Daytona 数据分析" icon="link" href="/oss/integrations/tools/daytona_data_analysis" arrow="true" cta="查看指南" />
<Card title="DuckDuckGo 搜索" icon="link" href="/oss/integrations/tools/ddg" arrow="true" cta="查看指南" />
<Card title="Discord" icon="link" href="/oss/integrations/tools/discord" arrow="true" cta="查看指南" />
<Card title="Drasi" icon="link" href="/oss/integrations/tools/drasi" arrow="true" cta="查看指南" />
<Card title="E2B 数据分析" icon="link" href="/oss/integrations/tools/e2b_data_analysis" arrow="true" cta="查看指南" />
<Card title="Eden AI" icon="link" href="/oss/integrations/tools/edenai_tools" arrow="true" cta="查看指南" />
<Card title="ElevenLabs 文本转语音" icon="link" href="/oss/integrations/tools/eleven_labs_tts" arrow="true" cta="查看指南" />
<Card title="Exa 搜索" icon="link" href="/oss/integrations/tools/exa_search" arrow="true" cta="查看指南" />
<Card title="文件系统" icon="link" href="/oss/integrations/tools/filesystem" arrow="true" cta="查看指南" />
<Card title="金融数据集工具包" icon="link" href="/oss/integrations/tools/financial_datasets" arrow="true" cta="查看指南" />
<Card title="FMP 数据" icon="link" href="/oss/integrations/tools/fmp-data" arrow="true" cta="查看指南" />
<Card title="GitHub 工具包" icon="link" href="/oss/integrations/tools/github" arrow="true" cta="查看指南" />
<Card title="GitLab 工具包" icon="link" href="/oss/integrations/tools/gitlab" arrow="true" cta="查看指南" />
<Card title="Gmail 工具包" icon="link" href="/oss/integrations/tools/google_gmail" arrow="true" cta="查看指南" />
<Card title="GOAT" icon="link" href="/oss/integrations/tools/goat" arrow="true" cta="查看指南" />
<Card title="Privy" icon="link" href="/oss/integrations/tools/privy" arrow="true" cta="查看指南" />
<Card title="Golden Query" icon="link" href="/oss/integrations/tools/golden_query" arrow="true" cta="查看指南" />
<Card title="Google 图书" icon="link" href="/oss/integrations/tools/google_books" arrow="true" cta="查看指南" />
<Card title="Google 日历工具包" icon="link" href="/oss/integrations/tools/google_calendar" arrow="true" cta="查看指南" />
<Card title="Google Cloud 文本转语音" icon="link" href="/oss/integrations/tools/google_cloud_texttospeech" arrow="true" cta="查看指南" />
<Card title="Google 云端硬盘" icon="link" href="/oss/integrations/tools/google_drive" arrow="true" cta="查看指南" />
<Card title="Google 财经" icon="link" href="/oss/integrations/tools/google_finance" arrow="true" cta="查看指南" />
<Card title="Google Imagen" icon="link" href="/oss/integrations/tools/google_imagen" arrow="true" cta="查看指南" />
<Card title="Google 职位" icon="link" href="/oss/integrations/tools/google_jobs" arrow="true" cta="查看指南" />
<Card title="Google Lens" icon="link" href="/oss/integrations/tools/google_lens" arrow="true" cta="查看指南" />
<Card title="Google 地点" icon="link" href="/oss/integrations/tools/google_places" arrow="true" cta="查看指南" />
<Card title="Google 学术" icon="link" href="/oss/integrations/tools/google_scholar" arrow="true" cta="查看指南" />
<Card title="Google 搜索" icon="link" href="/oss/integrations/tools/google_search" arrow="true" cta="查看指南" />
<Card title="Google Serper" icon="link" href="/oss/integrations/tools/google_serper" arrow="true" cta="查看指南" />
<Card title="Google 趋势" icon="link" href="/oss/integrations/tools/google_trends" arrow="true" cta="查看指南" />
<Card title="Gradio" icon="link" href="/oss/integrations/tools/gradio_tools" arrow="true" cta="查看指南" />
<Card title="GraphQL" icon="link" href="/oss/integrations/tools/graphql" arrow="true" cta="查看指南" />
<Card title="HuggingFace Hub 工具" icon="link" href="/oss/integrations/tools/hugging
