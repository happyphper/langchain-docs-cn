
import matter from 'gray-matter';
import { CodeProcessor } from '../processors/code-processor.js';
import { ComponentProcessor } from '../processors/component-processor.js';
import { LinkProcessor } from '../processors/link-processor.js';
import { SyntaxProcessor } from '../processors/syntax-processor.js';

export class MdxTransformer {
    static transform(content: string, targetLang: string): string {
        const { data, content: body } = matter(content);
        let transformedBody = body;

        // 【核心修复】全局代码块保护
        const codeBlocks: string[] = [];
        const codeBlockPlaceholder = (match: string) => {
            const placeholder = `__PROTECTED_CODE_BLOCK_${codeBlocks.length}__`;
            codeBlocks.push(match);
            return placeholder;
        };

        // 提取所有代码块 (支持各种反引号数量)
        transformedBody = transformedBody.replace(/(^|\n)([ \t]*)(`{3,})([\s\S]*?)\n\s*\3/g, codeBlockPlaceholder);

        // 1. 处理自定义语言块 :::python 和 :::js (由于这些块内部也可能有代码块，建议在此之前处理，或者也要保护)
        // 注意：:::lang 语法在解包后，内部的代码块需要二次保护，
        // 或者我们直接在解包前处理。
        transformedBody = CodeProcessor.processLanguageBlocks(transformedBody, targetLang);

        // 由于解包后可能新露出了代码块，再次保护
        transformedBody = transformedBody.replace(/(^|\n)([ \t]*)(`{3,})([\s\S]*?)\n\s*\3/g, codeBlockPlaceholder);

        // 2. 处理组件 (这里会处理 Step 等)
        transformedBody = ComponentProcessor.processStepComponent(transformedBody);

        // 3. 移除注释
        transformedBody = transformedBody.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');

        // 4. Snippet Imports
        const snippetImports = new Map<string, string>();
        transformedBody = ComponentProcessor.processSnippetImports(transformedBody, targetLang, snippetImports);

        // 5. 链接与图片 (现在安全了，因为代码块被占位符替代了)
        transformedBody = LinkProcessor.processImages(transformedBody);
        transformedBody = LinkProcessor.processApiLinks(transformedBody, targetLang);

        // 6. 语法处理
        transformedBody = SyntaxProcessor.removeImportsExports(transformedBody);
        transformedBody = SyntaxProcessor.processAttributes(transformedBody);

        // 7. 组件内 Markdown
        transformedBody = ComponentProcessor.processMarkdownInsideComponents(transformedBody);

        // 8. 复杂组件结构 (CodeGroup)
        transformedBody = CodeProcessor.processCodeGroup(transformedBody);

        // 9. 递归处理组件嵌套
        transformedBody = ComponentProcessor.processNestedComponents(transformedBody);

        // 10. Accordions
        transformedBody = ComponentProcessor.processAccordions(transformedBody);

        // 11. 清理残留标签
        transformedBody = transformedBody.replace(/<AccordionGroup(\s+[^>]*?)?>([\s\S]*?)<\/AccordionGroup>/g, '$2');
        transformedBody = transformedBody.replace(/<AccordionGroup\s*(\s+[^>]*?)?\/?>/g, '');
        transformedBody = transformedBody.replace(/<\/AccordionGroup>/g, '');
        transformedBody = transformedBody.replace(/<Accordion(\s+[^>]*?)?>/g, '');
        transformedBody = transformedBody.replace(/<\/Accordion>/g, '');

        // 12. 统一还原并处理代码块
        codeBlocks.forEach((original, i) => {
            const placeholder = `__PROTECTED_CODE_BLOCK_${i}__`;

            // 在还原前，对原始代码内容执行必要的内部清理 (如缩进)
            let processedCode = original;
            processedCode = CodeProcessor.processCodeBlockTitles(processedCode);
            processedCode = CodeProcessor.cleanupCodeBlockIndent(processedCode);

            transformedBody = transformedBody.replace(placeholder, () => processedCode);
        });

        // 修复 Icon 换行
        transformedBody = transformedBody.replace(/^([\s-]*[\*\-]\s*)\n+(<Icon)/gm, '$1$2');

        // 清理多余空行
        transformedBody = transformedBody.replace(/\n{3,}/g, '\n\n');

        // 确保代码块间距
        transformedBody = CodeProcessor.ensureCodeBlockSpacing(transformedBody);

        return matter.stringify(transformedBody, data);
    }
}
