
export class SyntaxProcessor {

    /**
     * 转义行内代码中的 Vue 插值语法 {{}}
     * VitePress 使用 Vue，会将 {{}} 解析为插值表达式
     * 只处理包含 {{}} 的行内代码（单个反引号），不处理普通行内代码和代码块
     * 
     * 示例：`${{ env.VAR }}` -> <code v-pre>${{ env.VAR }}</code>
     */
    static escapeVueInterpolation(content: string): string {
        // 匹配所有行内代码（单个反引号）
        // (?<!`) 确保反引号前面不是反引号
        // (?!`) 确保反引号后面不是反引号
        return content.replace(/(?<!`)(`)([^`]+)\1(?!`)/g, (match, backtick, codeContent) => {
            // 只要内容包含 {{，这就可能是 Vue 插值或容易引起混淆的内容
            // 加上 v-pre 是安全的，可以防止 Vue 编译错误
            // 这涵盖了 `{{`, `{{{{`, `${{...}}` 等情况
            if (codeContent.includes('{{')) {
                return `<code v-pre>${codeContent}</code>`;
            }
            return match;
        });
    }

    /**
     * 规范化 Markdown 表格的缩进
     * 移除表格行前的所有空格，确保表格能被正确解析
     */
    static normalizeMarkdownTableIndents(content: string): string {
        // 匹配 Markdown 表格行（以 | 开头和结尾）
        // 移除行首的所有空格
        return content.replace(/^[ \t]+(\|.*\|)[ \t]*$/gm, '$1');
    }

    /**
     * 规范化普通文本的缩进
     * 移除普通段落文本前 4 个或更多空格的缩进，防止被识别为代码块
     * 但保留列表项、标题等 Markdown 语法的缩进
     */
    static normalizeTextIndents(content: string): string {
        // 匹配以 4 个或更多空格开头的行，但排除：
        // - 代码块标记（```）
        // - 列表项（-, *, +, 数字.）
        // - 标题（#）
        // - 表格行（|）
        // - 空行
        // - HTML 标签（<）
        return content.replace(/^[ \t]{4,}(?!```|[-*+]|\d+\.|#|\||<|$)(.+)$/gm, (match, text) => {
            // 保留原始文本，但移除所有前导空格
            return text;
        });
    }

    static processAttributes(content: string): string {
        let transformed = content;

        // 移除 Spread Props {...props}
        transformed = transformed.replace(/\{\.\.\.\w+\}/g, '');

        // 属性转换
        transformed = transformed.replace(/(<[a-zA-Z0-9-]+)(\s+[^>]*?)(\/?>)/g, (tagMatch, start, attrString, end) => {
            let convertedAttrs = attrString;

            // 1. Style 转换
            convertedAttrs = convertedAttrs.replace(/style=\{\{(.*?)\}\}/g, (match, p1) => {
                const styleObj = p1.replace(/"/g, "'").trim();
                return `:style="{ ${styleObj} }"`;
            });
            convertedAttrs = convertedAttrs.replace(/style=\{(.*?)\}/g, (match, p1) => {
                const styleExp = p1.replace(/"/g, "'").trim();
                return `:style="${styleExp}"`;
            });

            // 2. 通用属性转换 (prop={val} -> :prop="val")
            // 精确匹配 key={val} 这种属性赋值结构
            convertedAttrs = convertedAttrs.replace(/(\s+)(?!style)(\w+)=\{([^}]*)\}/g, (match, s, prop, val) => {
                // 移除值内部可能存在的注释
                const cleanVal = val.replace(/\/\*[\s\S]*?\*\//g, '').replace(/"/g, "'").trim();
                return `${s}:${prop}="${cleanVal}"`;
            });

            let result = `${start}${convertedAttrs}${end}`;
            const tagName = start.substring(1).toLowerCase().trim();

            // 【自闭合守卫】
            // 如果原始标签是自闭合的 (/>)，但转换结果丢失了 / (变成了 >)，强制修复
            if (tagMatch.trim().endsWith('/>') && !result.trim().endsWith('/>') && result.trim().endsWith('>')) {
                result = result.trim().replace(/>$/, '/>');
            }

            // 【特殊处理 iframe】
            // HTML5 中 iframe 不是自闭合标签。如果输出 <iframe />，浏览器会忽略 / 导致标签未闭合。
            if (tagName === 'iframe' && result.trim().endsWith('/>')) {
                result = result.trim().replace(/\/>$/, '></iframe>');
            }

            return result;
        });

        return transformed;
    }

    static processVoidTags(content: string): string {
        const voidRegex = /<(?!(?:img|br|hr|input|link|meta|path|circle|area|base|col|embed|keygen|param|source|track|wbr))(?<tagName>[A-Z][a-zA-Z0-9]*|\w+-\w+)(?<props>[^>]*?)\s*\/>/g;
        return content.replace(voidRegex, (...args) => {
            const groups = args[args.length - 1] as any;
            const { tagName, props } = groups;
            const inlineComponents = ['Icon', 'Tooltip'];
            if (inlineComponents.includes(tagName)) {
                return `<${tagName}${props}></${tagName}>`;
            }
            return `\n\n<${tagName}${props}></${tagName}>\n\n`;
        });
    }

    static removeImportsExports(content: string): string {
        let transformed = content;
        transformed = transformed.replace(/^\s*import\b[\s\S]*?from\s+['"].*?['"];?\s*$/gm, '');
        transformed = transformed.replace(/^\s*export\b[\s\S]*?[;=][\s\S]*?(?:;|$)/gm, '');
        transformed = transformed.replace(/^\s*export\s+default\s+.*$/gm, '');
        return transformed;
    }

    static cleanDuplicateAttributes(content: string): string {
        return content.replace(/<([a-zA-Z0-9-]+)([^>]*?)>/g, (tagMatch, tagName, attrString) => {
            // 更加健壮的属性分析逻辑。匹配 key="val", key='val', key={val}, 或 key
            const attrRegex = /([:\w.-]+)(?:=(?:"[^"]*"|'[^']*'|\{[^}]*\}|[^\s>]+))?/g;
            const matches = [...attrString.matchAll(attrRegex)];

            const cleanedAttrs: string[] = [];
            const keys = new Map<string, number>();

            matches.forEach((m) => {
                const fullAttr = m[0];
                const key = m[1];
                const isDynamic = key.startsWith(':');
                const baseKey = isDynamic ? key.substring(1) : key;

                if (keys.has(baseKey)) {
                    const oldIndex = keys.get(baseKey)!;
                    const oldAttr = cleanedAttrs[oldIndex];
                    const oldIsDynamic = oldAttr.startsWith(':');

                    // 动态绑定优先，或者后来的覆盖先来的
                    if (isDynamic || !oldIsDynamic) {
                        cleanedAttrs[oldIndex] = ''; // 标记删除
                        cleanedAttrs.push(fullAttr);
                        keys.set(baseKey, cleanedAttrs.length - 1);
                    }
                } else {
                    cleanedAttrs.push(fullAttr);
                    keys.set(baseKey, cleanedAttrs.length - 1);
                }
            });

            const resultAttrs = cleanedAttrs.filter(a => a !== '').join(' ');
            return `<${tagName} ${resultAttrs}>`.replace(/\s{2,}/g, ' ').replace('> >', '>');
        });
    }
}
