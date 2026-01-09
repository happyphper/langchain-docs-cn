import { nextTick, onMounted } from "vue";

import DefaultTheme from 'vitepress/theme'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import Card from './components/Card.vue'
import CardGroup from './components/CardGroup.vue'
import Tabs from './components/Tabs.vue'
import Tab from './components/Tab.vue'
import Callout from './components/Callout.vue'
import Icon from './components/Icon.vue'
import Columns from './components/Columns.vue'
import Tip from './components/Tip.vue'
import Steps from './components/Steps.vue'
import Step from './components/Step.vue'
import Info from './components/Info.vue'
import Warning from './components/Warning.vue'
import Expandable from './components/Expandable.vue'
import Update from './components/Update.vue'
import Note from './components/Note.vue'
import Tooltip from './components/Tooltip.vue'
import ParamField from './components/ParamField.vue'
import Frame from './components/Frame.vue'
import './custom.css'

import { createMermaidRenderer } from "vitepress-mermaid-renderer";
import 'virtual:group-icons.css'

library.add(fas, fab)

import DocHeader from './components/DocHeader.vue'
import LanguageSelector from './components/LanguageSelector.vue'
import CustomFooter from './components/CustomFooter.vue'
import { h, defineComponent } from 'vue'

import { useData, inBrowser } from 'vitepress'
import mediumZoom from 'medium-zoom'
import type { Zoom } from 'medium-zoom'

let zoom: Zoom;

function initZoom() {
  if (typeof window === 'undefined') return;
  nextTick(() => {
    const images = Array.from(document.querySelectorAll('.vp-doc img:not(.no-zoom)'));
    if (!zoom) {
      zoom = mediumZoom(images, {
        background: 'rgba(0,0,0,0.8)',
        margin: 24
      });
    } else {
      zoom.detach();
      zoom.attach(...images);
    }
  });
}

const CustomLayout = defineComponent({
  setup() {
    const { page } = useData()
    return () => h(DefaultTheme.Layout, null, {
      'doc-before': () => h(DocHeader),
      'sidebar-nav-before': () => {
        if (page.value.relativePath.startsWith('langsmith/')) {
          return null
        }
        return h(LanguageSelector)
      },
      // 确保默认的页脚和编辑链接能够显示
      // 不覆盖 doc-footer-before 和 doc-after 插槽
      'doc-after': () => h(CustomFooter)
    })
  }
})

export default {
  extends: DefaultTheme,
  Layout: CustomLayout,
  setup() {
    onMounted(() => {
      initZoom();
    });
  },
  enhanceApp({ app, router }) {
    app.component('font-awesome-icon', FontAwesomeIcon)
    app.component('DocHeader', DocHeader)
    app.component('Card', Card)
    app.component('CardGroup', CardGroup)
    app.component('Tabs', Tabs)
    app.component('Tab', Tab)
    app.component('Callout', Callout)
    app.component('Icon', Icon)
    app.component('Columns', Columns)
    app.component('Tip', Tip)
    app.component('Steps', Steps)
    app.component('Step', Step)
    app.component('Info', Info)
    app.component('Warning', Warning)
    app.component('Expandable', Expandable)
    app.component('Update', Update)
    app.component('Note', Note)
    app.component('Tooltip', Tooltip)
    app.component('ParamField', ParamField)
    app.component('Frame', Frame)

    // Use client-only safe implementation
    if (inBrowser) {
      const mermaidRenderer = createMermaidRenderer();
      mermaidRenderer.initialize();

      if (router) {
        router.onAfterRouteChange = () => {
          nextTick(() => {
            mermaidRenderer.renderMermaidDiagrams();
            initZoom();
          });
        };
      }
    }
  }
}