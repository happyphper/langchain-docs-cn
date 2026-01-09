/**
 * DeepSeek 批量翻译脚本
 * 
 * 使用方式:
 * 1. 设置环境变量 DEEPSEEK_API_KEY
 * 2. 运行命令: npm run translate [源目录] [目标目录]
 *    例如: npm run translate docs docs_zh
 */
import fs from 'fs-extra';
import path from 'path';
import { glob } from 'glob';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import matter from 'gray-matter';

dotenv.config();

const apiKey = process.env.DEEPSEEK_API_KEY;
if (!apiKey) {
    console.error('错误: 请设置环境变量 DEEPSEEK_API_KEY');
    process.exit(1);
}

const openai = new OpenAI({
    apiKey: apiKey,
    baseURL: 'https://api.deepseek.com',
});

// 并发限制
const CONCURRENCY = 20;
// 单次请求的最大字符数推荐值
const CHUNK_SIZE_LIMIT = 4000;

/**
 * 翻译文本逻辑 (带有重试机制)
 */
async function translateText(text: string, retryCount = 3): Promise<string> {
    if (!text.trim() || text.length < 5) return text;

    try {
        const response = await openai.chat.completions.create({
            model: 'deepseek-chat',
            messages: [
                {
                    role: 'system',
                    content: `你是一个专业的 IT 技术文档翻译专家。
请将输入的内容翻译为中文。
要求：
1. 保持技术术语专业。
2. 严禁翻译代码块 (\`\`\`)、行内代码 (\`)、HTML 标签、Markdown 渲染占位符。
3. 严禁翻译 URL 链接、路径。
4. 只返回翻译结果。`
                },
                {
                    role: 'user',
                    content: text
                }
            ],
            temperature: 0.1,
        });

        return response.choices[0].message?.content || text;
    } catch (error) {
        if (retryCount > 0) {
            console.warn(`请求失败，正在重试... (${retryCount})`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            return translateText(text, retryCount - 1);
        }
        console.error('API 请求最终失败:', error);
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
        console.log(`📏 文档过长 (${markdownBody.length} 字符)，正在执行智能切片翻译...`);

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
 * 执行批量翻译 (支持增量)
 */
async function run() {
    const inputDir = process.argv[2] || 'langchain-ai-docs/src';
    const outputDir = process.argv[3] || 'cn-docs';
    const force = process.argv.includes('--force');

    console.log(`🚀 开始扫描目录: ${inputDir} ${force ? '(强制全量模式)' : '(增量模式)'}`);
    const files = await glob('**/*.{md,mdx}', { cwd: inputDir, absolute: true });

    // 过滤出需要翻译的文件
    const filesToProcess = [];
    for (const f of files) {
        const relativePath = path.relative(path.resolve(inputDir), f);
        const outputPath = path.resolve(outputDir, relativePath);
        if (force || !(await fs.pathExists(outputPath))) {
            filesToProcess.push(f);
        }
    }

    console.log(`📂 找到 ${files.length} 个文件，待翻新/翻译 ${filesToProcess.length} 个文件`);

    const chunks = [];
    for (let i = 0; i < filesToProcess.length; i += CONCURRENCY) {
        chunks.push(filesToProcess.slice(i, i + CONCURRENCY));
    }

    for (const chunk of chunks) {
        await Promise.all(chunk.map(async (filePath) => {
            const relativePath = path.relative(path.resolve(inputDir), filePath);
            const outputPath = path.resolve(outputDir, relativePath);

            try {
                const content = await fs.readFile(filePath, 'utf-8');
                const translated = await translateMarkdown(content);

                await fs.ensureDir(path.dirname(outputPath));
                await fs.writeFile(outputPath, translated, 'utf-8');

                console.log(`✅ 已保存: ${relativePath}`);
            } catch (err) {
                console.error(`❌ 翻译失败 ${relativePath}:`, err);
            }
        }));
    }

    console.log('✨ 翻译任务处理完毕！');
}

run();
