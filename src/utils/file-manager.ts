
import fs from 'fs-extra';
import path from 'path';
import { glob } from 'glob';

export interface CleanerOptions {
    input: string;
    output: string;
    delete?: boolean;
    images?: boolean;
}

export class FileManager {
    static async cleanOutputDirectory(options: CleanerOptions) {
        const { input, output } = options;
        await fs.ensureDir(output);

        if (options.delete) {
            // 深度清理模式：删除输出目录中除了 .vitepress 和隐藏文件以外的所有内容
            const entries = await fs.readdir(output, { withFileTypes: true });
            for (const entry of entries) {
                if (entry.name === '.vitepress' || entry.name.startsWith('.')) continue;

                // 我们通常也不删除 index.md 除非它确实需要被覆盖
                if (entry.name === 'index.md') continue;

                await fs.remove(path.join(output, entry.name));
            }
            console.log('🗑️  已完成深度清理 (-D 模式)');
        }
    }

    static async syncStaticAssets(input: string, output: string) {
        // 同步静态资源：按原始目录结构将 langchain-src 下所有图片复制到 docs/public
        const publicDest = path.join(output, 'public');
        // 扫描所有常见的图片格式
        const imageFiles = await glob('**/*.{png,jpg,jpeg,gif,svg,webp}', {
            cwd: input,
            absolute: true,
            ignore: ['**/node_modules/**', '**/.git/**', '**/dist/**', '**/public/**']
        });

        for (const imageFile of imageFiles) {
            const relativeImagePath = path.relative(input, imageFile);
            const destPath = path.join(publicDest, relativeImagePath);
            await fs.ensureDir(path.dirname(destPath));
            await fs.copy(imageFile, destPath, { overwrite: true });
        }
        console.log(`✅ 已按结构同步 ${imageFiles.length} 个图片资源到 public 目录`);
    }
}
