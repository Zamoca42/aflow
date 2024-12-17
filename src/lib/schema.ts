import { TreeViewElement } from "@/component/tree-view-api";
import { z } from "zod";
import { PROMPT } from "@/lib/constant";

export const urlSafeBase64Pattern = /^[A-Za-z0-9_-]*$/;

export const TreeViewElementSchema: z.ZodType<TreeViewElement> = z.lazy(() =>
  z.object({
    id: z.string(),
    name: z.string(),
    isSelectable: z.boolean(),
    children: z.array(TreeViewElementSchema).optional(),
  })
);

export const TreeStructureSchema = z.array(TreeViewElementSchema);

export const NodeSchema = z.object({
  title: z.string().min(1).describe(PROMPT.schemaDescription.nodes.title),
  items: z.array(z.string()).describe(PROMPT.schemaDescription.nodes.items)
});

export const ArchitectureSchema = z.object({
  title: z.string().min(1).describe(PROMPT.schemaDescription.title),
  nodes: z.array(NodeSchema).describe(PROMPT.schemaDescription.nodes.description),
  flows: z.array(z.object({
    source: z.string(),
    target: z.string()
  })).min(1).describe(PROMPT.schemaDescription.flows)
});

export type Architecture = z.infer<typeof ArchitectureSchema>;
