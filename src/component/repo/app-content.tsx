"use client";

import { useMemo, useState } from "react";
import { RepoHeader } from "./header";
import { RepoContentMenu } from "./content-menu";
import { VisualizeTab } from "./visualize-tab";
import { TreeView } from "@/component/repo/tree-view";
import { TreeViewElement } from "@/component/tree-view-api";
import { Button } from "../ui/button";
import { Loader2Icon, SparklesIcon } from "lucide-react";
import { getArchitecture } from "@/action/ai-visualize";
import { useTreeView } from "@/context/view-filter";
import { MarkdownTreeGenerator } from "@/action/markdown";
import { useRouter } from "next/navigation";
import { convertToMermaid } from "@/lib/mermaid";

interface RepoContentProps {
  repoName: string;
  structuredRepoTree: TreeViewElement[];
}

export function AppRepoContent({
  repoName,
  structuredRepoTree,
}: RepoContentProps) {
  const router = useRouter();
  const [isVisualizerActive, setIsVisualizerActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showIcons, showFiles } = useTreeView();
  const [generation, setGeneration] = useState<string>("");

  const markdownTree = useMemo(
    () =>
      new MarkdownTreeGenerator(
        structuredRepoTree,
        showIcons,
        showFiles
      ).generate(),
    [structuredRepoTree, showIcons, showFiles]
  );

  const handleVisualize = async () => {
    setIsVisualizerActive(true);
    setIsLoading(true);
    try {
      const { architecture } = await getArchitecture(markdownTree);
      const mermaidCode = convertToMermaid(architecture);
      setGeneration(mermaidCode);
    } catch (error) {
      alert("Error during AI visualization");
      setIsVisualizerActive(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex flex-1 items-center gap-2 px-4">
          <RepoHeader />
          <Button
            variant="outline"
            className="p-2 h-7"
            onClick={handleVisualize}
          >
            {isLoading ? (
              <Loader2Icon className="w-4 h-4 animate-spin" />
            ) : (
              <SparklesIcon />
            )}
            <span className="text-xs">AI Visualize</span>
          </Button>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-2 px-4 pt-0">
        <div
          className={`rounded-xl transition-all duration-500 px-4 py-2 ${
            isVisualizerActive
              ? "bg-sidebar/70 min-h-[25vh] active"
              : "bg-transparent h-0 min-h-0 -mt-4"
          }`}
        >
          {isLoading ? (
            <div className="flex justify-center items-center w-full min-h-[25vh]">
              <Loader2Icon className="w-8 h-8 animate-spin" />
            </div>
          ) : (
            isVisualizerActive &&
            generation && <VisualizeTab mermaidCode={generation} />
          )}
        </div>
        <div className="min-h-[50vh] bg-sidebar/70 rounded-xl px-4 py-2">
          <RepoContentMenu
            structuredRepoTree={structuredRepoTree}
            markdownTree={markdownTree}
            repoName={repoName}
          />
          {structuredRepoTree.length > 0 ? (
            <TreeView elements={structuredRepoTree} />
          ) : (
            <div>No data available for {repoName}</div>
          )}
        </div>
      </div>
    </>
  );
}
