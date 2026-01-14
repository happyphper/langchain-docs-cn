
import { LINK_MAPS } from '../links.js';

export class LinkProcessor {
    static processImages(content: string, filePath: string = ''): string {
        let transformed = content;

        // 获取当前文件的目录路径 (假设 filePath 是相对于根目录的，如 'langsmith/guide.md')
        // 如果 filePath 为空，则无法正确计算相对路径，只能回退到简单处理
        const fileDir = filePath ? filePath.split('/').slice(0, -1).join('/') : '';

        const resolvePath = (src: string) => {
            if (!src) return src;
            if (src.startsWith('http') || src.startsWith('data:')) return src;

            let cleanSrc = src;

            // 【核心修复】由于静态资源中移除了语言标识（如 /python/images -> /images），
            // 这里也需要强制统一路径，移除 URL 中的 /python/ 或 /javascript/。
            if (cleanSrc.includes('images/')) {
                cleanSrc = cleanSrc.replace(/(python|javascript)\/images\//g, 'images/');
            }

            if (cleanSrc.startsWith('/')) {
                return cleanSrc;
            }

            // 处理相对路径
            if (cleanSrc.startsWith('./')) {
                cleanSrc = cleanSrc.substring(2);
            }

            // 如果有文件上下文，拼接成绝对路径
            if (fileDir) {
                return `/${fileDir}/${cleanSrc}`.replace(/\/+/g, '/');
            }

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

    /**
     * 处理内部链接，根据语言版本自动调整路径
     * 例如：/oss/langchain/install -> /oss/python/langchain/install 或 /oss/javascript/langchain/install
     */
    static processInternalLinks(content: string, targetLang: string): string {
        if (targetLang === 'all') {
            // langsmith 文档不需要处理
            return content;
        }

        const langDir = targetLang === 'javascript' ? 'javascript' : 'python';

        // 匹配 Markdown 链接 [text](/oss/...)
        return content.replace(/\[([^\]]+)\]\((\/oss\/[^\)]+)\)/g, (match, text, url) => {
            // 检查 URL 是否已经包含语言目录
            if (url.includes('/oss/python/') || url.includes('/oss/javascript/')) {
                // 已经有语言目录，不需要修改
                return match;
            }

            // 检查是否是 /oss/langchain/ 或 /oss/langgraph/ 等路径
            const ossPattern = /^\/oss\/([^\/]+)\//;
            const ossMatch = url.match(ossPattern);

            if (ossMatch) {
                const component = ossMatch[1]; // langchain, langgraph 等

                // 在 oss/ 和 component/ 之间插入语言目录
                const newUrl = url.replace(/^\/oss\//, `/oss/${langDir}/`);
                return `[${text}](${newUrl})`;
            }

            // 其他情况保持不变
            return match;
        });
    }
}
