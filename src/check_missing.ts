import fs from 'fs-extra';
import path from 'path';
import { glob } from 'glob';

async function checkMissing() {
    const sourceDir = 'langchain-ai-docs/src';
    const targetDir = 'cn-docs';

    console.log('正在扫描源目录...');
    const sourceFiles = await glob('**/*.{md,mdx}', { cwd: sourceDir });

    console.log('正在扫描目标目录...');
    const targetFiles = await glob('**/*.{md,mdx}', { cwd: targetDir });

    const targetSet = new Set(targetFiles);
    const missing = sourceFiles.filter(f => !targetSet.has(f));

    console.log('\n--- 统计报表 ---');
    console.log(`源文件总数: ${sourceFiles.length}`);
    console.log(`已翻译文件: ${targetFiles.length}`);
    console.log(`缺失文件数: ${missing.length}`);

    const failedQuality: { file: string; sourceSize: number; content: string }[] = [];

    console.log('\n正在检查翻译质量...');
    for (const f of targetFiles) {
        const sourcePath = path.join(sourceDir, f);
        const targetPath = path.join(targetDir, f);

        const sourceStat = await fs.stat(sourcePath);
        const content = await fs.readFile(targetPath, 'utf-8');

        // 检查是否有中文字符
        const hasChinese = /[\u4e00-\u9fa5]/.test(content);

        // 如果源文件很小（比如只有 frontmatter），不翻译也是正常的
        const isVerySmall = sourceStat.size < 150;

        if (!hasChinese && !isVerySmall) {
            failedQuality.push({
                file: f,
                sourceSize: sourceStat.size,
                content: content.slice(0, 50).replace(/\n/g, ' ')
            });
        }
    }

    console.log(`真正翻译失败的文件数: ${failedQuality.length}`);

    if (failedQuality.length > 0) {
        console.log('\n--- 失败文件列表 (路径 | 源大小 | 目标预览) ---');
        failedQuality.forEach(item => {
            console.log(`${item.file.padEnd(60)} | ${String(item.sourceSize).padStart(6)} 字节 | ${item.content}...`);
        });
    }

    if (missing.length > 0) {
        console.log('\n--- 缺失文件列表 (前 50 个) ---');
        missing.slice(0, 50).forEach(f => console.log(f));

        // 如果缺失文件很多，可能是某个分类没翻译
        const categories = new Map();
        missing.forEach(f => {
            const cat = f.split('/')[0];
            categories.set(cat, (categories.get(cat) || 0) + 1);
        });
        console.log('\n--- 缺失文件分类分布 ---');
        [...categories.entries()].forEach(([cat, count]) => {
            console.log(`${cat}: ${count} 个`);
        });
    }
}

checkMissing();
