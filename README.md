# LangChain 中文文档 (LangChain Chinese Documentation)

本项目致力于构建高质量的 [LangChain](https://github.com/langchain-ai/langchain) 中文文档。基于 [VitePress](https://vitepress.dev/) 驱动，包含从 MDX 源码自动转换、组件适配、翻译到静态站点生成的完整工程化流程。

## 🌟 核心特性

*   **自动化转换**: 将官方 Next.js/MDX 格式文档无缝转换为 VitePress Markdown 格式。
*   **智能修复**: 自动处理相对路径图片 (`LinkProcessor`)、代码块语法 (`SyntaxProcessor`) 和 React 组件适配。
*   **深度集成**: 内置 Mermaid 图表支持，解决 SSR 渲染兼容性问题。
*   **高性能构建**: 针对 3800+ 页面规模的超大型文档站点进行了构建配置优化。

## 📋 环境要求 (Prerequisites)

*   **Node.js**: v18.0.0+
*   **Package Manager**: pnpm (推荐)
*   **RAM**: 构建需 **16GB+** (极其重要)

## 🚀 快速开始 (Quick Start)

### 1. 安装依赖

```bash
pnpm install
```

### 2. 同步静态资源 (Sync Assets)

将源码中的图片等静态资源同步到 VitePress `public` 目录：

```bash
pnpm sync-assets
```
> **注意**: 如果遇到图片 404 问题，通常是因为未执行此步骤。

### 3. 执行文档转换 (Convert)

扫描 `langchain-ai-docs` 并生成 Markdown 文件：

```bash
pnpm convert
```

### 4. 本地开发预览 (Dev)

启动本地开发服务器：

```bash
pnpm docs:dev
```
访问: `http://localhost:5173`

### 5. 生产环境构建 (Build)

**⚠️ 内存警告 (OOM Warning)**
由于文档规模巨大，默认 Node.js 内存限制 (通常 2-4GB) 不足以完成构建。**必须**显式增加内存限制：

```bash
NODE_OPTIONS="--max-old-space-size=16384" pnpm docs:build
```

构建产物位于: `docs/.vitepress/dist`

### 6. 预览构建产物 (Preview)

```bash
pnpm docs:preview
```

## 📂 项目结构

```text
langchain-docs-cn/
├── src/                        # 核心转换脚本
│   ├── index.ts                # 转换入口
│   ├── converter.ts            # MdxConverter 主逻辑
│   └── processors/             # 语法与内容处理器
│       ├── link-processor.ts   # 图片/链接修复
│       └── syntax-processor.ts # Vue/MDX 语法兼容
├── docs/                       # VitePress 项目根目录
│   ├── .vitepress/             # 配置、主题、样式
│   └── oss/                    # 生成的文档内容
├── langchain-ai-docs/          # 官方文档 Submodule
└── README.md                   # 本文件
```

## 🛠️ 常见问题 (FAQ)

### Q: 构建报错 `mermaidRenderer.initialize is not a function`?
**A**: 已修复。这是因为 Mermaid 插件在 SSR 环境下运行导致的。我们已在 `theme/index.ts` 中添加了浏览器环境检查 (`inBrowser`)。

### Q: 为什么构建需要这么多内存？
**A**: 项目包含近 4000 个 Markdown 文件和复杂的组件引用，Rollup 在打包含时需要建立庞大的依赖图。16GB 是验证过的安全阈值。

### Q: 发现很多死链 (Dead Links)?
**A**: 目前配置 (`config.mts`) 中已开启 `ignoreDeadLinks: true`，以确保在文档重构和翻译过程中构建流程不被阻断。

## 🤝 贡献指南

1.  确保在 `src/` 修改转换逻辑后，运行 `pnpm convert` 重新生成文档。
2.  提交前请先在本地运行 `pnpm docs:build` 验证构建通过。