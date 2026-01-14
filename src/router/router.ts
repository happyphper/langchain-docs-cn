import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// 定义接口以匹配 docs.json 的结构
interface MintPageObject {
    group: string;
    pages?: (string | MintPageObject)[];
    groups?: MintPageObject[];
    expanded?: boolean;
}

type MintPage = string | MintPageObject;

interface MintTab {
    tab: string;
    pages?: MintPage[];
    groups?: MintPageObject[];
}

interface MintDropdown {
    dropdown: string;
    tabs: MintTab[];
}

interface MintProduct {
    product: string;
    pages?: MintPage[];
    dropdowns?: MintDropdown[];
    tabs?: MintTab[];
}

interface MintDocsConfig {
    navigation: {
        products: MintProduct[];
    };
}

// VitePress 路由项接口
interface SidebarItem {
    text: string;
    link?: string;
    items?: SidebarItem[];
    collapsed?: boolean;
}

// 翻译字典接口
interface TranslationDict {
    [key: string]: string;
}

// 初始化 OpenAI 客户端
const apiKey = process.env.DEEPSEEK_API_KEY;
let openai: OpenAI | null = null;

if (apiKey) {
    openai = new OpenAI({
        apiKey: apiKey,
        baseURL: 'https://api.deepseek.com/v1/',
    });
}

/**
 * 加载或创建翻译字典
 */
function loadTranslationDict(dictPath: string): TranslationDict {
    if (fs.existsSync(dictPath)) {
        return JSON.parse(fs.readFileSync(dictPath, 'utf8'));
    }
    return {};
}

/**
 * 保存翻译字典
 */
function saveTranslationDict(dictPath: string, dict: TranslationDict): void {
    fs.writeFileSync(dictPath, JSON.stringify(dict, null, 2), 'utf8');
}

/**
 * 从侧边栏项中提取所有需要翻译的文本
 */
function extractTexts(items: SidebarItem[]): Set<string> {
    const texts = new Set<string>();

    function traverse(item: SidebarItem) {
        // 提取所有文本（包括有链接的项）
        if (item.text) {
            texts.add(item.text);
        }
        if (item.items) {
            item.items.forEach(traverse);
        }
    }

    items.forEach(traverse);
    return texts;
}

/**
 * 批量翻译文本
 */
async function translateBatch(texts: string[]): Promise<Record<string, string>> {
    if (!openai) {
        console.warn('⚠️  未设置 DEEPSEEK_API_KEY，跳过翻译');
        return {};
    }

    if (texts.length === 0) {
        return {};
    }

    console.log(`🌐 正在翻译 ${texts.length} 个词条...`);

    // 如果词条太多，分批翻译
    const BATCH_SIZE = 100;
    if (texts.length > BATCH_SIZE) {
        console.log(`📦 词条过多，将分 ${Math.ceil(texts.length / BATCH_SIZE)} 批次翻译`);
        const allTranslations: Record<string, string> = {};

        for (let i = 0; i < texts.length; i += BATCH_SIZE) {
            const batch = texts.slice(i, i + BATCH_SIZE);
            console.log(`   批次 ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(texts.length / BATCH_SIZE)}: ${batch.length} 个词条`);
            const batchTranslations = await translateBatch(batch);
            Object.assign(allTranslations, batchTranslations);

            // 批次间延迟，避免 API 限流
            if (i + BATCH_SIZE < texts.length) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        return allTranslations;
    }

    try {
        // 构建翻译请求
        const prompt = `请将以下英文技术术语翻译为中文。这些是文档导航菜单中的标题。
要求：
1. 保持专业性和准确性
2. 对于常见技术术语，使用业界通用的中文翻译
3. **对于重要的技术术语，必须在中文翻译后用括号附上英文原文**，格式如："智能体（Agent）"、"中间件（Middleware）"、"评估（Evaluation）"
4. 需要添加英文原文的关键术语包括但不限于：Agent、Agents、Middleware、Evaluation、Observability、Deployment、Streaming、Multi-agent、Subagents、Handoffs、Router、Guardrails、Retrieval、Memory、Graph、Functional、Integrations、Tutorials、Migration、Policies 等核心技术概念
5. 对于简单的通用词汇（如：overview、install、quickstart、custom、built-in 等）不需要添加英文原文
6. 返回 JSON 格式，key 为英文，value 为中文翻译（含英文原文）
7. 只返回 JSON 对象，不要用 markdown 代码块包裹

需要翻译的词条：
${JSON.stringify(texts, null, 2)}`;

        const response = await openai.chat.completions.create({
            model: 'deepseek-chat',
            messages: [
                {
                    role: 'system',
                    content: '你是一个专业的技术文档翻译专家，擅长翻译软件开发相关的技术术语。请直接返回 JSON 对象，不要使用 markdown 代码块。'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.1,
        });

        const content = response.choices[0].message?.content || '{}';

        // 改进的 JSON 提取逻辑
        let jsonStr = content.trim();

        // 移除可能的 markdown 代码块标记
        jsonStr = jsonStr.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/\s*```$/, '');

        // 提取 JSON 对象
        const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }

        return JSON.parse(jsonStr);
    } catch (error) {
        console.error('❌ 翻译失败:', error);
        return {};
    }
}

/**
 * 翻译侧边栏项
 */
function translateSidebarItems(items: SidebarItem[], dict: TranslationDict): SidebarItem[] {
    return items.map(item => {
        const newItem: SidebarItem = { ...item };

        // 翻译文本（如果在字典中存在）
        if (newItem.text && dict[newItem.text]) {
            newItem.text = dict[newItem.text];
        }

        // 递归翻译子项
        if (newItem.items) {
            newItem.items = translateSidebarItems(newItem.items, dict);
        }

        return newItem;
    });
}

/**
 * 转换 Mintlify 的页面配置为 VitePress 的侧边栏项
 */
function convertPages(pages?: MintPage[]): SidebarItem[] {
    if (!pages) return [];

    return pages.map(page => {
        if (typeof page === 'string') {
            const link = page.startsWith('/') ? page : `/${page}`;
            const segments = page.split('/');
            const text = segments[segments.length - 1];
            return { text, link };
        } else {
            const subItems = [
                ...(page.pages ? convertPages(page.pages) : []),
                ...(page.groups ? convertPages(page.groups as any) : [])
            ];

            return {
                text: page.group,
                collapsed: page.expanded === false,
                items: subItems.length > 0 ? subItems : undefined
            };
        }
    });
}

/**
 * 生成侧边栏文件内容
 */
function generateSidebarFileContent(varName: string, items: SidebarItem[], useLanguageUtils: boolean = true): string {
    const itemsJson = JSON.stringify(items, null, 4);

    if (useLanguageUtils) {
        return `import { createLanguageSidebars } from './sidebar_utils';

// ${varName} 侧边栏模板
const template = ${itemsJson};

// 生成 Python 和 JavaScript 两个版本
const sidebars = createLanguageSidebars(template);

export const sidebar${varName}Python = sidebars.python;
export const sidebar${varName}JS = sidebars.javascript;
`;
    } else {
        return `// ${varName} 侧边栏配置
export const ${varName} = ${itemsJson};
`;
    }
}

/**
 * 主运行函数
 */
async function main() {
    const docsJsonPath = path.join(process.cwd(), 'langchain-ai-docs/src/docs.json');
    const targetDir = path.join(process.cwd(), 'docs/.vitepress/routes');
    const dictPath = path.join(process.cwd(), 'cn-docs/routes-cn.json');

    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }

    if (!fs.existsSync(docsJsonPath)) {
        console.error(`Error: ${docsJsonPath} not found.`);
        return;
    }

    const config: MintDocsConfig = JSON.parse(fs.readFileSync(docsJsonPath, 'utf8'));

    // 加载现有翻译字典
    const translationDict = loadTranslationDict(dictPath);
    console.log(`📖 已加载 ${Object.keys(translationDict).length} 条翻译记录`);

    // 为特定的 tab 定义输出文件名和导出变量名映射
    const tabMapping: Record<string, { fileName: string; varName: string; useUtils: boolean }> = {
        'LangChain': { fileName: 'sidebar_langchain.ts', varName: 'LangChain', useUtils: true },
        'LangGraph': { fileName: 'sidebar_langgraph.ts', varName: 'LangGraph', useUtils: true },
        'Deep Agents': { fileName: 'sidebar_deepagents.ts', varName: 'DeepAgents', useUtils: true },
        'Integrations': { fileName: 'sidebar_integrations.ts', varName: 'Integrations', useUtils: true },
        'Learn': { fileName: 'sidebar_learn.ts', varName: 'Learn', useUtils: true },
        'Reference': { fileName: 'sidebar_reference.ts', varName: 'Reference', useUtils: true },
        'Contribute': { fileName: 'sidebar_contributing.ts', varName: 'Contributing', useUtils: true },

        // LangSmith tabs
        'Get started': { fileName: 'sidebar_ls_get_started.ts', varName: 'lsGetStarted', useUtils: false },
        'Observability': { fileName: 'sidebar_ls_observability.ts', varName: 'lsObservability', useUtils: false },
        'Evaluation': { fileName: 'sidebar_ls_evaluation.ts', varName: 'lsEvaluation', useUtils: false },
        'Prompt engineering': { fileName: 'sidebar_ls_prompt_engineering.ts', varName: 'lsPromptEngineering', useUtils: false },
        'Deployment': { fileName: 'sidebar_ls_deployment.ts', varName: 'lsDeployment', useUtils: false },
        'Platform setup': { fileName: 'sidebar_ls_platform_setup.ts', varName: 'lsPlatformSetup', useUtils: false },
    };

    const products = config.navigation.products;
    const allSidebarItems: Array<{ mapping: typeof tabMapping[string], items: SidebarItem[] }> = [];

    // 第一步：生成所有侧边栏项（英文版）
    for (const product of products) {
        if (product.product === 'LangChain + LangGraph') {
            const pythonDropdown = product.dropdowns?.find(d => d.dropdown === 'Python');
            if (pythonDropdown) {
                for (const tab of pythonDropdown.tabs) {
                    const mapping = tabMapping[tab.tab];
                    if (mapping) {
                        const items = convertPages(tab.pages || (tab.groups as any));
                        allSidebarItems.push({ mapping, items });
                    }
                }
            }
        } else if (product.product === 'LangSmith') {
            const smithTabs = product.tabs || [];
            for (const tab of smithTabs) {
                let mapping = tabMapping[tab.tab];
                if (tab.tab === 'Reference') {
                    mapping = { fileName: 'sidebar_ls_reference.ts', varName: 'lsReference', useUtils: false };
                }

                if (mapping) {
                    const items = convertPages(tab.pages || (tab.groups as any));
                    allSidebarItems.push({ mapping, items });
                }
            }
        } else if (product.product === 'Agent Builder') {
            const items = convertPages(product.pages || (product.groups as any) || []);
            const mapping = { fileName: 'sidebar_ls_agent_builder.ts', varName: 'lsAgentBuilder', useUtils: false };
            allSidebarItems.push({ mapping, items });
        }
    }

    // 第二步：提取所有需要翻译的文本
    const allTexts = new Set<string>();
    allSidebarItems.forEach(({ items }) => {
        const texts = extractTexts(items);
        texts.forEach(t => allTexts.add(t));
    });

    // 第三步：找出未翻译的文本
    const untranslatedTexts = Array.from(allTexts).filter(text => !translationDict[text]);

    if (untranslatedTexts.length > 0) {
        console.log(`🔍 发现 ${untranslatedTexts.length} 个未翻译的词条`);

        if (openai) {
            // 批量翻译
            const newTranslations = await translateBatch(untranslatedTexts);

            // 合并到字典
            Object.assign(translationDict, newTranslations);

            // 保存字典
            saveTranslationDict(dictPath, translationDict);
            console.log(`💾 已保存 ${Object.keys(newTranslations).length} 条新翻译到 ${dictPath}`);
        } else {
            console.warn('⚠️  跳过翻译，未翻译的词条：');
            untranslatedTexts.forEach(text => console.log(`  - ${text}`));
        }
    } else {
        console.log('✅ 所有词条均已翻译');
    }

    // 第四步：生成翻译后的侧边栏文件
    for (const { mapping, items } of allSidebarItems) {
        const translatedItems = translateSidebarItems(items, translationDict);
        const content = generateSidebarFileContent(mapping.varName, translatedItems, mapping.useUtils);
        fs.writeFileSync(path.join(targetDir, mapping.fileName), content);
    }

    console.log(`✨ 路由文件生成成功，保存在 ${targetDir}`);
}

main().catch(err => {
    console.error('Error generating routes:', err);
});