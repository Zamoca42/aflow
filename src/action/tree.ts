import { TreeViewElement } from "@/component/tree-view-api";
import { GitTreeItem } from "@/type";
export class TreeBuilder {
  private map = new Map<string, TreeViewElement>();

  constructor(private readonly tree: GitTreeItem[]) {}

  private createTreeElement(item: GitTreeItem): TreeViewElement {
    return {
      id: item.path,
      name: item.path.split("/").pop() || "",
      isSelectable: true,
      children: item.type === "tree" ? [] : undefined,
    };
  }

  private addElementToTree(item: GitTreeItem, root: TreeViewElement[]): void {
    const element = this.createTreeElement(item);
    this.map.set(item.path, element);

    const parentPath = item.path.split("/").slice(0, -1).join("/");
    const parent = parentPath ? this.map.get(parentPath) : null;

    if (parent) {
      parent.children = parent.children || [];
      parent.children.push(element);
    } else {
      root.push(element);
    }
  }

  private sortTreeElements(a: TreeViewElement, b: TreeViewElement): number {
    if (a.children && !b.children) return -1;
    if (!a.children && b.children) return 1;
    return a.name.localeCompare(b.name, undefined, {
      numeric: true,
      sensitivity: "base",
    });
  }

  private sortTree(nodes: TreeViewElement[]): void {
    nodes.sort(this.sortTreeElements);
    nodes.forEach(node => {
      if (node.children) {
        this.sortTree(node.children);
      }
    });
  }

  build(): TreeViewElement[] {
    const root: TreeViewElement[] = [];
    this.tree.forEach(item => this.addElementToTree(item, root));
    this.sortTree(root);
    return root;
  }
}