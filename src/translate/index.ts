/**
 * Deepseek AI 批量翻译脚本
 * 
 * 使用方式:
 * 1. 设置环境变量 DEEPSEEK_API_KEY
 * 2. 运行命令: pnpm translate [源目录] [目标目录]
 *    例如: pnpm translate 
 */
import fs from 'fs-extra';
import path from 'path';
import { glob } from 'glob';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import matter from 'gray-matter';
import { getDiff, saveTranslatedCommit, type FileChange } from './diff';
import { ProgressTracker } from './progress';

dotenv.config();

const apiKey = process.env.DEEPSEEK_API_KEY;
if (!apiKey) {
    console.error('错误: 请设置环境变量 DEEPSEEK_API_KEY');
    process.exit(1);
}

const model = 'deepseek-chat'
const openai = new OpenAI({
    apiKey: apiKey,
    baseURL: 'https://api.deepseek.com/v1/',
});

// 并发
const CONCURRENCY = 50;
// 单次请求的最大字符数推荐值
const CHUNK_SIZE_LIMIT = 4000;
// 静默模式 - 启用进度条时不显示详细日志
let SILENT_MODE = false;

/**
 * 翻译文本逻辑 (带有重试机制)
 */
async function translateText(text: string, retryCount = 3): Promise<string> {
    if (!text.trim() || text.length < 5) return text;

    // 固定的基础延迟，防止切片翻译过快
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
        const response = await openai.chat.completions.create({
            model: model,
            messages: [
                {
                    role: 'system',
                    content: `你是一个专业的 IT 技术文档翻译专家。
请将输入的内容翻译为中文。
要求：
1. 保持技术术语专业。
2. 严禁翻译代码块 (\`\`\`)、行内代码 (\`)、HTML 标签、Markdown 渲染占位符。
3. 严禁翻译 URL 链接、路径。
4. 只返回翻译结果。
5. HTML 标签保持不变及属性保持不变，除 title 和 alt 等描述行文本外，一律不翻译。
6. 有部分特殊、关键的单词，请使用括号的形式保留原文，如：智能体（agent）、记忆（memory）、人机协同（human-in-the-loop）。
`
                },
                {
                    role: 'user',
                    content: text
                }
            ],
            temperature: 0.1,
        });

        return response.choices[0].message?.content || text;
    } catch (error: any) {
        console.error(`❌ API 请求出错 [${error?.status || 'ERROR'}]:`, error?.message || error);

        if (retryCount > 0) {
            // 增加重试延迟，防止连续碰撞频率限制
            const delay = (4 - retryCount) * 3000;
            console.warn(`⏳ 正在执行指数退避重试... (剩余次数: ${retryCount}, 等待: ${delay}ms)`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return translateText(text, retryCount - 1);
        }
        return text;
    }
}

/**
 * 切片处理逻辑：将长文档拆分为适合 API 处理的块
 */
async function translateMarkdown(content: string): Promise<string> {
    const { data: frontmatter, content: markdownBody } = matter(content);

    // 翻译 Frontmatter
    if (frontmatter.title) frontmatter.title = await translateText(frontmatter.title);
    if (frontmatter.description) frontmatter.description = await translateText(frontmatter.description);

    let translatedBody = '';

    if (markdownBody.length > CHUNK_SIZE_LIMIT) {
        if (!SILENT_MODE) console.log(`📏 文档过长 (${markdownBody.length} 字符)，正在执行智能切片翻译...`);

        // 1. 初步按段落拆分
        const initialParagraphs = markdownBody.split(/\n\n/);
        const finalChunks: string[] = [];

        // 2. 二次检查：处理超大段落（如果段落本身就超过限制，则按长度强拆）
        for (let p of initialParagraphs) {
            if (p.length > CHUNK_SIZE_LIMIT) {
                let start = 0;
                while (start < p.length) {
                    finalChunks.push(p.slice(start, start + CHUNK_SIZE_LIMIT));
                    start += CHUNK_SIZE_LIMIT;
                }
            } else {
                finalChunks.push(p);
            }
        }

        // 3. 分批合并翻译
        let currentBuffer = '';
        for (const chunk of finalChunks) {
            if ((currentBuffer + chunk).length > CHUNK_SIZE_LIMIT) {
                translatedBody += (await translateText(currentBuffer)) + '\n\n';
                currentBuffer = chunk;
            } else {
                currentBuffer += (currentBuffer ? '\n\n' : '') + chunk;
            }
        }
        if (currentBuffer) {
            translatedBody += await translateText(currentBuffer);
        }
    } else {
        translatedBody = await translateText(markdownBody);
    }

    return matter.stringify(translatedBody, frontmatter);
}

/**
 * 处理单个文件的翻译
 */
async function processFile(
    filePath: string,
    inputDir: string,
    outputDir: string,
    tracker?: ProgressTracker
): Promise<void> {
    const relativePath = path.relative(path.resolve(inputDir), filePath);
    const outputPath = path.resolve(outputDir, relativePath);

    try {
        if (tracker) tracker.markTranslating(relativePath);

        const content = await fs.readFile(filePath, 'utf-8');
        const translated = await translateMarkdown(content);

        await fs.ensureDir(path.dirname(outputPath));
        await fs.writeFile(outputPath, translated, 'utf-8');

        if (!SILENT_MODE) console.log(`✅ 已保存: ${relativePath}`);
        if (tracker) tracker.markCompleted(relativePath);
    } catch (err) {
        console.error(`❌ 翻译失败 ${relativePath}:`, err);
        if (tracker) tracker.markFailed(relativePath, String(err));
        throw err;
    }
}

/**
 * 处理文件变更
 */
async function handleFileChange(
    change: FileChange,
    repoRootDir: string,
    outputDir: string,
    tracker?: ProgressTracker
): Promise<void> {
    const repoRootResolved = path.resolve(repoRootDir);
    const outputDirResolved = path.resolve(outputDir);

    switch (change.type) {
        case 'added':
        case 'modified': {
            // change.newPath 是相对于仓库根目录的路径,如 "src/index.mdx"
            const sourcePath = path.resolve(repoRootResolved, change.newPath);

            // 安全检查：如果文件不存在（可能已经被删除或重命名），则跳过并标记完成
            if (!(await fs.pathExists(sourcePath))) {
                if (!SILENT_MODE) console.warn(`⚠️  源文件不存在，跳过: ${change.newPath}`);
                if (tracker) tracker.markCompleted(change.newPath);
                break;
            }

            if (!SILENT_MODE) console.log(`🔄 ${change.type === 'added' ? '新增' : '修改'}: ${change.newPath}`);

            if (tracker) tracker.markTranslating(change.newPath);

            // 读取并翻译文件
            const content = await fs.readFile(sourcePath, 'utf-8');
            const translated = await translateMarkdown(content);

            // 保存到目标目录,保持相同的相对路径
            const outputPath = path.resolve(outputDirResolved, change.newPath);
            await fs.ensureDir(path.dirname(outputPath));
            await fs.writeFile(outputPath, translated, 'utf-8');

            if (!SILENT_MODE) console.log(`✅ 已保存: ${change.newPath}`);
            if (tracker) tracker.markCompleted(change.newPath);
            break;
        }

        case 'deleted': {
            const targetPath = path.resolve(outputDirResolved, change.newPath);
            if (await fs.pathExists(targetPath)) {
                await fs.remove(targetPath);
                if (!SILENT_MODE) console.log(`🗑️  已删除: ${change.newPath}`);
                if (tracker) tracker.markCompleted(change.newPath);
            }
            break;
        }

        case 'renamed': {
            if (!change.oldPath) {
                console.warn(`⚠️  重命名文件缺少旧路径: ${change.newPath}`);
                return;
            }

            const oldTargetPath = path.resolve(outputDirResolved, change.oldPath);
            const newTargetPath = path.resolve(outputDirResolved, change.newPath);

            // 如果旧文件存在,则重命名
            if (await fs.pathExists(oldTargetPath)) {
                await fs.ensureDir(path.dirname(newTargetPath));
                await fs.move(oldTargetPath, newTargetPath, { overwrite: true });
                if (!SILENT_MODE) console.log(`📝 已重命名: ${change.oldPath} -> ${change.newPath}`);
                if (tracker) tracker.markCompleted(change.newPath);
            } else {
                // 如果旧文件不存在,则当作新文件处理
                if (!SILENT_MODE) console.log(`⚠️  旧文件不存在,当作新增处理: ${change.newPath}`);
                const sourcePath = path.resolve(repoRootResolved, change.newPath);

                if (tracker) tracker.markTranslating(change.newPath);

                const content = await fs.readFile(sourcePath, 'utf-8');
                const translated = await translateMarkdown(content);

                const outputPath = path.resolve(outputDirResolved, change.newPath);
                await fs.ensureDir(path.dirname(outputPath));
                await fs.writeFile(outputPath, translated, 'utf-8');

                if (!SILENT_MODE) console.log(`✅ 已保存: ${change.newPath}`);
                if (tracker) tracker.markCompleted(change.newPath);
            }
            break;
        }
    }
}

/**
 * 执行批量翻译 (支持增量)
 */
async function run() {
    const inputDir = process.argv[2] || 'langchain-ai-docs/src';
    const outputDir = process.argv[3] || 'cn-docs';
    const force = process.argv.includes('--force');

    const inputDirResolved = path.resolve(inputDir);
    // 仓库根目录是当前运行目录(即主项目根目录)
    const repoRootDir = process.cwd();
    const versionFile = path.resolve(outputDir, '.translation-version.json');

    // 初始化进度跟踪器
    const tracker = new ProgressTracker(outputDir);
    await tracker.load();
    tracker.startAutoSave();

    // 启用静默模式,避免日志干扰进度条
    SILENT_MODE = true;

    console.log(`🚀 开始翻译任务`);
    console.log(`📁 源目录: ${inputDir}`);
    console.log(`📁 目标目录: ${outputDir}`);
    console.log(`🔧 模式: ${force ? '强制全量翻译' : '增量翻译'}`);

    try {
        if (force) {
            // 强制全量翻译模式
            console.log('\n⚡ 执行全量翻译...');
            const files = await glob('**/*.{md,mdx}', { cwd: inputDirResolved, absolute: true });
            console.log(`📂 找到 ${files.length} 个文件`);

            // 初始化文件列表并启动进度条
            const relativeFiles = files.map(f => path.relative(inputDirResolved, f));
            tracker.initFiles(relativeFiles);
            tracker.startProgressBar();
            SILENT_MODE = true;

            const chunks = [];
            for (let i = 0; i < files.length; i += CONCURRENCY) {
                chunks.push(files.slice(i, i + CONCURRENCY));
            }

            for (const chunk of chunks) {
                // 使用 Promise.all 实现真正的并发处理
                await Promise.all(
                    chunk.map(async (filePath) => {
                        try {
                            await processFile(filePath, inputDirResolved, outputDir, tracker);
                        } catch (error) {
                            console.error(`❌ 处理失败:`, error);
                        }
                    })
                );
            }
        } else {
            // 增量翻译模式
            // 自动拉取最新变更并检测差异
            // langchain-ai-docs 是子模块,需要传递相对路径
            const diffResult = await getDiff(repoRootDir, versionFile, true, 'langchain-ai-docs');

            if (!diffResult.previousCommit) {
                // 首次翻译,执行全量翻译
                console.log('\n📝 首次翻译,执行全量处理...');
                const files = await glob('**/*.{md,mdx}', { cwd: inputDirResolved, absolute: true });
                console.log(`📂 找到 ${files.length} 个文件`);

                // 初始化文件列表并启动进度条
                const relativeFiles = files.map(f => path.relative(inputDirResolved, f));
                tracker.initFiles(relativeFiles);
                tracker.startProgressBar();
                SILENT_MODE = true;

                const chunks = [];
                for (let i = 0; i < files.length; i += CONCURRENCY) {
                    chunks.push(files.slice(i, i + CONCURRENCY));
                }

                for (const chunk of chunks) {
                    // 使用 Promise.all 实现真正的并发处理
                    await Promise.all(
                        chunk.map(async (filePath) => {
                            try {
                                await processFile(filePath, inputDirResolved, outputDir, tracker);
                            } catch (error) {
                                console.error(`❌ 处理失败:`, error);
                            }
                        })
                    );
                }
            } else {
                // 处理增量变更
                const { changes } = diffResult;
                const pendingFiles = tracker.getPendingFiles();

                // 只有当 Git 没变且没有 pending 任务时才真正结束
                if (changes.length === 0 && pendingFiles.length === 0) {
                    console.log('\n✨ 没有检测到文件变更且所有任务已完成,无需翻译');
                    return;
                }

                if (changes.length > 0) {
                    console.log(`\n📊 检测到 ${changes.length} 个文件变更:`);
                    const stats = {
                        added: changes.filter(c => c.type === 'added').length,
                        modified: changes.filter(c => c.type === 'modified').length,
                        deleted: changes.filter(c => c.type === 'deleted').length,
                        renamed: changes.filter(c => c.type === 'renamed').length,
                    };
                    console.log(`   - 新增: ${stats.added}`);
                    console.log(`   - 修改: ${stats.modified}`);
                    console.log(`   - 删除: ${stats.deleted}`);
                    console.log(`   - 重命名: ${stats.renamed}`);
                }

                if (pendingFiles.length > 0 && changes.length === 0) {
                    console.log(`\n🔄 发现 ${pendingFiles.length} 个未完成的任务，正在恢复翻译...`);
                }

                console.log('\n🔄 开始处理变更...\n');

                // 如果有新变更，初始化它们；如果没有新变更但有 pending 任务，构造 dummy change 对象来复用 handleFileChange
                const filesToProcess = changes.length > 0 ? changes : pendingFiles.map(p => ({ type: 'modified' as const, newPath: p }));

                // 只有在有新变更时才重新 initFiles (避免清空正在进行的状态)
                if (changes.length > 0) {
                    tracker.initFiles(changes.map(c => c.newPath));
                }

                tracker.startProgressBar();

                // 按批次处理变更
                const chunks = [];
                for (let i = 0; i < filesToProcess.length; i += CONCURRENCY) {
                    chunks.push(filesToProcess.slice(i, i + CONCURRENCY));
                }

                for (const chunk of chunks) {
                    // 子模块的实际根目录
                    const submoduleRoot = path.resolve(repoRootDir, 'langchain-ai-docs');
                    // 使用 Promise.all 实现真正的并发处理
                    await Promise.all(
                        chunk.map(async (change) => {
                            try {
                                await handleFileChange(change, submoduleRoot, outputDir, tracker);
                            } catch (error) {
                                console.error(`❌ 处理失败 ${change.newPath}:`, error);
                            }
                        })
                    );
                }
            }

            // 保存当前 commit
            await saveTranslatedCommit(versionFile, diffResult.currentCommit);
            console.log(`\n💾 已保存翻译版本: ${diffResult.currentCommit.substring(0, 7)}`);
        }

        console.log('\n✨ 翻译任务处理完毕！');

        // 显示进度摘要
        tracker.printSummary();
    } catch (error) {
        console.error('\n❌ 翻译任务失败:', error);
        tracker.printSummary();
        process.exit(1);
    } finally {
        // 停止进度条和自动保存
        tracker.stopProgressBar();
        tracker.stopAutoSave();
        await tracker.save();
    }
}

run();
