/**
 * 翻译进度跟踪模块
 * 用于记录翻译状态,支持断点续传
 */
import fs from 'fs-extra';
import path from 'path';
import cliProgress from 'cli-progress';

export type TranslationStatus = 'pending' | 'translating' | 'completed' | 'failed';

export interface FileProgress {
    path: string;
    status: TranslationStatus;
    startTime?: string;
    endTime?: string;
    error?: string;
}

export interface ProgressData {
    sessionId: string;
    startTime: string;
    lastUpdateTime: string;
    totalFiles: number;
    completedFiles: number;
    failedFiles: number;
    files: Record<string, FileProgress>;
}

export class ProgressTracker {
    private progressFile: string;
    private data: ProgressData;
    private saveInterval: NodeJS.Timeout | null = null;
    private progressBar: cliProgress.SingleBar | null = null;
    private translatingFiles: Set<string> = new Set();

    constructor(outputDir: string, sessionId?: string) {
        this.progressFile = path.resolve(outputDir, '.translation-progress.json');
        this.data = {
            sessionId: sessionId || new Date().toISOString(),
            startTime: new Date().toISOString(),
            lastUpdateTime: new Date().toISOString(),
            totalFiles: 0,
            completedFiles: 0,
            failedFiles: 0,
            files: {}
        };
    }

    /**
     * 初始化进度条
     */
    startProgressBar(): void {
        if (this.progressBar) return;

        this.progressBar = new cliProgress.SingleBar({
            format: '翻译进度 |{bar}| {percentage}% | {value}/{total} 文件 | 正在处理: {current_files}',
            barCompleteChar: '\u2588',
            barIncompleteChar: '\u2591',
            hideCursor: true,
            clearOnComplete: false,
            stopOnComplete: true
        }, cliProgress.Presets.shades_classic);

        this.progressBar.start(this.data.totalFiles, this.data.completedFiles + this.data.failedFiles, {
            current_files: '准备中...'
        });
    }

    /**
     * 停止进度条
     */
    stopProgressBar(): void {
        if (this.progressBar) {
            this.progressBar.stop();
            this.progressBar = null;
        }
    }

    /**
     * 更新进度条显示
     */
    private updateProgressBar(): void {
        if (!this.progressBar) return;

        const completed = this.data.completedFiles + this.data.failedFiles;
        const translatingList = Array.from(this.translatingFiles).slice(0, 3);
        const currentFiles = translatingList.length > 0
            ? translatingList.map(f => path.basename(f)).join(', ')
            : '等待中...';

        this.progressBar.update(completed, {
            current_files: currentFiles
        });
    }

    /**
     * 加载已有的进度记录
     */
    async load(): Promise<boolean> {
        try {
            if (await fs.pathExists(this.progressFile)) {
                const content = await fs.readFile(this.progressFile, 'utf-8');
                this.data = JSON.parse(content);
                console.log(`📋 加载进度记录: ${this.data.completedFiles}/${this.data.totalFiles} 已完成`);
                return true;
            }
        } catch (error) {
            console.warn(`⚠️  加载进度记录失败:`, error);
        }
        return false;
    }

    /**
     * 初始化文件列表
     */
    initFiles(filePaths: string[]): void {
        this.data.totalFiles = filePaths.length;

        // 保留已完成的文件状态,新文件设为 pending
        for (const filePath of filePaths) {
            if (!this.data.files[filePath]) {
                this.data.files[filePath] = {
                    path: filePath,
                    status: 'pending'
                };
            }
        }

        // 移除不再存在的文件
        const currentPaths = new Set(filePaths);
        for (const filePath in this.data.files) {
            if (!currentPaths.has(filePath)) {
                delete this.data.files[filePath];
            }
        }

        this.updateStats();
    }

    /**
     * 获取待处理的文件列表
     */
    getPendingFiles(): string[] {
        return Object.values(this.data.files)
            .filter(f => f.status === 'pending' || f.status === 'failed')
            .map(f => f.path);
    }

    /**
     * 标记文件开始翻译
     */
    markTranslating(filePath: string): void {
        if (!this.data.files[filePath]) {
            this.data.files[filePath] = { path: filePath, status: 'pending' };
        }

        this.data.files[filePath].status = 'translating';
        this.data.files[filePath].startTime = new Date().toISOString();
        this.data.lastUpdateTime = new Date().toISOString();

        // 添加到正在翻译列表
        this.translatingFiles.add(filePath);
        this.updateProgressBar();
    }

    /**
     * 标记文件翻译完成
     */
    markCompleted(filePath: string): void {
        if (this.data.files[filePath]) {
            this.data.files[filePath].status = 'completed';
            this.data.files[filePath].endTime = new Date().toISOString();
            this.data.lastUpdateTime = new Date().toISOString();
            this.updateStats();

            // 从正在翻译列表移除
            this.translatingFiles.delete(filePath);
            this.updateProgressBar();
        }
    }

    /**
     * 标记文件翻译失败
     */
    markFailed(filePath: string, error: string): void {
        if (this.data.files[filePath]) {
            this.data.files[filePath].status = 'failed';
            this.data.files[filePath].endTime = new Date().toISOString();
            this.data.files[filePath].error = error;
            this.data.lastUpdateTime = new Date().toISOString();
            this.updateStats();

            // 从正在翻译列表移除
            this.translatingFiles.delete(filePath);
            this.updateProgressBar();
        }
    }

    /**
     * 更新统计信息
     */
    private updateStats(): void {
        const files = Object.values(this.data.files);
        this.data.completedFiles = files.filter(f => f.status === 'completed').length;
        this.data.failedFiles = files.filter(f => f.status === 'failed').length;
    }

    /**
     * 保存进度到文件
     */
    async save(): Promise<void> {
        try {
            await fs.ensureDir(path.dirname(this.progressFile));
            await fs.writeFile(
                this.progressFile,
                JSON.stringify(this.data, null, 2),
                'utf-8'
            );
        } catch (error) {
            console.error('❌ 保存进度记录失败:', error);
        }
    }

    /**
     * 启动自动保存(每5秒)
     */
    startAutoSave(): void {
        if (this.saveInterval) return;

        this.saveInterval = setInterval(async () => {
            await this.save();
        }, 5000);
    }

    /**
     * 停止自动保存
     */
    stopAutoSave(): void {
        if (this.saveInterval) {
            clearInterval(this.saveInterval);
            this.saveInterval = null;
        }
    }

    /**
     * 打印进度摘要
     */
    printSummary(): void {
        const { totalFiles, completedFiles, failedFiles } = this.data;
        const pendingFiles = totalFiles - completedFiles - failedFiles;

        console.log('\n📊 翻译进度摘要:');
        console.log(`   总文件数: ${totalFiles}`);
        console.log(`   ✅ 已完成: ${completedFiles} (${((completedFiles / totalFiles) * 100).toFixed(1)}%)`);
        console.log(`   ❌ 失败: ${failedFiles}`);
        console.log(`   ⏳ 待处理: ${pendingFiles}`);

        if (failedFiles > 0) {
            console.log('\n❌ 失败的文件:');
            Object.values(this.data.files)
                .filter(f => f.status === 'failed')
                .forEach(f => {
                    console.log(`   - ${f.path}`);
                    if (f.error) {
                        console.log(`     错误: ${f.error}`);
                    }
                });
        }
    }

    /**
     * 清理进度记录
     */
    async clear(): Promise<void> {
        try {
            if (await fs.pathExists(this.progressFile)) {
                await fs.remove(this.progressFile);
                console.log('🗑️  已清理进度记录');
            }
        } catch (error) {
            console.error('❌ 清理进度记录失败:', error);
        }
    }

    /**
     * 获取进度数据
     */
    getData(): ProgressData {
        return this.data;
    }
}
