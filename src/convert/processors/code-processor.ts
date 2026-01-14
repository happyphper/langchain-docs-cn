
export class CodeProcessor {

    /**
     * 修复代码块语言标识中的特殊符号
     * 用于处理类似 ```<prompt:user> 这样的写法，将其转换为 ```prompt:user
     * 避免 VitePress 将 <...> 解析为 HTML 标签导致报错
     */
    static fixPromptLanguageTags(content: string): string {
        // 匹配 ``` 后面的空格(可选，包括 NBSP) + <prompt:xxx>
        // group 1: 反引号
        // group 2: 可选空格（\t, 普通空格, 不换行空格）
        // group 3: 标签内容 (prompt:xxx)
        return content.replace(/(`{3,})([ \t\u00A0]*)<(prompt:[^>\s]+)>/gi, '$1$2$3');
    }

    // 处理代码块标题：将 ```python Title 转换为 ```python [Title]
    static processCodeBlockTitles(content: string): string {
        // 匹配 ```python Title 这种格式，要求 Title 必须在同一行
        // $1: 反引号, $2: 语言, $3: 标题内容
        return content.replace(/^(\s*`{3,})(\w+)[ \t]+([^\n\[\{]+)$/gm, (match, backticks, lang, title) => {
            const cleanTitle = title.trim();
            if (!cleanTitle) return match;

            // 如果看起来像属性（包含 = 或 {}），不处理为标题
            if (cleanTitle.includes('{') || cleanTitle.includes('=')) {
                return match;
            }

            // 避免重复包装
            if (cleanTitle.startsWith('[') && cleanTitle.endsWith(']')) {
                return match;
            }

            return `${backticks}${lang} [${cleanTitle}]`;
        });
    }

    // 处理自定义语言块 :::python 和 :::js
    static processLanguageBlocks(content: string, targetLang: string): string {
        let transformed = content;
        const langs = ['python', 'js', 'javascript'];

        if (targetLang === 'all') {
            // LangSmith 模式：全部解包，保留内容
            langs.forEach(l => {
                const regex = new RegExp(`:::${l}\\s*([\\s\\S]*?):::`, 'g');
                transformed = transformed.replace(regex, '$1');
            });
        } else {
            langs.forEach(l => {
                const regex = new RegExp(`:::${l}\\s*([\\s\\S]*?):::`, 'g');
                if (l === targetLang || (targetLang === 'javascript' && l === 'js')) {
                    transformed = transformed.replace(regex, '$1');
                } else {
                    transformed = transformed.replace(regex, '');
                }
            });
        }
        return transformed;
    }

    // CodeGroup 转换为 VitePress 原生 code-group 语法
    static processCodeGroup(content: string): string {
        return content.replace(
            /<CodeGroup>([\s\S]*?)<\/CodeGroup>/g,
            (match, innerContent) => {
                // 1. 提取所有代码块并清理它们内部的末尾空行
                // 使用非贪婪匹配获取每一个代码块
                let cleanedInner = innerContent.replace(/(`{3,})(\w*.*)\n([\s\S]*?)\n\s*\1/g, (block, backticks, lang, code) => {
                    return `${backticks}${lang}\n${code.trimEnd()}\n${backticks}`;
                });

                // 2. 清理整体缩进
                const cleanContentIndent = (rawContent: string): string => {
                    const lines = rawContent.split('\n');
                    // 找到非空且非代码块标记的行来确定最小缩进
                    const nonFenceLines = lines.filter(line => {
                        const trimmed = line.trim();
                        return trimmed !== '' && !trimmed.startsWith('```');
                    });

                    let minIndent = Infinity;
                    if (nonFenceLines.length > 0) {
                        nonFenceLines.forEach(line => {
                            const match = line.match(/^\s*/);
                            const indent = match ? match[0].length : 0;
                            if (indent < minIndent) minIndent = indent;
                        });
                    } else {
                        minIndent = 0;
                    }

                    return lines.map(line => {
                        if (line.trim() === '') return '';
                        const trimmedLead = line.startsWith(' '.repeat(minIndent))
                            ? line.substring(minIndent)
                            : line.trimStart();
                        return trimmedLead;
                    }).join('\n').trim();
                };

                const finalInside = cleanContentIndent(cleanedInner);
                return `\n::: code-group\n\n${finalInside}\n\n:::\n`;
            }
        );
    }

    // 确保所有代码块之前都有至少一个空行
    static ensureCodeBlockSpacing(content: string): string {
        // 仅确保代码块“开始”标记 ```lang 前有空行
        // 使用 \w+ 确保它不是一个结束标记（结束标记后面通常是换行或空格）
        let transformed = content.replace(/([^\n])\n(```\w+)/g, '$1\n\n$2');

        // 确保所有代码块标记都在行首
        transformed = transformed.replace(/^[ \t]+```/gm, '```');

        return transformed;
    }

    // 清理代码块内部缩进
    static cleanupCodeBlockIndent(content: string): string {
        // 匹配代码块，支持标题
        // $1: 行首空格, $2: 反引号, $3: 语言/标题, $4: 代码内容
        return content.replace(/^([ \t]*)(`{3,})(.*)\n([\s\S]*?)\n\s*\2/gm, (match, indent, backticks, langPart, codeContent) => {
            const lines = codeContent.split('\n');

            // 找到所有非空行的缩进，计算最小公共缩进
            let minIndent = Infinity;
            lines.forEach(line => {
                if (line.trim().length > 0) {
                    const m = line.match(/^\s*/);
                    const currentIndent = m ? m[0].length : 0;
                    if (currentIndent < minIndent) minIndent = currentIndent;
                }
            });

            if (minIndent === Infinity) minIndent = 0;

            // 仅剥离公共缩进，保留相对缩进
            const cleanedLines = lines.map(line => {
                if (line.trim() === '') return '';
                // 仅物理移除 minIndent 长度的空格，绝不做 trimStart
                return line.length >= minIndent ? line.substring(minIndent) : line;
            });

            const cleanedContent = cleanedLines.join('\n').trimEnd();

            // 返回包含行首缩进的完整代码块
            return `${indent}${backticks}${langPart}\n${cleanedContent}\n${indent}${backticks}`;
        });
    }
}
