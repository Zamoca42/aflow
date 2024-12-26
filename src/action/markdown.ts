import { TreeViewElement } from "@/component/tree-view-api";

interface TreeGeneratorOptions {
  showIcons?: boolean;
  showFiles?: boolean;
  hideDotFiles?: boolean;
}

export class MarkdownTreeGenerator {
  private showIcons: boolean;
  private showFiles: boolean;
  private hideDotFiles: boolean;
  private tree: TreeViewElement[];
  private prefixCache: Map<string, { current: string; next: string }>;
  private stringBuilder: string[];

  constructor(
    tree: TreeViewElement[],
    options: TreeGeneratorOptions
  ) {
    this.tree = tree;
    this.showIcons = options.showIcons ?? true;
    this.showFiles = options.showFiles ?? true;
    this.hideDotFiles = options.hideDotFiles ?? false;
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

  private isDotFile(name: string): boolean {
    return name.startsWith('.');
  }

  private shouldIncludeItem(item: TreeViewElement): boolean {
    if (!this.showFiles && !item.children) {
      return false;
    }

    if (this.hideDotFiles && this.isDotFile(item.name)) {
      return false;
    }

    return true;
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
    const visibleItems = elements.filter(item => this.shouldIncludeItem(item));
    const length = visibleItems.length;

    for (let i = 0; i < length; i++) {
      const item = visibleItems[i];
      const isLast = i === length - 1;

      this.appendNode(item, prefix, isLast, icons);

      if (item.children) {
        const { next: nextPrefix } = this.getCachedPrefix(isLast);
        const filteredChildren = item.children.filter(child =>
          this.shouldIncludeItem(child)
        );
        if (filteredChildren.length > 0) {
          this.generateTreeStructure(filteredChildren, prefix + nextPrefix);
        }
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