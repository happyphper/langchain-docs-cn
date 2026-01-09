/**
 * 侧边栏路径转换工具
 * 用于根据语言类型(python/javascript)自动转换侧边栏配置中的路径
 */

type SidebarItem = {
    text: string;
    link?: string;
    items?: SidebarItem[];
    collapsed?: boolean;
};

/**
 * 将侧边栏配置中的路径从一种语言转换为另一种语言
 * @param items 侧边栏配置数组
 * @param lang 目标语言 ('python' | 'javascript')
 * @returns 转换后的侧边栏配置
 */
export function convertSidebarPaths(items: SidebarItem[], lang: 'python' | 'javascript'): SidebarItem[] {
    return items.map(item => {
        const newItem: SidebarItem = { ...item };

        // 转换 link 路径
        if (newItem.link) {
            // 将 /oss/python/ 或 /oss/javascript/ 替换为目标语言
            newItem.link = newItem.link.replace(
                /\/oss\/(python|javascript)\//,
                `/oss/${lang}/`
            );
        }

        // 递归处理子项
        if (newItem.items) {
            newItem.items = convertSidebarPaths(newItem.items, lang);
        }

        return newItem;
    });
}

/**
 * 创建基于模板的侧边栏配置生成器
 * @param template 侧边栏模板配置(使用 python 路径)
 * @returns 返回一个对象,包含 python 和 javascript 两个版本的侧边栏配置
 */
export function createLanguageSidebars(template: SidebarItem[]) {
    return {
        python: template,
        javascript: convertSidebarPaths(template, 'javascript')
    };
}
