
import { LINK_MAPS } from '../links.js';

export class LinkProcessor {
    static processImages(content: string): string {
        let transformed = content;

        // 1. 处理包裹在居中 div 中的图片（JSX 样式转标准 HTML）
        // 匹配: <div style={{ display: "flex", justifyContent: "center" }}> ... <img ... /> ... </div>
        transformed = transformed.replace(
            /<div\s+style=\{\{\s*display:\s*["']flex["'],\s*justifyContent:\s*["']center["']\s*\}\}>([\s\S]*?)<\/div>/g,
            (match, innerContent) => {
                // 在 div 内查找 img 标签（支持多行）
                const imgMatch = innerContent.match(/<img[\s\S]*?\/>/);
                if (imgMatch) {
                    const imgTag = imgMatch[0];
                    let srcMatch = imgTag.match(/src=["']([^"']*)["']/);
                    let altMatch = imgTag.match(/alt=["']([^"']*)["']/);
                    let src = srcMatch ? srcMatch[1] : '';
                    let alt = altMatch ? altMatch[1] : '';

                    // 确保路径正确
                    if (src && !src.startsWith('http') && !src.startsWith('/')) {
                        src = `/${src}`;
                    }

                    // 返回标准 HTML 结构（保持居中）
                    return `<div style="display: flex; justify-content: center;">\n  <img src="${src}" alt="${alt}" />\n</div>`;
                }
                return match;
            }
        );

        // 2. 为没有 div 包裹的独立 <img /> 标签添加居中容器
        // 使用占位符保护机制
        const protectedDivs: string[] = [];

        // 先保护所有 div 块
        transformed = transformed.replace(/<div[^>]*>([\s\S]*?)<\/div>/g, (match) => {
            const placeholder = `__PROTECTED_DIV_${protectedDivs.length}__`;
            protectedDivs.push(match);
            return placeholder;
        });

        // 现在处理所有剩余的（未被保护的）img 标签
        transformed = transformed.replace(/<img\s+([^>]*?)\s*\/?>/g, (match, attrs) => {
            let srcMatch = attrs.match(/src=["']([^"']*)["']/);
            let altMatch = attrs.match(/alt=["']([^"']*)["']/);
            let src = srcMatch ? srcMatch[1] : '';
            let alt = altMatch ? altMatch[1] : '';

            // 确保路径正确
            if (src && !src.startsWith('http') && !src.startsWith('/')) {
                src = `/${src}`;
            }

            // 包裹在居中的 div 中
            return `<div style="display: flex; justify-content: center;">\n  <img src="${src}" alt="${alt}" />\n</div>`;
        });

        // 还原被保护的 div
        protectedDivs.forEach((original, i) => {
            const placeholder = `__PROTECTED_DIV_${i}__`;
            transformed = transformed.replace(placeholder, original);
        });

        // 3. 处理 Markdown 原生图片语法，确保路径正确
        transformed = transformed.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
            if (src && !src.startsWith('http') && !src.startsWith('/')) {
                return `![${alt}](/${src})`;
            }
            return match;
        });

        return transformed;
    }

    static processApiLinks(content: string, targetLang: string): string {
        // 匹配 @[`text`] 或 @[text] 或 @[`text`][symbol] 或 @[text][symbol]
        const regex = /@\[(?:`)?([^`\]]+)(?:`)?\](?:\[(.*?)\])?/g;

        return content.replace(regex, (match, text, refSymbol) => {
            const lang = targetLang === 'javascript' ? 'js' : 'python';
            const maps = LINK_MAPS[lang] || {};

            // 优先使用引用 ID，如果没有则使用文本内容
            const symbol = refSymbol || text;

            // 尝试匹配
            let url = maps[symbol];

            // 如果没匹配到，尝试去掉括号匹配
            if (!url) {
                const cleanSymbol = symbol.replace(/\(\)$/, '');
                url = maps[cleanSymbol];
            }

            if (url) {
                const display = match.includes('`') ? `<code>${text}</code>` : text;
                return `<a href="${url}" target="_blank" rel="noreferrer" class="link">${display}</a>`;
            }

            return match;
        });
    }

    static processMarkdownLinks(content: string): string {
        // 仅在非图片的情况下将 Markdown 链接转 HTML
        // 注意：VitePress 实际上能处理 Markdown 链接，这里如果我们一定要转 HTML，需要避开 ![]()
        return content.replace(/(?<!\!)\[([^\]]+)\]\(([^\s\)]+)\)/g, '<a href="$2">$1</a>');
    }
}
