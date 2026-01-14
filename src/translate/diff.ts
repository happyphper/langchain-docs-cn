/**
 * Git 差异检测模块
 * 用于检测源码仓库的文件变更
 */
import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';

export interface FileChange {
    type: 'added' | 'modified' | 'deleted' | 'renamed';
    oldPath?: string;  // 重命名时的旧路径
    newPath: string;   // 当前路径
    status: string;    // Git 状态码
}

export interface DiffResult {
    changes: FileChange[];
    currentCommit: string;
    previousCommit?: string;
}

/**
 * 拉取最新的 Git 变更
 */
export function pullLatestChanges(repoPath: string, submodulePath?: string): void {
    try {
        if (submodulePath) {
            console.log(`🔄 正在拉取子模块 ${submodulePath} 的最新变更...`);
            // 在主仓库目录下更新指定的子模块路径
            execSync(`git submodule update --remote "${submodulePath}"`, {
                cwd: repoPath,
                encoding: 'utf-8',
                stdio: 'inherit'
            });
            console.log(`✅ 已更新子模块: ${submodulePath}`);
        } else {
            console.log('🔄 正在拉取主仓库最新变更...');
            execSync('git pull', {
                cwd: repoPath,
                encoding: 'utf-8',
                stdio: 'inherit'
            });
            console.log('✅ 已拉取最新变更');
        }
    } catch (error) {
        console.warn(`⚠️  拉取变更失败: ${error}`);
        console.warn('⚠️  将继续使用当前本地版本进行翻译');
    }
}

/**
 * 获取指定目录的当前 Git commit hash
 */
export function getCurrentCommit(repoPath: string): string {
    try {
        const commit = execSync('git rev-parse HEAD', {
            cwd: repoPath,
            encoding: 'utf-8'
        }).trim();
        return commit;
    } catch (error) {
        throw new Error(`无法获取 Git commit: ${error}`);
    }
}

/**
 * 从版本记录文件读取上次翻译的 commit
 */
export async function getLastTranslatedCommit(versionFile: string): Promise<string | null> {
    try {
        if (await fs.pathExists(versionFile)) {
            const content = await fs.readFile(versionFile, 'utf-8');
            const data = JSON.parse(content);
            return data.commit || null;
        }
    } catch (error) {
        console.warn(`⚠️  读取版本文件失败: ${error}`);
    }
    return null;
}

/**
 * 保存当前翻译的 commit 到版本记录文件
 */
export async function saveTranslatedCommit(versionFile: string, commit: string): Promise<void> {
    const data = {
        commit,
        timestamp: new Date().toISOString(),
    };
    await fs.ensureDir(path.dirname(versionFile));
    await fs.writeFile(versionFile, JSON.stringify(data, null, 2), 'utf-8');
}

/**
 * 解析 Git diff 状态码
 */
function parseGitStatus(status: string): FileChange['type'] {
    switch (status[0]) {
        case 'A':
            return 'added';
        case 'M':
            return 'modified';
        case 'D':
            return 'deleted';
        case 'R':
            return 'renamed';
        default:
            return 'modified';
    }
}

/**
 * 获取两个 commit 之间的文件变更
 * 只关注 .md 和 .mdx 文件
 */
export function getFileChanges(
    repoPath: string,
    fromCommit: string,
    toCommit: string = 'HEAD',
    filePattern: string = '*.{md,mdx}'
): FileChange[] {
    try {
        // 使用 git diff --name-status 获取文件变更
        const output = execSync(
            `git diff --name-status --diff-filter=AMDR ${fromCommit} ${toCommit}`,
            {
                cwd: repoPath,
                encoding: 'utf-8'
            }
        ).trim();

        if (!output) {
            return [];
        }

        const changes: FileChange[] = [];
        const lines = output.split('\n');

        for (const line of lines) {
            const parts = line.split('\t');
            const status = parts[0];

            // 只处理 md 和 mdx 文件
            const filePath = parts[parts.length - 1];
            if (!filePath.match(/\.(md|mdx)$/i)) {
                continue;
            }

            const change: FileChange = {
                type: parseGitStatus(status),
                newPath: filePath,
                status: status
            };

            // 处理重命名情况 (格式: R100  old/path.md  new/path.md)
            if (status.startsWith('R')) {
                change.oldPath = parts[1];
                change.newPath = parts[2];
            }

            changes.push(change);
        }

        return changes;
    } catch (error) {
        throw new Error(`获取 Git 差异失败: ${error}`);
    }
}

/**
 * 获取完整的差异结果
 * @param repoPath 仓库根目录路径
 * @param versionFile 版本记录文件路径
 * @param autoPull 是否自动拉取最新变更(默认 true)
 * @param submodulePath 子模块路径(如果是子模块)
 */
export async function getDiff(
    repoPath: string,
    versionFile: string,
    autoPull: boolean = true,
    submodulePath?: string
): Promise<DiffResult> {
    // 自动拉取最新变更
    if (autoPull) {
        pullLatestChanges(repoPath, submodulePath);
    }

    // 目标的物理路径 (如果是子模块就指向子模块目录，否则指向主仓库)
    const targetPath = submodulePath ? path.resolve(repoPath, submodulePath) : repoPath;

    const currentCommit = getCurrentCommit(targetPath);
    const previousCommit = await getLastTranslatedCommit(versionFile);

    if (!previousCommit) {
        console.log('📝 未找到上次翻译记录，将执行全量翻译');
        return {
            changes: [],
            currentCommit,
            previousCommit: undefined
        };
    }

    console.log(`🔍 检测变更: ${previousCommit.substring(0, 7)} -> ${currentCommit.substring(0, 7)}`);

    const changes = getFileChanges(
        targetPath,
        previousCommit,
        currentCommit
    );

    return {
        changes,
        currentCommit,
        previousCommit
    };
}