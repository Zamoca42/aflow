import { TreeViewElement } from "@/component/tree-view-api";

export class MarkdownTreeGenerator {
  private showIcons: boolean;
  private showFiles: boolean;
  private tree: TreeViewElement[];
  private prefixCache: Map<string, { current: string; next: string }>;
  private stringBuilder: string[];
  
  constructor(tree: TreeViewElement[], showIcons: boolean = true, showFiles: boolean = true) {
    this.tree = tree;
    this.showIcons = showIcons;
    this.showFiles = showFiles;
    this.prefixCache = new Map();
    this.stringBuilder = [];
  }

  private getIcons() {
    const icons = {
      folder: this.showIcons ? "📁 " : "",
      file: this.showIcons ? "📄 " : ""
    };
    return icons;
  }

  private isValidTree(): boolean {
    return !!(this.tree && Array.isArray(this.tree) && this.tree.length > 0);
  }

  private getCachedPrefix(isLast: boolean): { current: string; next: string } {
    const key = isLast.toString();
    if (!this.prefixCache.has(key)) {
      this.prefixCache.set(key, {
        current: isLast ? "└─ " : "├─ ",
        next: isLast ? "    " : "│   "
      });
    }
    return this.prefixCache.get(key)!;
  }

  private appendNode(
    item: TreeViewElement, 
    prefix: string, 
    isLast: boolean,
    icons: { folder: string; file: string }
  ): void {
    const { current: currentPrefix } = this.getCachedPrefix(isLast);
    const icon = item.children ? icons.folder : icons.file;
    this.stringBuilder.push(prefix, currentPrefix, icon, item.name, "\n");
  }

  private generateTreeStructure(
    elements: TreeViewElement[],
    prefix: string = ""
  ): void {
    const icons = this.getIcons();
    const visibleItems = this.showFiles 
      ? elements 
      : elements.filter(item => item.children);
    const length = visibleItems.length;

    for (let i = 0; i < length; i++) {
      const item = visibleItems[i];
      const isLast = i === length - 1;
      
      this.appendNode(item, prefix, isLast, icons);
      
      if (item.children) {
        const { next: nextPrefix } = this.getCachedPrefix(isLast);
        this.generateTreeStructure(item.children, prefix + nextPrefix);
      }
    }
  }

  public generate(): string {
    if (!this.isValidTree()) return "";
    
    this.stringBuilder = [];
    this.generateTreeStructure(this.tree);
    return this.stringBuilder.join("");
  }
}