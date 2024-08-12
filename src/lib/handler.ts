import { getRepoTree } from "@/lib/github";
import { buildTreeStructure } from "@/lib/converter";
import { TreeViewElement } from "@/component/tree-view-api";
import { serialize } from "@/lib/serializer";

export const getCompressedContext = async (
  repoName: string,
  treeStructure: TreeViewElement[]
): Promise<string | null> => {
  if (!treeStructure) {
    console.warn(`Empty tree data for repository: ${repoName}`);
    return null;
  }

  const compressedContext = serialize({
    repoName,
    elements: treeStructure,
  });

  if (compressedContext === null) {
    console.warn(`Failed to compress tree data for repository: ${repoName}`);
    return null;
  }

  return compressedContext;
};

export const getTreeStructure = async (
  name: string,
  branch: string
): Promise<TreeViewElement[]> => {
  const tree = await getRepoTree(name, branch);
  return buildTreeStructure(tree);
}
