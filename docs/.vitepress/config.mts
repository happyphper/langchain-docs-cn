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
  title: "LangChain Docs",
  description: "LangChain Chinese Documentations",
  cleanUrls: true,
  ignoreDeadLinks: true,
  markdown: {
    config: (md) => {
      md.use(groupIconMdPlugin)
    }
  },
  vite: {
    plugins: [groupIconVitePlugin()]
  },
  themeConfig: {
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
    editLink: {
      pattern: 'https://github.com/happyphper/langchain-docs-cn/edit/main/cn-docs/:path',
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
