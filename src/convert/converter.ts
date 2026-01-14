
import fs from 'fs-extra';
import path from 'path';
import { glob } from 'glob';
import matter from 'gray-matter';
import { FileManager, CleanerOptions } from '../utils/file-manager.js';
import { MdxTransformer } from './core/transformer.js';

export interface ConverterOptions extends CleanerOptions {
  // Inherits input, output, delete
}

export class MdxConverter {
  private convertedFiles: string[] = [];

  constructor(private options: ConverterOptions) { }

  async convert() {
    const { input, output } = this.options;
    this.convertedFiles = [];

    // 1. 清理
    await FileManager.cleanOutputDirectory(this.options);

    // 2. 同步资源
    if (this.options.images) {
      await FileManager.syncStaticAssets(input, output);
    }

    // 3. 扫描文件
    const files = await glob('**/*.{mdx,md}', {
      cwd: input,
      absolute: true,
      ignore: ['**/node_modules/**', '**/.git/**', '**/dist/**', '**/public/**']
    });

    console.log(`🔍 扫描到 ${files.length} 个待处理文件`);

    for (const file of files) {
      const relativePath = path.relative(input, file).replace(/\\/g, '/');
      if (!relativePath.includes('/')) {
        console.log(`🛠️ 发现根目录文件: ${relativePath}`);
      }
      const isIndex = relativePath === 'index.mdx' || relativePath === 'index.md';

      if (relativePath.startsWith('langsmith/')) {
        await this.processLangSmithFile(file, relativePath);
      } else if (isIndex) {
        await this.processIndexFile(file);
      } else {
        // 检查文件路径是否已经包含语言目录
        const pathParts = relativePath.split('/');
        const hasLangDir = pathParts.length > 1 &&
          pathParts[0] === 'oss' &&
          (pathParts[1] === 'python' || pathParts[1] === 'javascript');

        if (hasLangDir) {
          // 已经有语言目录，只生成对应语言的版本
          const lang = pathParts[1] as 'python' | 'javascript';
          await this.processLanguageSpecificFile(file, relativePath, lang);
        } else {
          // 没有语言目录，生成两个语言版本
          await this.processLanguageVersion(file, relativePath, 'python');
          await this.processLanguageVersion(file, relativePath, 'javascript');
        }
      }
    }

    console.log(`\n✅ 转换完成！共生成 ${this.convertedFiles.length} 个文件。`);
  }

  private async processIndexFile(file: string) {
    const { output } = this.options;
    const content = await fs.readFile(file, 'utf-8');
    const targetPath = path.join(output, 'index.md');

    let converted = MdxTransformer.transform(content, 'python', 'index.md');

    const { data, content: body } = matter(converted);
    data.sidebar = false;
    data.aside = false;

    const finalConverted = matter.stringify(body, data);
    await fs.writeFile(targetPath, finalConverted);
    this.convertedFiles.push('index.md');
    console.log(`[INDEX] 已转换: index.md`);
  }

  private async processLangSmithFile(file: string, relativePath: string) {
    const { output } = this.options;
    const content = await fs.readFile(file, 'utf-8');

    let targetRelPath = relativePath.replace(/\.mdx$/, '.md').replace(/\\/g, '/');
    const targetPath = path.join(output, targetRelPath);
    await fs.ensureDir(path.dirname(targetPath));

    // 传入原始相对路径，用于计算图片的绝对路径
    const converted = MdxTransformer.transform(content, 'all', relativePath);
    await fs.writeFile(targetPath, converted);
    this.convertedFiles.push(targetRelPath);
    console.log(`[LANGSMITH] 已转换: ${targetRelPath}`);
  }

  /**
   * 处理已经包含语言目录的文件（如 oss/python/integrations/...）
   * 这些文件不需要生成多个语言版本，直接按原路径输出
   */
  private async processLanguageSpecificFile(file: string, relativePath: string, lang: 'python' | 'javascript') {
    const { output } = this.options;
    const content = await fs.readFile(file, 'utf-8');

    let targetRelPath = relativePath.replace(/\.mdx$/, '.md').replace(/\\/g, '/');
    const targetPath = path.join(output, targetRelPath);
    await fs.ensureDir(path.dirname(targetPath));

    // 使用对应的语言进行转换，但不调整路径
    const converted = MdxTransformer.transform(content, lang, relativePath);
    await fs.writeFile(targetPath, converted);
    this.convertedFiles.push(targetRelPath);
    console.log(`[${lang.toUpperCase()}-SPECIFIC] 已转换: ${targetRelPath}`);
  }

  private async processLanguageVersion(file: string, relativePath: string, lang: 'python' | 'javascript') {
    const { output } = this.options;
    const content = await fs.readFile(file, 'utf-8');

    const langDir = lang === 'javascript' ? 'javascript' : 'python';
    let targetRelPath = relativePath.replace(/\.mdx$/, '.md').replace(/\\/g, '/');

    const pathParts = targetRelPath.split('/');
    if (pathParts.length > 1) {
      const firstDir = pathParts[0];
      const secondDir = pathParts[1];

      if (firstDir === 'oss' && (secondDir === 'python' || secondDir === 'javascript')) {
        if (secondDir !== langDir) {
          pathParts[1] = langDir;
          targetRelPath = pathParts.join('/');
        }
      } else {
        pathParts.splice(1, 0, langDir);
        targetRelPath = pathParts.join('/');
      }
    } else {
      targetRelPath = `${langDir}/${targetRelPath}`;
    }

    const targetPath = path.join(output, targetRelPath);
    await fs.ensureDir(path.dirname(targetPath));

    // 传入原始相对路径 relativePath，因为图片是按原始结构 sync 到 public 的
    const converted = MdxTransformer.transform(content, lang, relativePath);
    await fs.writeFile(targetPath, converted);
    this.convertedFiles.push(targetRelPath);
    console.log(`[${lang.toUpperCase()}] 已转换: ${targetRelPath}`);
  }
}
