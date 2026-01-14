import { Command } from 'commander';
import { MdxConverter } from './convert/converter.ts';
import path from 'path';

const program = new Command();

program
    .name('mdx2vitepress')
    .description('将 MDX 文件转换为 VitePress 项目')
    .version('1.0.0');

program
    .argument('[input]', '输入目录或文件路径 (默认: langchain-ai-docs/src)')
    .option('-o, --output <dir>', '输出目录', './docs')
    .option('-D, --delete', '转换前删除原有文件 (保留 .vitepress)', false)
    .option('-I, --images', '同步静态资源', false)
    .action(async (input, options) => {
        const inputPath = path.resolve(process.cwd(), input || 'langchain-ai-docs/src');
        const outputPath = path.resolve(process.cwd(), options.output);

        console.log(`🚀 开始转换...`);
        console.log(`输入: ${inputPath}`);
        console.log(`输出: ${outputPath}`);

        const converter = new MdxConverter({
            input: inputPath,
            output: outputPath,
            delete: options.delete,
            images: options.images
        });

        try {
            await converter.convert();
            console.log(`\n✅ 转换完成！`);
            console.log(`\n您可以运行以下命令预览:`);
            console.log(`pnpm vitepress dev ${options.output}`);
        } catch (error) {
            console.error(`\n❌ 转换失败:`, error);
            process.exit(1);
        }
    });

program.parse();
