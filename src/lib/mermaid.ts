import { Architecture } from "@/lib/schema";

const sanitizeId = (str: string): string => {
  return str
    .replace(/\s+/g, '') // 공백 제거
    .replace(/[^a-zA-Z0-9]/g, ''); // 특수문자 제거
};

export function convertToMermaid(architecture: Architecture): string {
  const mermaidCode = [`flowchart TD`];

  Object.entries(architecture.nodes).forEach(([groupId, node]) => {
    const sanitizedGroupId = sanitizeId(groupId);

    mermaidCode.push(`  subgraph ${sanitizedGroupId}["${node.title}"]`);
    node.items.forEach((item) => {
      mermaidCode.push(`    ${sanitizeId(item)}["${item}"]`);
    });
    mermaidCode.push("  end\n");
  });

  architecture.flows.forEach(({ source, target }) => {
    const sanitizedSource = sanitizeId(source);
    const sanitizedTarget = sanitizeId(target);
    mermaidCode.push(`  ${sanitizedSource} --> ${sanitizedTarget}`);
  })

  return mermaidCode.join("\n");
}
