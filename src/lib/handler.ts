import { getRepoTree } from "@/lib/github";
import { buildTreeStructure, convertToTreeViewElement } from "@/lib/converter";
import { TreeViewElement } from "@/component/tree-view-api";

export const getCompressedContext = async (
  repoName: string,
  defaultBranch: string
): Promise<string | null> => {
  const treeData = await getRepoTree(repoName, defaultBranch);
  if (!treeData || !treeData.tree) {
    console.warn(`Empty tree data for repository: ${repoName}`);
    return null;
  }

  const compressedContext = convertToTreeViewElement(
    repoName,
    defaultBranch,
    treeData.tree
  );

  if (compressedContext === null) {
    console.warn(`Failed to compress tree data for repository: ${repoName}`);
    return null;
  }

  return compressedContext;
};

export async function getTreeData(
  name: string,
  branch: string
): Promise<TreeViewElement[]> {
  const treeData = await getRepoTree(name, branch);
  return buildTreeStructure(treeData.tree);
}