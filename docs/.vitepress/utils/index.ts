export function generateSidebarMap(sidebars: any[]) {
    const map: Record<string, any[]> = {};
    for (const sidebar of sidebars) {
        const traverse = (items: any[]) => {
            for (const item of items) {
                if (item.link && item.link.startsWith('/')) {
                    map[item.link] = sidebar;
                }
                if (item.items) {
                    traverse(item.items);
                }
            }
        };
        traverse(sidebar);
    }
    return map;
}
