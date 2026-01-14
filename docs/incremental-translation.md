# 增量翻译功能说明

## 功能概述

翻译脚本现已支持基于 Git 的增量翻译功能,可以智能检测源码仓库的变更,只翻译有变化的文件,大幅提升翻译效率。

## 工作原理

1. **版本追踪**: 在目标目录 (`cn-docs`) 下维护一个 `.translation-version.json` 文件,记录上次翻译时的 Git commit hash
2. **差异检测**: 使用 `git diff` 比较当前版本与上次翻译版本的差异
3. **智能处理**: 根据文件状态采取不同策略:
   - **新增文件** → 翻译并保存到 `cn-docs`
   - **修改文件** → 重新翻译并覆盖
   - **删除文件** → 从 `cn-docs` 删除对应文件
   - **重命名文件** → 在 `cn-docs` 中重命名(无需重新翻译)

## 使用方式

### 1. 增量翻译 (默认模式)

```bash
npm run translate [源目录] [目标目录]
```

**示例**:
```bash
npm run translate langchain-ai-docs/src cn-docs
```

**行为**:
- 首次运行: 执行全量翻译,并记录当前 commit
- 后续运行: 只处理有变更的文件

### 2. 强制全量翻译

```bash
npm run translate [源目录] [目标目录] --force
```

**示例**:
```bash
npm run translate langchain-ai-docs/src cn-docs --force
```

**行为**:
- 忽略版本记录,翻译所有文件
- 不更新 `.translation-version.json`

## 工作流程示例

### 场景 1: 首次翻译

```bash
$ npm run translate langchain-ai-docs/src cn-docs

🚀 开始翻译任务
📁 源目录: langchain-ai-docs/src
📁 目标目录: cn-docs
🔧 模式: 增量翻译
📝 未找到上次翻译记录，将执行全量翻译

📝 首次翻译,执行全量处理...
📂 找到 1234 个文件
✅ 已保存: docs/introduction.mdx
✅ 已保存: docs/quickstart.mdx
...
💾 已保存翻译版本: a1b2c3d
✨ 翻译任务处理完毕！
```

### 场景 2: 源码更新后的增量翻译

假设源码仓库有以下变更:
- 新增: `docs/new-feature.mdx`
- 修改: `docs/quickstart.mdx`
- 删除: `docs/deprecated.mdx`
- 重命名: `docs/old-name.mdx` → `docs/new-name.mdx`

```bash
$ cd langchain-ai-docs && git pull && cd ..
$ npm run translate langchain-ai-docs/src cn-docs

🚀 开始翻译任务
📁 源目录: langchain-ai-docs/src
📁 目标目录: cn-docs
🔧 模式: 增量翻译
🔍 检测变更: a1b2c3d -> e4f5g6h

📊 检测到 4 个文件变更:
   - 新增: 1
   - 修改: 1
   - 删除: 1
   - 重命名: 1

🔄 开始处理变更...

🔄 新增: docs/new-feature.mdx
✅ 已保存: docs/new-feature.mdx
🔄 修改: docs/quickstart.mdx
✅ 已保存: docs/quickstart.mdx
🗑️  已删除: docs/deprecated.mdx
📝 已重命名: docs/old-name.mdx -> docs/new-name.mdx

💾 已保存翻译版本: e4f5g6h
✨ 翻译任务处理完毕！
```

### 场景 3: 无变更

```bash
$ npm run translate langchain-ai-docs/src cn-docs

🚀 开始翻译任务
📁 源目录: langchain-ai-docs/src
📁 目标目录: cn-docs
🔧 模式: 增量翻译
🔍 检测变更: e4f5g6h -> e4f5g6h

✨ 没有检测到文件变更,无需翻译
```

## 版本记录文件

`.translation-version.json` 示例:

```json
{
  "commit": "e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3",
  "timestamp": "2026-01-14T09:20:25.123Z"
}
```

## 注意事项

1. **Git 仓库要求**: 源目录 (`langchain-ai-docs/src`) 必须是一个 Git 仓库
2. **版本文件**: 不要手动修改或删除 `.translation-version.json`,除非你想重置翻译历史
3. **并发控制**: 当前并发数设置为 10,可根据 API 限制调整 `CONCURRENCY` 常量
4. **错误处理**: 如果某个文件翻译失败,会记录错误但继续处理其他文件

## 高级用法

### 查看当前翻译版本

```bash
cat cn-docs/.translation-version.json
```

### 重置翻译历史

```bash
rm cn-docs/.translation-version.json
npm run translate langchain-ai-docs/src cn-docs
```

### 查看待翻译的变更

```bash
cd langchain-ai-docs
git diff <上次commit> HEAD --name-status -- '*.md' '*.mdx'
```

## 故障排查

### 问题: "无法获取 Git commit"

**原因**: 源目录不是 Git 仓库或 Git 未安装

**解决**:
```bash
cd langchain-ai-docs
git init  # 如果不是 Git 仓库
git add .
git commit -m "Initial commit"
```

### 问题: 想要重新翻译某个文件

**方法 1**: 删除目标文件,使用 `--force`
```bash
rm cn-docs/docs/specific-file.mdx
npm run translate langchain-ai-docs/src cn-docs --force
```

**方法 2**: 在源仓库中触发该文件的变更
```bash
cd langchain-ai-docs
touch src/docs/specific-file.mdx
git add src/docs/specific-file.mdx
git commit -m "Trigger retranslation"
cd ..
npm run translate langchain-ai-docs/src cn-docs
```

## 性能优化建议

1. **定期更新**: 建议每天或每周运行一次增量翻译,避免积累过多变更
2. **监控 API 限制**: 如果遇到 429 错误,降低 `CONCURRENCY` 值
3. **批量处理**: 对于大量变更,考虑在非高峰时段运行

## 与 CI/CD 集成

可以将增量翻译集成到 CI/CD 流程:

```yaml
# .github/workflows/translate.yml
name: Auto Translate

on:
  schedule:
    - cron: '0 2 * * *'  # 每天凌晨 2 点
  workflow_dispatch:

jobs:
  translate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: true
      
      - name: Update source docs
        run: |
          cd langchain-ai-docs
          git pull origin main
      
      - name: Run incremental translation
        env:
          ZHIPU_API_KEY: ${{ secrets.ZHIPU_API_KEY }}
        run: npm run translate
      
      - name: Commit changes
        run: |
          git config user.name "Translation Bot"
          git config user.email "bot@example.com"
          git add cn-docs
          git commit -m "chore: update translations" || exit 0
          git push
```
