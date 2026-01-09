import { FileManager } from './utils/file-manager';
import path from 'path';

async function main() {
    const sourceDir = process.argv[2] || 'langchain-ai-docs/src';
    const targetDir = process.argv[3] || 'docs';

    console.log(`📡 正在启动静态资源同步...`);
    console.log(`📂 源目录: ${path.resolve(sourceDir)}`);
    console.log(`📂 目标目录: ${path.resolve(targetDir)}`);

    try {
        await FileManager.syncStaticAssets(sourceDir, targetDir);
        console.log('✨ 静态资源同步任务圆满完成！');
    } catch (err) {
        console.error('❌ 同步过程中发生错误:', err);
        process.exit(1);
    }
}

main();
