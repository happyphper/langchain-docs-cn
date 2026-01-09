<template>
  <footer class="custom-footer">
    <div class="footer-content">
      <div class="footer-main">
        <div class="footer-section">
          <h3>关于</h3>
          <p class="footer-description">
            LangChain 中文文档 - 为中文开发者提供最新、最全面的 LangChain 技术文档
          </p>
        </div>
        
        <div class="footer-section">
          <h3>相关链接</h3>
          <ul class="footer-links">
            <li><a href="https://www.langchain.com" target="_blank" rel="noopener">LangChain 官网</a></li>
            <li><a href="https://github.com/langchain-ai/langchain" target="_blank" rel="noopener">LangChain GitHub</a></li>
            <li><a href="https://github.com/happyphper/langchain-docs-cn" target="_blank" rel="noopener">本项目 GitHub</a></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h3>社区</h3>
          <ul class="footer-links">
            <li><a href="https://github.com/happyphper/langchain-docs-cn/issues" target="_blank" rel="noopener">反馈问题</a></li>
            <li><a href="https://github.com/happyphper/langchain-docs-cn/discussions" target="_blank" rel="noopener">参与讨论</a></li>
          </ul>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p class="footer-copyright">Copyright © 2026 王码码</p>
        <p class="footer-powered">
          Powered by 
          <a href="https://vitepress.dev" target="_blank" rel="noopener">VitePress</a>
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.custom-footer {
  margin-top: 5rem;
  padding: 4rem 0 2.5rem;
  border-top: 1px solid var(--vp-c-divider);
  background: linear-gradient(to bottom, var(--vp-c-bg), var(--vp-c-bg-soft));
}

.footer-content {
  max-width: var(--vp-layout-max-width);
  margin: 0 auto;
  padding: 0 24px;
}

.footer-main {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
}

.footer-section h3 {
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 0 1.25rem 0;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  position: relative;
  padding-bottom: 0.75rem;
}

.footer-section h3::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 2rem;
  height: 2px;
  background: var(--vp-c-brand);
  border-radius: 1px;
}

.footer-description {
  font-size: 0.9375rem;
  line-height: 1.7;
  color: var(--vp-c-text-2);
  margin: 0;
  max-width: 400px;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 0.75rem;
}

.footer-links a {
  font-size: 0.9375rem;
  color: var(--vp-c-text-2);
  text-decoration: none;
  transition: all 0.25s ease;
  display: inline-flex;
  align-items: center;
  position: relative;
  padding-left: 0;
}

.footer-links a::before {
  content: '→';
  position: absolute;
  left: -1.25rem;
  opacity: 0;
  transition: all 0.25s ease;
  color: var(--vp-c-brand);
}

.footer-links a:hover {
  color: var(--vp-c-brand);
  padding-left: 1.25rem;
}

.footer-links a:hover::before {
  opacity: 1;
  left: 0;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 2rem;
  border-top: 1px solid var(--vp-c-divider);
  flex-wrap: wrap;
  gap: 1rem;
}

.footer-copyright,
.footer-powered {
  font-size: 0.875rem;
  color: var(--vp-c-text-3);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.footer-powered {
  font-weight: 500;
}

.footer-powered a {
  color: var(--vp-c-brand);
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s ease;
  position: relative;
}

.footer-powered a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--vp-c-brand);
  transition: width 0.2s ease;
}

.footer-powered a:hover::after {
  width: 100%;
}

.footer-powered a:hover {
  opacity: 0.8;
}

/* 暗色模式优化 */
.dark .custom-footer {
  background: linear-gradient(to bottom, var(--vp-c-bg), var(--vp-c-bg-mute));
}

/* 响应式设计 */
@media (max-width: 960px) {
  .footer-main {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
  
  .footer-section:first-child {
    grid-column: 1 / -1;
  }
}

@media (max-width: 640px) {
  .custom-footer {
    padding: 3rem 0 2rem;
  }
  
  .footer-main {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .footer-section:first-child {
    grid-column: 1;
  }
  
  .footer-bottom {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }
  
  .footer-description {
    max-width: 100%;
  }
}
</style>
