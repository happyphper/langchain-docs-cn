
export class ComponentProcessor {

    /**
     * 规范化组件标签的缩进
     * 移除组件标签前的所有空格，防止 VitePress 将其识别为代码块
     */
    static normalizeComponentTagIndents(content: string): string {
        let result = content;

        // 处理常见的 MDX 组件标签（包括自闭合和配对标签）
        // 匹配行首的空格 + 组件标签
        const componentTagPattern = /^[ \t]+(<\/?(?:Tab|Tabs|CodeGroup|Accordion|AccordionGroup|Note|Warning|Tip|Info|Step|ParamField|Callout)(?:\s+[^>]*)?>)/gm;

        result = result.replace(componentTagPattern, '$1');

        return result;
    }

    static processSnippetImports(content: string, targetLang: string, snippetImports: Map<string, string>): string {
        let transformed = content;

        // 1. 提取所有 snippet import 语句
        transformed = transformed.replace(
            /^\s*import\s+(\w+)\s+from\s+['"]\/snippets\/(.*?)['"];?\s*$/gm,
            (match, componentName, snippetPath) => {
                const langPrefix = targetLang === 'javascript' ? 'javascript' : 'python';
                const cleanPath = snippetPath.replace(/\.mdx$/, '.md');
                const includeSyntax = `<!--@include: @/snippets/${langPrefix}/${cleanPath}-->`;
                snippetImports.set(componentName, includeSyntax);
                return '';
            }
        );

        // 2. 替换组件
        snippetImports.forEach((includeSyntax, componentName) => {
            const selfClosingRegex = new RegExp(`<${componentName}\\s*/>`, 'g');
            transformed = transformed.replace(selfClosingRegex, includeSyntax);

            const pairedRegex = new RegExp(`<${componentName}\\s*>\\s*</${componentName}>`, 'g');
            transformed = transformed.replace(pairedRegex, includeSyntax);

            const pairedWithSpaceRegex = new RegExp(`<${componentName}\\s*>[\\s\\n]*</${componentName}>`, 'g');
            transformed = transformed.replace(pairedWithSpaceRegex, includeSyntax);
        });

        return transformed;
    }

    static processStepComponent(content: string): string {
        return content.replace(
            /<Step([\s\S]*?)title=\{\s*<a\s+[^>]*href=(["'])(.*?)\2[^>]*>([\s\S]*?)<\/a>\s*\}([\s\S]*?)>/g,
            (match, p1, quote, href, text, p4) => {
                const cleanText = text.replace(/[\r\n\s]+/g, ' ').trim();
                return `<Step${p1}${p4}><template v-slot:title><a href=${quote}${href}${quote}>${cleanText}</a></template>`;
            }
        );
    }

    static processMarkdownInsideComponents(content: string): string {
        let transformed = content;
        const componentsNeedMarkdownParsing = ['Step', 'Tip', 'Note', 'Warning', 'Info', 'Callout', 'Accordion', 'ParamField'];

        componentsNeedMarkdownParsing.forEach(componentName => {
            const componentRegex = new RegExp(`(<${componentName}[^>]*>)([\\s\\S]*?)(<\\/${componentName}>)`, 'gi');
            transformed = transformed.replace(componentRegex, (match, openTag, content, closeTag) => {
                let parsedContent = content;

                // 1. 临时保护块级代码块和内部标签
                const localPlaceholders: string[] = [];
                parsedContent = parsedContent.replace(/(<ParamField[\s\S]*?<\/ParamField>|```[\s\S]*?```|<[^>]+>)/g, (m) => {
                    const placeholder = `__LOCAL_PROTECT_${localPlaceholders.length}__`;
                    localPlaceholders.push(m);
                    return placeholder;
                });

                // 2. 处理常用的 Markdown 语法
                parsedContent = parsedContent.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
                // 注释掉斜体转换，因为它会错误地将列表项的 * 识别为斜体标记
                // VitePress 会自动处理斜体语法
                // parsedContent = parsedContent.replace(/(?<!\*)\*(?!\*)([^*]+)\*(?!\*)/g, '<em>$1</em>');
                // 注释掉反引号转换，避免 Vue 编译错误（如 `**/*.ts` 被误认为 HTML 标签）
                // VitePress 会自动处理反引号
                // parsedContent = parsedContent.replace(/`([^`]+)`/g, '<code>$1</code>');

                // 3. 还原保护的内容
                localPlaceholders.forEach((original, i) => {
                    const placeholder = `__LOCAL_PROTECT_${i}__`;
                    parsedContent = parsedContent.replace(placeholder, () => original);
                });

                return `${openTag}${parsedContent}${closeTag}`;
            });
        });
        return transformed;
    }

    static processParamFields(content: string): string {
        return content.replace(/<ParamField([^>]*?)>([\s\S]*?)<\/ParamField>/gi, (match, attrs, inner) => {
            const pathMatch = attrs.match(/(?:path|body)=["']([^"']*)["']/i);
            const typeMatch = attrs.match(/type=["']([^"']*)["']/i);
            const required = /required/i.test(attrs);

            const path = pathMatch ? pathMatch[1] : '';
            const type = typeMatch ? typeMatch[1] : '';
            const requiredBadge = required ? ' <span class="required" style="color: #ef4444; font-size: 0.8em; margin-left: 4px; border: 1px solid #fee2e2; padding: 1px 4px; border-radius: 4px; background: #fff1f2;">required</span>' : '';

            return `<div class="param-field" style="margin: 1rem 0; padding: 1rem; border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg-alt); border-radius: 8px;"><div style="font-family: var(--vp-font-family-mono); font-size: 0.9em; margin-bottom: 0.5rem; display: flex; align-items: center; flex-wrap: wrap; gap: 8px;"><span style="color: var(--vp-c-brand); font-weight: 600;">${path}</span><span style="color: var(--vp-c-text-3); font-size: 0.85em;">${type}</span>${requiredBadge}</div><div style="font-size: 0.9em; color: var(--vp-c-text-1); line-height: 1.6;">${inner.trim()}</div></div>`;
        });
    }

    static processAccordions(content: string): string {
        // 移除 AccordionGroup
        let result = content.replace(/<AccordionGroup(\s+[^>]*?)?>([\s\S]*?)<\/AccordionGroup>/g, '$2');
        result = result.replace(/<AccordionGroup\s*(\s+[^>]*?)?\/?>/g, '');

        const convert = (text: string, depth: number = 0): string => {
            let res = text;
            let hasChanges = true;

            // 持续转换直到没有更多的 Accordion 标签
            while (hasChanges) {
                hasChanges = false;
                let pos = 0;

                while (pos < res.length) {
                    const startMatch = res.substring(pos).match(/<Accordion(\s+[^>]*?)?>/);
                    if (!startMatch) break;

                    const startPos = pos + startMatch.index!;
                    const attrs = startMatch[1];
                    const tagEnd = startPos + startMatch[0].length;

                    let level = 1;
                    let endPos = tagEnd;

                    while (level > 0 && endPos < res.length) {
                        const nextOpen = res.indexOf('<Accordion', endPos);
                        const nextClose = res.indexOf('</Accordion>', endPos);

                        if (nextClose === -1) break;

                        if (nextOpen !== -1 && nextOpen < nextClose) {
                            level++;
                            endPos = nextOpen + '<Accordion'.length;
                        } else {
                            level--;
                            if (level === 0) {
                                endPos = nextClose;
                            } else {
                                endPos = nextClose + '</Accordion>'.length;
                            }
                        }
                    }

                    if (level !== 0) {
                        pos = tagEnd;
                        continue;
                    }

                    const innerContent = res.substring(tagEnd, endPos);
                    let titleMatch = attrs.match(/title="([^"]*)"/);
                    if (!titleMatch) {
                        titleMatch = attrs.match(/title='([^']*)'/);
                    }
                    const title = titleMatch ? titleMatch[1] : 'Details';

                    const iconMatch = attrs.match(/icon="([^"]*)"/) || attrs.match(/icon='([^']*)'/);
                    const icon = iconMatch ? iconMatch[1] : '';
                    const displayTitle = icon ? `<Icon icon="${icon}" style="margin-right: 8px; vertical-align: middle;" /> ${title}` : title;

                    // 递归处理内部内容
                    const processedContent = convert(innerContent, depth + 1);
                    const colons = depth === 0 ? '::::' : ':::';

                    const lines = processedContent.split('\n');
                    const nonContentLines = lines.filter(line => line.trim() !== '');
                    let minIndent = Infinity;
                    if (nonContentLines.length > 0) {
                        nonContentLines.forEach(line => {
                            const match = line.match(/^\s*/);
                            const indent = match ? match[0].length : 0;
                            if (indent < minIndent) minIndent = indent;
                        });
                    } else {
                        minIndent = 0;
                    }

                    const cleanedLines = lines.map(line => {
                        if (line.trim() === '') return '';

                        const indentToStrip = minIndent === Infinity ? 0 : minIndent;

                        // 1. 如果匹配公共缩进，则剥离
                        if (indentToStrip > 0 && line.startsWith(' '.repeat(indentToStrip))) {
                            return line.substring(indentToStrip);
                        }

                        // 2. 如果公共缩进是 0（可能是被其他处理器提前清理了），
                        // 但该行仍然有前导空格（如普通文本行），则强制左对齐
                        return line.trimStart();
                    });

                    let cleanedContent = cleanedLines.join('\n');
                    cleanedContent = cleanedContent.replace(/```\n+(```)/g, '```\n\n$1');

                    const replacement = `\n${colons} details ${displayTitle}\n\n${cleanedContent}\n\n${colons}\n`;
                    res = res.substring(0, startPos) + replacement + res.substring(endPos + '</Accordion>'.length);

                    // 标记有变化，需要再次扫描
                    hasChanges = true;
                    // 从替换后的位置继续，但要重新开始扫描以处理可能的外层 Accordion
                    break;
                }
            }

            return res;
        };

        const finalResult = convert(result);

        // 最后进行一次全局清理，确保所有嵌套或残留的 AccordionGroup 均被移除
        return finalResult
            .replace(/<AccordionGroup(\s+[^>]*?)?>/gi, '')
            .replace(/<\/AccordionGroup>/gi, '')
            .replace(/<AccordionGroup\s*(\s+[^>]*?)?\/?>/gi, '');
    }

    /**
     * 将 HTML <details> 标签转换为 VitePress 的 ::: details 语法
     * 同时会自动剥离内部可选的 <div> 包裹层
     */
    static processDetailsTag(content: string): string {
        let transformed = content;

        // 匹配 <details> ... <summary>Title</summary> ... </details>
        // group 1: title
        // group 2: inner content
        const regex = /<details[^>]*>\s*<summary>(.*?)<\/summary>([\s\S]*?)<\/details>/gi;

        transformed = transformed.replace(regex, (match, title, innerContent) => {
            let processedInner = innerContent.trim();

            // 如果内容被 div 包裹，剥离它
            // 仅处理最简单的包裹情况 <div>...</div>
            // 使用正则允许 div 前后有空白
            const divWrapperRegex = /^\s*<div[^>]*>([\s\S]*?)<\/div>\s*$/i;
            const divMatch = processedInner.match(divWrapperRegex);

            if (divMatch) {
                processedInner = divMatch[1].trim();
            }

            return `\n::: details ${title.trim()}\n${processedInner}\n:::\n`;
        });

        return transformed;
    }

    static processNestedComponents(content: string): string {
        const inlineComponents = ['Tooltip', 'Icon', 'a'];

        const process = (text: string): string => {
            const componentTagRegex = /<([A-Z][a-zA-Z0-9]*|\w+-\w+|div)([^>]*?)>([\s\S]*?)<\/\1>/g;

            return text.replace(componentTagRegex, (match, tagName, props, inner) => {
                const isInline = inlineComponents.includes(tagName);

                if (/^[A-Z]/.test(tagName) || tagName.includes('-') || (tagName === 'div' && props.trim().length > 0)) {
                    if (isInline) {
                        const cleanedInner = process(inner).trim();
                        return `<${tagName}${props}>${cleanedInner}</${tagName}>`;
                    } else {
                        const lines = inner.split('\n');

                        // 找到第一个非空行来确定基准缩进
                        let baseIndent = 0;
                        for (const line of lines) {
                            if (line.trim().length > 0) {
                                const match = line.match(/^\s*/);
                                baseIndent = match ? match[0].length : 0;
                                break;
                            }
                        }

                        // 剥离每一行的基准缩进
                        const cleanedInner = lines
                            .map(line => {
                                if (line.trim().length === 0) return '';
                                // 仅移除 baseIndent 长度的空格，绝不做 trimStart
                                if (line.startsWith(' '.repeat(baseIndent))) {
                                    return line.substring(baseIndent);
                                }
                                return line.trimStart();
                            })
                            .join('\n');

                        const processedInner = process(cleanedInner);

                        // 确保组件标签与内容之间有适当的空隔，但不应过于夸张以致破坏容器语法
                        return `\n<${tagName}${props}>\n${processedInner}\n</${tagName}>\n`;
                    }
                }
                return match;
            });
        };

        return process(content);
    }
}
