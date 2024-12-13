import { Architecture } from "@/type";


export function convertToMermaid(architecture: Architecture): string {
  const mermaidCode = [`flowchart TD`];

  architecture.nodes.forEach((node, groupIndex) => {
    const groupId = `group_${groupIndex}_${node.title.replace(/\s+/g, '_')}`;
    
    mermaidCode.push(`  subgraph ${groupId}["${node.title}"]`);
    node.items.forEach((item, itemIndex) => {
      const nodeId = `node_${groupIndex}_${itemIndex}`;
      mermaidCode.push(`    ${nodeId}["${item}"]`);
    });
    mermaidCode.push("  end");
  });

  architecture.flows.forEach((flow) => {
    const [source, target] = flow.split("->");
    const sourceId = findNodeId(architecture, source.trim());
    const targetId = findNodeId(architecture, target.trim());
    if (sourceId && targetId) {
      mermaidCode.push(`  ${sourceId} --> ${targetId}`);
    }
  });

  return mermaidCode.join("\n");
}

function findNodeId(architecture: Architecture, itemName: string): string | null {
  for (let groupIndex = 0; groupIndex < architecture.nodes.length; groupIndex++) {
    const node = architecture.nodes[groupIndex];
    const itemIndex = node.items.findIndex(item => item === itemName);
    
    if (itemIndex !== -1) {
      return `node_${groupIndex}_${itemIndex}`;
    }
  }
  return null;
}