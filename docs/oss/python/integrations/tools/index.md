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
| [并行搜索](/oss/python/integrations/tools/parallel_search) | 付费 | URL、标题、摘录 |
| [SearchApi](/oss/python/integrations/tools/searchapi) | 注册时提供 100 次免费搜索 | URL、摘要、标题、搜索排名、网站链接、作者 |
| [SearxNG 搜索](/oss/python/integrations/tools/searx_search) | 免费 | URL、摘要、标题、类别 |
| [SerpApi](/oss/python/integrations/tools/serpapi) | 每月 250 次免费搜索 | 答案 |
| [Tavily 搜索](/oss/python/integrations/tools/tavily_search) | 每月 1000 次免费搜索 | URL、内容、标题、图片、答案 |
| [You.com 搜索](/oss/python/integrations/tools/you) | 免费 60 天 | URL、标题、页面内容 |

## 代码解释器

下表展示了可用作代码解释器的工具：

| 工具/工具包 | 支持的语言 | 沙盒生命周期 | 支持文件上传 | 返回类型 | 支持自托管 |
|-------------|-------------------|-----------------|---------------------|--------------|-------------------|
| [Amazon Bedrock AgentCore 代码解释器](/oss/python/integrations/tools/bedrock_agentcore_code_interpreter) | Python、JavaScript、TypeScript | 可配置（最长 8 小时） | ✅ | 文本、图像、文件 | ❌ |
| [Azure 容器应用动态会话](/oss/python/integrations/tools/azure_dynamic_sessions) | Python | 1 小时 | ✅ | 文本、图像 | ❌ |
| [Bearly 代码解释器](/oss/python/integrations/tools/bearly) | Python | 执行时重置 | ✅ | 文本 | ❌ |
| [Riza 代码解释器](/oss/python/integrations/tools/riza) | Python、JavaScript、PHP、Ruby | 执行时重置 | ✅ | 文本 | ✅ |

## 生产力

下表展示了可用于在生产力工具中自动化任务的工具：

| 工具/工具包 | 定价 |
|-------------|---------|
| [GitHub 工具包](/oss/python/integrations/tools/github) | 免费 |
| [GitLab 工具包](/oss/python/integrations/tools/gitlab) | 个人项目免费 |
| [Gmail 工具包](/oss/python/integrations/tools/google_gmail) | 免费，但限制为每秒每用户 250 配额单位 |
| [Infobip 工具](/oss/python/integrations/tools/infobip) | 免费试用，之后采用可变定价 |
| [Jira 工具包](/oss/python/integrations/tools/jira) | 免费，但有[速率限制](https://developer.atlassian.com/cloud/jira/platform/rate-limiting/) |
| [Office365 工具包](/oss/python/integrations/tools/office365) | 使用 Office365 免费，包含[速率限制](https://learn.microsoft.com/en-us/graph/throttling-limits) |
| [Slack 工具包](/oss/python/integrations/tools/slack) | 免费 |
| [Twilio 工具](/oss/python/integrations/tools/twilio) | 免费试用，之后采用[按使用量付费定价](https://www.twilio.com/en-us/pricing) |

## 网页浏览

下表展示了可用于在网页浏览器中自动化任务的工具：

| 工具/工具包 | 定价 | 支持与浏览器交互 |
|-------------|---------|---------------------------------------|
| [AgentQL 工具包](/oss/python/integrations/tools/agentql) | 免费试用，之后提供按量付费和固定费率方案 | ✅ |
| [Amazon Bedrock AgentCore 浏览器](/oss/python/integrations/tools/bedrock_agentcore_browser) | 按使用量付费 (AWS) | ✅ |
| [Hyperbrowser 浏览器智能体工具](/oss/python/integrations/tools/hyperbrowser_browser_agent_tools) | 免费试用，之后提供固定费率方案和预付费额度 | ✅ |
| [Hyperbrowser 网页抓取工具](/oss/python/integrations/tools/hyperbrowser_web_scraping_tools) | 免费试用，之后提供固定费率方案和预付费额度 | ❌ |
| [MultiOn 工具包](/oss/python/integrations/tools/multion) | 每天 40 次免费请求 | ✅ |
| [Oxylabs 网页抓取 API](/oss/python/integrations/tools/oxylabs) | 免费试用，之后提供固定费率方案和预付费额度 | ❌ |
| [PlayWright 浏览器工具包](/oss/python/integrations/tools/playwright) | 免费 | ✅ |
| [Requests 工具包](/oss/python/integrations/tools/requests) | 免费 | ❌ |

## 数据库

下表列出了可用于自动化数据库任务的工具：

| 工具/工具包 | 允许的操作 |
|-------------|-------------------|
| [Cassandra 数据库工具包](/oss/python/integrations/tools/cassandra_database) | SELECT 和模式内省 |
| [MCP 工具箱](/oss/python/integrations/tools/mcp_toolbox) | 任何 SQL 操作 |
| [SQLDatabase 工具包](/oss/python/integrations/tools/sql_database) | 任何 SQL 操作 |
| [Spark SQL 工具包](/oss/python/integrations/tools/spark_sql) | 任何 SQL 操作 |
| [Drasi 工具包](/oss/python/integrations/tools/drasi) | 实时数据库变更检测 |

## 金融

下表列出了可用于执行支付、购买等金融交易的工具：

| 工具/工具包 | 定价 | 功能 |
|-------------|---------|--------------|
| [GOAT](/oss/python/integrations/tools/goat) | 免费 | 创建和接收付款、购买实体商品、进行投资等。 |
| [Privy](/oss/python/integrations/tools/privy) | 免费 | 创建具有可配置权限的钱包，并快速执行交易。 |

## 集成平台

以下平台通过统一接口提供对多种工具和服务的访问：

| 工具/工具包 | 集成数量 | 定价 | 主要特性 |
|-------------|----------------------|---------|--------------|
| [Composio](/oss/python/integrations/tools/composio) | 500+ | 提供免费层级 | OAuth 处理、事件驱动的工作流、多用户支持 |

## 所有工具和工具包

<Columns :cols="3">

<Card title="ADS4GPTs" icon="link" href="/oss/integrations/tools/ads4gpts" arrow="true" cta="查看指南" />
<Card title="AgentQL" icon="link" href="/oss/integrations/tools/agentql" arrow="true" cta="查看指南" />
<Card title="AINetwork 工具包" icon="link" href="/oss/integrations/tools/ainetwork" arrow="true" cta="查看指南" />
<Card title="Alpha Vantage" icon="link" href="/oss/integrations/tools/alpha_vantage" arrow="true" cta="查看指南" />
<Card title="Amadeus 工具包" icon="link" href="/oss/integrations/tools/amadeus" arrow="true" cta="查看指南" />
<Card title="Amazon Bedrock AgentCore 浏览器" icon="link" href="/oss/python/integrations/tools/bedrock_agentcore_browser" arrow="true" cta="查看指南" />
<Card title="Amazon Bedrock AgentCore 代码解释器" icon="link" href="/oss/python/integrations/tools/bedrock_agentcore_code_interpreter" arrow="true" cta="查看指南" />
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
<Card title="BrightData Web Scraper API" icon="link" href="/oss/integrations/tools/brightdata-webscraperapi" arrow="true" cta="查看指南" />
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
<Card title="Dappier" icon="link" href="/oss/integrations/t

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
<Card title="HuggingFace Hub 工具" icon="link" href="/oss/integrations/tools/huggingface_tools" arrow="true" cta="查看指南" />
<Card title="人作为工具" icon="link" href="/oss/integrations/tools/human_tools" arrow="true" cta="查看指南" />
<Card title="Hyperbrowser 浏览器智能体工具" icon="link" href="/oss/integrations/tools/hyperbrowser_browser_agent_tools" arrow="true" cta="查看指南" />
<Card title="Hyperbrowser 网页抓取工具" icon="link" href="/oss/integrations/tools/hyperbrowser_web_scraping_tools" arrow="true" cta="查看指南" />
<Card title="IBM watsonx.ai" icon="link" href="/oss/integrations/tools/ibm_watsonx" arrow="true" cta="查看指南" />
<Card title="IBM watsonx.ai (SQL)" icon="link" href="/oss/integrations/tools/ibm_watsonx_sql" arrow="true" cta="查看指南" />
<Card title="IFTTT WebHooks" icon="link" href="/oss/integrations/tools/ifttt" arrow="true" cta="查看指南" />
<Card title="Infobip" icon="link" href="/oss/integrations/tools/infobip" arrow="true" cta="查看指南" />
<Card title="Ionic 购物工具" icon="link" href="/oss/integrations/tools/ionic_shopping" arrow="true" cta="查看指南" />
<Card title="Jenkins" icon="link" href="/oss/integrations/tools/jenkins" arrow="true" cta="查看指南" />
<Card title="Jina 搜索" icon="link" href="/oss/integrations/tools/jina_search" arrow="true" cta="查看指南" />
<Card title="Jira 工具包" icon="link" href="/oss/integrations/tools/jira" arrow="true" cta="查看指南" />
<Card title="JSON 工具包" icon="link" href="/oss/integrations/tools/json" arrow="true" cta="查看指南" />
<Card title="Lemon 智能体" icon="link" href="/oss/integrations/tools/lemonai" arrow="true" cta="查看指南" />
<Card title="Linkup 搜索工具" icon="link" href="/oss/integrations/tools/linkup_search" arrow="true" cta="查看指南" />
<Card title="Memgraph" icon="link" href="/oss/integrations/tools/memgraph" arrow="true" cta="查看指南" />
<Card title="Memorize" icon="link" href="/oss/integrations/tools/memorize" arrow="true" cta="查看指南" />
<Card title="Mojeek 搜索" icon="link" href="/oss/integrations/tools/mojeek_search" arrow="true" cta="查看指南" />
<Card title="MultiOn 工具包" icon="link" href="/oss/integrations/tools/multion" arrow="true" cta="查看指南" />
<Card title="NASA 工具包" icon="link" href="/oss/integrations/tools/nasa" arrow="true" cta="查看指南" />
<Card title="Naver 搜索" icon="link" href="/oss/integrations/tools/naver_search" arrow="true" cta="查看指南" />
<Card title="Nuclia 理解" icon="link" href="/oss/integrations/tools/nuclia" arrow="true" cta="查看指南" />
<Card title="NVIDIA Riva" icon="link" href="/oss/integrations/tools/nvidia_riva" arrow="true" cta="查看指南" />
<Card title="Office365 工具包" icon="link" href="/oss/integrations/tools/office365" arrow="true" cta="查看指南" />
<Card title="OpenAPI 工具包" icon="link" href="/oss/integrations/tools/openapi" arrow="true" cta="查看指南" />
<Card title="自然语言 API 工具包" icon="link" href="/oss/integrations/tools/openapi_nla" arrow="true" cta="查看指南" />
<Card title="OpenGradient" icon="link" href="/oss/integrations/tools/opengradient_toolkit" arrow="true" cta="查看指南" />
<Card title="OpenWeatherMap" icon="link" href="/oss/integrations/tools/openweathermap" arrow="true" cta="查看指南" />
<Card title="Oracle AI 向量搜索" icon="link" href="/oss/integrations/tools/oracleai" arrow="true" cta="查看指南" />
<Card title="Oxylabs" icon="link" href="/oss/integrations/tools/oxylabs" arrow="true" cta="查看指南" />
<Card title="Pandas 数据框" icon="link" href="/oss/integrations/tools/pandas" arrow="true" cta="查看指南" />
<Card title="Passio NutritionAI" icon="link" href="/oss/integrations/tools/passio_nutrition_ai" arrow="true" cta="查看指南" />
<Card title="并行提取" icon="link" href="/oss/integrations/tools/paral" arrow="true" cta="查看指南" />

<Card title="lel_extract" icon="link" href="/oss/integrations/tools/lel_extract" arrow="true" cta="查看指南" />
<Card title="并行搜索" icon="link" href="/oss/integrations/tools/parallel_search" arrow="true" cta="查看指南" />
<Card title="Permit" icon="link" href="/oss/integrations/tools/permit" arrow="true" cta="查看指南" />
<Card title="PlayWright 浏览器工具包" icon="link" href="/oss/integrations/tools/playwright" arrow="true" cta="查看指南" />
<Card title="Polygon IO 工具包" icon="link" href="/oss/integrations/tools/polygon" arrow="true" cta="查看指南" />
<Card title="PowerBI 工具包" icon="link" href="/oss/integrations/tools/powerbi" arrow="true" cta="查看指南" />
<Card title="Prolog" icon="link" href="/oss/integrations/tools/prolog_tool" arrow="true" cta="查看指南" />
<Card title="PubMed" icon="link" href="/oss/integrations/tools/pubmed" arrow="true" cta="查看指南" />
<Card title="Python REPL" icon="link" href="/oss/integrations/tools/python" arrow="true" cta="查看指南" />
<Card title="Reddit 搜索" icon="link" href="/oss/integrations/tools/reddit_search" arrow="true" cta="查看指南" />
<Card title="Requests 工具包" icon="link" href="/oss/integrations/tools/requests" arrow="true" cta="查看指南" />
<Card title="Riza 代码解释器" icon="link" href="/oss/integrations/tools/riza" arrow="true" cta="查看指南" />
<Card title="Robocorp 工具包" icon="link" href="/oss/integrations/tools/robocorp" arrow="true" cta="查看指南" />
<Card title="Salesforce" icon="link" href="/oss/integrations/tools/salesforce" arrow="true" cta="查看指南" />
<Card title="SceneXplain" icon="link" href="/oss/integrations/tools/sceneXplain" arrow="true" cta="查看指南" />
<Card title="ScrapeGraph" icon="link" href="/oss/integrations/tools/scrapegraph" arrow="true" cta="查看指南" />
<Card title="Scrapeless Crawl" icon="link" href="/oss/integrations/tools/scrapeless_crawl" arrow="true" cta="查看指南" />
<Card title="Scrapeless Scraping API" icon="link" href="/oss/integrations/tools/scrapeless_scraping_api" arrow="true" cta="查看指南" />
<Card title="Scrapeless Universal Scraping" icon="link" href="/oss/integrations/tools/scrapeless_universal_scraping" arrow="true" cta="查看指南" />
<Card title="SearchApi" icon="link" href="/oss/integrations/tools/searchapi" arrow="true" cta="查看指南" />
<Card title="SearxNG 搜索" icon="link" href="/oss/integrations/tools/searx_search" arrow="true" cta="查看指南" />
<Card title="Semantic Scholar API" icon="link" href="/oss/integrations/tools/semanticscholar" arrow="true" cta="查看指南" />
<Card title="SerpApi" icon="link" href="/oss/integrations/tools/serpapi" arrow="true" cta="查看指南" />
<Card title="Slack 工具包" icon="link" href="/oss/integrations/tools/slack" arrow="true" cta="查看指南" />
<Card title="Spark SQL 工具包" icon="link" href="/oss/integrations/tools/spark_sql" arrow="true" cta="查看指南" />
<Card title="SQLDatabase 工具包" icon="link" href="/oss/integrations/tools/sql_database" arrow="true" cta="查看指南" />
<Card title="StackExchange" icon="link" href="/oss/integrations/tools/stackexchange" arrow="true" cta="查看指南" />
<Card title="Steam 工具包" icon="link" href="/oss/integrations/tools/steam" arrow="true" cta="查看指南" />
<Card title="Stripe" icon="link" href="/oss/integrations/tools/stripe" arrow="true" cta="查看指南" />
<Card title="Tableau" icon="link" href="/oss/integrations/tools/tableau" arrow="true" cta="查看指南" />
<Card title="Taiga" icon="link" href="/oss/integrations/tools/taiga" arrow="true" cta="查看指南" />
<Card title="Tavily Extract" icon="link" href="/oss/integrations/tools/tavily_extract" arrow="true" cta="查看指南" />
<Card title="Tavily Search" icon="link" href="/oss/integrations/tools/tavily_search" arrow="true" cta="查看指南" />
<Card title="Tilores" icon="link" href="/oss/integrations/tools/tilores" arrow="true" cta="查看指南" />
<Card title="MCP 工具箱" icon="link" href="/oss/integrations/tools/mcp_toolbox" arrow="true" cta="查看指南" />
<Card title="Twili" icon="link" href="/oss/integrations/tools/twili" arrow="true" cta="查看指南" />

<Card title="Twilio" icon="link" href="/oss/integrations/tools/twilio" arrow="true" cta="查看指南" />
<Card title="Upstage" icon="link" href="/oss/integrations/tools/upstage_groundedness_check" arrow="true" cta="查看指南" />
<Card title="Valthera" icon="link" href="/oss/integrations/tools/valthera" arrow="true" cta="查看指南" />
<Card title="ValyuContext" icon="link" href="/oss/integrations/tools/valyu_search" arrow="true" cta="查看指南" />
<Card title="Vectara" icon="link" href="/oss/integrations/tools/vectara" arrow="true" cta="查看指南" />
<Card title="Wikidata" icon="link" href="/oss/integrations/tools/wikidata" arrow="true" cta="查看指南" />
<Card title="Wikipedia" icon="link" href="/oss/integrations/tools/wikipedia" arrow="true" cta="查看指南" />
<Card title="Wolfram Alpha" icon="link" href="/oss/integrations/tools/wolfram_alpha" arrow="true" cta="查看指南" />
<Card title="WRITER Tools" icon="link" href="/oss/integrations/tools/writer" arrow="true" cta="查看指南" />
<Card title="Yahoo Finance News" icon="link" href="/oss/integrations/tools/yahoo_finance_news" arrow="true" cta="查看指南" />
<Card title="You.com Search" icon="link" href="/oss/integrations/tools/you" arrow="true" cta="查看指南" />
<Card title="YouTube" icon="link" href="/oss/integrations/tools/youtube" arrow="true" cta="查看指南" />
<Card title="Zapier Natural Language Actions" icon="link" href="/oss/integrations/tools/zapier" arrow="true" cta="查看指南" />
<Card title="ZenGuard AI" icon="link" href="/oss/integrations/tools/zenguard" arrow="true" cta="查看指南" />

</Columns>

<Info>

如果您想贡献一个集成，请参阅[贡献集成](/oss/contributing#add-a-new-integration)。

</Info>

