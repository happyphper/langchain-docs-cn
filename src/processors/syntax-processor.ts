
export class SyntaxProcessor {

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
