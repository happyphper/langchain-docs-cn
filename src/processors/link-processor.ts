
import { LINK_MAPS } from '../links.js';

export class LinkProcessor {
    static processImages(content: string): string {
        let transformed = content;

        // 1. 处理居中 div 包裹的图片标签，剥离外层 div
        // 匹配: <div style={{ display: "flex", justifyContent: "center" }}> ... <img ... /> ... </div>
        // 或者: <div style="display: flex; justify-content: center;"> ... <img ... /> ... </div>
        transformed = transformed.replace(
            /<div\s+style=\{?\{?\s*display:\s*["']flex["'],\s*justifyContent:\s*["']center["']\s*\}?\}?>([\s\S]*?)<\/div>/gi,
            (match, innerContent) => {
                const imgMatch = innerContent.match(/<img[\s\S]*?\/>/i);
                return imgMatch ? imgMatch[0] : innerContent;
            }
        );

        // 2. 规范化所有 <img /> 标签的 src 路径
        transformed = transformed.replace(/<img\s+([^>]*?)\s*\/?>/gi, (match, attrs) => {
            let srcMatch = attrs.match(/src=["']([^"']*)["']/i);
            let altMatch = attrs.match(/alt=["']([^"']*)["']/i);
            let src = srcMatch ? srcMatch[1] : '';
            let alt = altMatch ? altMatch[1] : '';

            // 规范化路径：仅处理非 http 开头的本地路径
            if (src && !src.startsWith('http') && !src.startsWith('/')) {
                src = `/${src}`;
            }

            // 返回标准的 img 标签，不带外层 div
            return `<img src="${src}" alt="${alt}" />`;
        });

        // 3. 处理 Markdown 原生图片语法 ![]()，确保路径正确
        transformed = transformed.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
            // 规范化路径：仅处理非 http 开头的本地路径
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
