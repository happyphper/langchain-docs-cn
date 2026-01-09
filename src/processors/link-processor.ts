
import { LINK_MAPS } from '../links.js';

export class LinkProcessor {
    static processImages(content: string, filePath: string = ''): string {
        let transformed = content;

        // 获取当前文件的目录路径 (假设 filePath 是相对于根目录的，如 'langsmith/guide.md')
        // 如果 filePath 为空，则无法正确计算相对路径，只能回退到简单处理
        const fileDir = filePath ? filePath.split('/').slice(0, -1).join('/') : '';

        const resolvePath = (src: string) => {
            if (!src) return src;
            if (src.startsWith('http') || src.startsWith('/') || src.startsWith('data:')) return src;

            // 处理相对路径
            let cleanSrc = src;
            if (cleanSrc.startsWith('./')) {
                cleanSrc = cleanSrc.substring(2);
            }

            // 如果有文件上下文，拼接成绝对路径
            if (fileDir) {
                // 简单的路径拼接，不使用 path 模块以避免引入 Node.js 依赖（如果这是一个纯前端通用库的话，也就是为了保险）
                // 处理 ../ 的情况比较复杂，这里暂时假设结构比较简单，或者直接拼接
                // 但为了健壮性，我们可以处理简单的 ../
                // 这里我们生成以 / 开头的绝对路径，指向 public 目录中的资源
                return `/${fileDir}/${cleanSrc}`.replace(/\/+/g, '/'); // 替换多余的 //
            }

            // 如果没有上下文，只能回退到之前的行为（或者就保持相对路径）
            // 之前的行为是直接加 /，导致了 /./ 问题。现在至少去掉 ./
            return `/${cleanSrc}`;
        };

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

            src = resolvePath(src);

            // 返回标准的 img 标签，不带外层 div
            return `<img src="${src}" alt="${alt}" />`;
        });

        // 3. 处理 Markdown 原生图片语法 ![]()，确保路径正确
        transformed = transformed.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
            // 移除 data: 协议的图片，防止构建错误（通常是超长 Base64 导致的解析问题）
            if (src.trim().startsWith('data:')) {
                return alt;
            }

            const newSrc = resolvePath(src);
            if (newSrc !== src) {
                return `![${alt}](${newSrc})`;
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
