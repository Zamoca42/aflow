import { Architecture } from "@/lib/schema";

const createSanitizedIdCache = () => {
  const idMap = new Map<string, string>();

  return (str: string): string => {
    if (idMap.has(str)) {
      return idMap.get(str)!;
    }

    const newId = str
      .replace(/\s+/g, '')
      .replace(/[^a-zA-Z0-9]/g, '');

    idMap.set(str, newId);
    return newId;
  };
};

export function convertToMermaid(architecture: Architecture): string {
  const generateCacheId = createSanitizedIdCache();
  const mermaidCode: string[] = [`flowchart TD`];

  architecture.nodes.forEach((node) => {
    const nodeId = generateCacheId(node.title);
    mermaidCode.push(`  subgraph ${nodeId}["${node.title}"]`);

    node.items.forEach(item => {
      const itemId = generateCacheId(item);
      if (itemId !== nodeId) {
        mermaidCode.push(`    ${itemId}["${item}"]`);
      }
    });

    mermaidCode.push("  end\n");
  });

  architecture.flows.forEach(({ source, target }) => {
    const sourceId = generateCacheId(source);
    const targetId = generateCacheId(target);
    if (sourceId !== targetId) {
      mermaidCode.push(`  ${sourceId} --> ${targetId}`);
    }
  });

  return mermaidCode.join("\n");
}
