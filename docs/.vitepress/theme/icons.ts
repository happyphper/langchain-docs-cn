
export const resolveIcon = (name: string) => {
  if (!name) return '';
  const n = name.toLowerCase();
  const brandIcons = ['slack', 'github', 'python', 'js', 'javascript', 'typescript', 'node'];
  if (brandIcons.includes(n)) return ['fab', n === 'js' ? 'js' : n];
  const mapping: Record<string, string> = {
    'python': 'python',
    'js': 'js',
    'typescript': 'js',
    'link': 'link',
    'circle-nodes': 'circle-nodes',
    'robot': 'robot',
    'headset': 'headset',
    'user-headset': 'headset',
    'messages': 'message',
    'rocket-launch': 'rocket',
    'gear': 'gear',
    'screwdriver-wrench': 'screwdriver-wrench'
  };
  const iconName = mapping[n] || n;
  return ['fas', iconName];
};
