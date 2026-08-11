export interface TreeNode<T> {
  id: string;
  children?: T[];
}

export function findTreeNode<T extends TreeNode<T>>(nodes: T[], id: string): T | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    const child = node.children ? findTreeNode(node.children, id) : null;
    if (child) return child;
  }
  return null;
}
