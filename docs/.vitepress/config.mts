import { defineConfig } from 'vitepress'
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons'
import {
  lsGetStarted
} from './routes/sidebar_ls_get_started'
import { lsObservability } from './routes/sidebar_ls_observability'
import { lsEvaluation } from './routes/sidebar_ls_evaluation'
import { lsPromptEngineering } from './routes/sidebar_ls_prompt_engineering'
import { lsDeployment } from './routes/sidebar_ls_deployment'
import { lsAgentBuilder } from './routes/sidebar_ls_agent_builder'
import { lsPlatformSetup } from './routes/sidebar_ls_platform_setup'
import { lsReference } from './routes/sidebar_ls_reference'
import { generateSidebarMap } from './utils'
import { sidebarLangGraphPython, sidebarLangGraphJS } from './routes/sidebar_langgraph'
import { sidebarDeepAgentsPython, sidebarDeepAgentsJS } from './routes/sidebar_deepagents'
import { sidebarIntegrationsPython, sidebarIntegrationsJS } from './routes/sidebar_integrations'
import { sidebarLearnPython, sidebarLearnJS } from './routes/sidebar_learn'
import { sidebarContributingPython, sidebarContributingJS } from './routes/sidebar_contributing'
import { sidebarPythonReference, sidebarJSReference } from './routes/sidebar_reference'
import { sidebarLangChainPython, sidebarLangChainJS } from './routes/sidebar_langchain'

export default defineConfig({
  title: "LangChain 中文文档",
  titleTemplate: ":title - LangChain 中文文档",
  description: "LangChain 官方中文文档 - 为中文开发者提供最新、最全面的 LangChain、LangGraph 和 LangSmith 官方技术文档。包含完整的教程、API 参考、最佳实践和示例代码，助力开发者快速构建 AI 应用和智能体。",

  head: [
    // Favicon
    ['link', { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    ['link', { rel: 'shortcut icon', type: 'image/x-icon', href: '/favicon.ico' }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon.ico' }],

    // SEO Meta Tags - 突出官方中文文档
    ['meta', { name: 'keywords', content: 'LangChain 中文文档, LangChain 官方文档, LangGraph 中文, LangSmith 中文, LangChain 教程, AI 开发, LLM 应用, 大语言模型, 智能体开发, Agent, RAG, Python AI, JavaScript AI, 中文技术文档, LangChain API, 向量数据库, Prompt Engineering, 提示工程' }],
    ['meta', { name: 'author', content: '王码码' }],
    ['meta', { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' }],
    ['meta', { name: 'googlebot', content: 'index, follow' }],
    ['meta', { name: 'bingbot', content: 'index, follow' }],
    ['meta', { name: 'language', content: 'Chinese' }],
    ['meta', { name: 'revisit-after', content: '7 days' }],
    ['meta', { name: 'classification', content: 'Technology, AI, Documentation' }],

    // 地理位置（针对中文用户）
    ['meta', { name: 'geo.region', content: 'CN' }],
    ['meta', { name: 'geo.placename', content: 'China' }],

    // Open Graph / Facebook - 突出官方文档
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'LangChain 官方中文文档' }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],
    ['meta', { property: 'og:image', content: 'https://langchain-docs-cn.com/og-image.png' }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { property: 'og:image:alt', content: 'LangChain 官方中文文档 - AI 应用开发框架' }],

    // Twitter Card
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: 'https://langchain-docs-cn.com/og-image.png' }],
    ['meta', { name: 'twitter:title', content: 'LangChain 官方中文文档' }],
    ['meta', { name: 'twitter:description', content: '为中文开发者提供最新、最全面的 LangChain 官方技术文档' }],

    // 百度站长验证（如果需要）
    // ['meta', { name: 'baidu-site-verification', content: 'your-verification-code' }],

    // Google 站长验证（如果需要）
    // ['meta', { name: 'google-site-verification', content: 'your-verification-code' }],

    // 移动端优化
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0, viewport-fit=cover' }],
    ['meta', { name: 'theme-color', content: '#3b82f6' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' }],

    // 结构化数据 - 网站
    ['script', { type: 'application/ld+json' }, JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'LangChain 官方中文文档',
      alternateName: ['LangChain 中文文档', 'LangChain Chinese Documentation'],
      description: 'LangChain 官方中文文档 - 为中文开发者提供最新、最全面的 LangChain 技术文档',
      url: 'https://langchain-docs-cn.com',
      inLanguage: 'zh-CN',
      author: {
        '@type': 'Person',
        name: '王码码'
      },
      publisher: {
        '@type': 'Organization',
        name: 'LangChain 中文文档',
        logo: {
          '@type': 'ImageObject',
          url: 'https://langchain-docs-cn.com/favicon.ico'
        }
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://langchain-docs-cn.com/?q={search_term_string}',
        'query-input': 'required name=search_term_string'
      }
    })],

    // 结构化数据 - 技术文档
    ['script', { type: 'application/ld+json' }, JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: 'LangChain 官方中文文档',
      description: '完整的 LangChain、LangGraph 和 LangSmith 中文技术文档',
      inLanguage: 'zh-CN',
      about: {
        '@type': 'SoftwareApplication',
        name: 'LangChain',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Cross-platform'
      },
      audience: {
        '@type': 'Audience',
        audienceType: 'Developers'
      }
    })],

    // 百度统计
    // 注册地址: https://tongji.baidu.com/
    // 替换 'YOUR_BAIDU_ANALYTICS_ID' 为你的百度统计 ID
    ['script', {}, `
      var _hmt = _hmt || [];
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?a31f1a99818e2ef5c3cba6423f14c8dc";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
      })();
    `],

    // Google Analytics 4
    // 注册地址: https://analytics.google.com/
    // 替换 'G-XXXXXXXXXX' 为你的 GA4 测量 ID
    ['script', { async: true, src: 'https://www.googletagmanager.com/gtag/js?id=G-6QMTQVCRQZ' }],
    ['script', {}, `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-6QMTQVCRQZ');
    `],

    // 51.la 统计
    // 注册地址: https://www.51.la/
    // 替换统计代码
    // ['script', { charset: 'UTF-8', id: 'LA_COLLECT', src: '//sdk.51.la/js-sdk-pro.min.js' }],
    // ['script', {}, `LA.init({id:"YOUR_51LA_ID",ck:"YOUR_51LA_CK"})`],
  ],

  cleanUrls: true,
  ignoreDeadLinks: true,

  // 站点地图配置
  sitemap: {
    hostname: 'https://langchain-docs-cn.com'
  },

  markdown: {
    config: (md) => {
      md.use(groupIconMdPlugin)
    }
  },
  vite: {
    plugins: [groupIconVitePlugin()]
  },
  lastUpdated: true,
  lang: 'zh-CN',
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'LangChain 中文文档',
    outline: {
      label: '本页目录',
      level: [2, 3]
    },
    returnToTopLabel: '返回顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭'
                }
              }
            }
          }
        }
      }
    },
    footer: {
      message: 'LangChain 中文文档',
      copyright: 'Copyright © 王码码'
    },
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    },
    editLink: {
      pattern: 'https://github.com/happyphper/langchain-docs-cn/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页'
    },
    nav: [
      { text: '首页', link: '/' },
      {
        text: 'LangChain + LangGraph',
        items: [
          { text: 'LangChain', link: '/oss/python/langchain/overview' },
          { text: 'LangGraph', link: '/oss/python/langgraph/overview' },
          { text: 'Deep Agents', link: '/oss/python/deepagents/overview' },
          { text: 'Integrations', link: '/oss/python/integrations/providers/overview' },
          { text: 'Learn', link: '/oss/python/learn' },
          { text: 'Reference', link: '/oss/python/reference/overview' },
          { text: 'Contribute', link: '/oss/python/contributing/overview' }
        ]
      },
      {
        text: 'LangSmith',
        items: [
          { text: 'Get started', link: '/langsmith/home' },
          { text: 'Observability', link: '/langsmith/observability' },
          { text: 'Evaluation', link: '/langsmith/evaluation' },
          { text: 'Prompt engineering', link: '/langsmith/prompt-engineering' },
          { text: 'Deployment', link: '/langsmith/deployments' },
          { text: 'Agent Builder', link: '/langsmith/agent-builder' },
          { text: 'Platform setup', link: '/langsmith/platform-setup' },
          { text: 'Reference', link: '/langsmith/reference' }
        ]
      },
    ],
    sidebar: {
      // LangSmith 路由 (放最前面，实现页面级的精确匹配)
      ...generateSidebarMap([
        lsGetStarted, lsObservability, lsEvaluation, lsPromptEngineering,
        lsDeployment, lsAgentBuilder, lsPlatformSetup, lsReference
      ]),
      '/langsmith/': lsGetStarted,

      // Python 具体路径
      '/oss/python/langchain/': sidebarLangChainPython,
      '/oss/python/langgraph/': sidebarLangGraphPython,
      '/oss/python/deepagents/': sidebarDeepAgentsPython,
      '/oss/python/integrations/': sidebarIntegrationsPython,
      '/oss/python/learn': sidebarLearnPython,
      '/oss/python/learn/': sidebarLearnPython,
      '/oss/python/contributing/': sidebarContributingPython,

      // JavaScript 具体路径
      '/oss/javascript/langchain/': sidebarLangChainJS,
      '/oss/javascript/langgraph/': sidebarLangGraphJS,
      '/oss/javascript/deepagents/': sidebarDeepAgentsJS,
      '/oss/javascript/integrations/': sidebarIntegrationsJS,
      '/oss/javascript/learn': sidebarLearnJS,
      '/oss/javascript/learn/': sidebarLearnJS,
      '/oss/javascript/contributing/': sidebarContributingJS,

      // 通用路径兜底
      '/oss/python/': sidebarPythonReference,
      '/oss/javascript/': sidebarJSReference,
    }
  }
})
