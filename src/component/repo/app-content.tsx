"use client";

import { RepoContentMenu } from "@/component/repo/content-menu";
import { TreeView } from "@/component/repo/app-tree-view";
import { TreeViewElement } from "@/component/tree-view-api";
import { VisualizeTab } from "@/component/ai/visualize-tab";
import { useVisualize } from "@/context/visualizer";
import { Loader2Icon } from "lucide-react";
import { useEffect } from "react";

interface RepoContentProps {
  repoName: string;
  structuredRepoTree: TreeViewElement[];
}

export function AppRepoContent({
  repoName,
  structuredRepoTree,
}: RepoContentProps) {
  const {
    isVisualizerActive,
    isLoading,
    isCached,
    generation,
    markdownTree,
    setStructuredRepoTree,
  } = useVisualize();

  useEffect(() => {
    setStructuredRepoTree(structuredRepoTree);
  }, [structuredRepoTree, setStructuredRepoTree]);

  return (
    <>
      <div
        className={`rounded-xl transition-all duration-500 px-4 py-2 ${
          isVisualizerActive
            ? "bg-sidebar/80 min-h-[50vh] active"
            : "bg-transparent h-0 min-h-0 -mt-4"
        }`}
      >
        {isLoading ? (
          <div className="flex justify-center items-center w-full min-h-[50vh]">
            <Loader2Icon className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          isVisualizerActive &&
          generation && (
            <VisualizeTab
              mermaidCode={generation}
              isCached={isCached}
              repoName={repoName}
            />
          )
        )}
      </div>
      <div className="min-h-[50vh] bg-sidebar/80 rounded-xl px-4 py-2">
        <RepoContentMenu
          structuredRepoTree={structuredRepoTree}
          markdownTree={markdownTree || ""}
          repoName={repoName}
        />
        {structuredRepoTree.length > 0 ? (
          <TreeView elements={structuredRepoTree} />
        ) : (
          <div>No data available for {repoName}</div>
        )}
      </div>
    </>
  );
}
