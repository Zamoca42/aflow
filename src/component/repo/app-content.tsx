"use client";

import { useMemo, useState } from "react";
import { RepoHeader } from "@/component/repo/header";
import { RepoContentMenu } from "@/component/repo/content-menu";
import { TreeView } from "@/component/repo/tree-view";
import { TreeViewElement } from "@/component/tree-view-api";
import { Button } from "@/component/ui/button";
import { Loader2Icon, SparklesIcon } from "lucide-react";
import { getArchitecture } from "@/action/ai-visualize";
import { MarkdownTreeGenerator } from "@/action/markdown";
import { convertToMermaid } from "@/lib/mermaid";
import { useTreeView } from "@/component/repo/tree-view";
import { VisualizeTab } from "@/component/repo/visualize-tab";
import { Architecture } from "@/lib/schema";
import { useRateLimit } from "@/component/rate-limit";
import { RATE_LIMIT_DURATION } from "@/lib/constant";
import { UpstashRatelimitError } from "@langchain/community/callbacks/handlers/upstash_ratelimit";

interface RepoContentProps {
  repoName: string;
  structuredRepoTree: TreeViewElement[];
}

export function AppRepoContent({
  repoName,
  structuredRepoTree,
}: RepoContentProps) {
  const [isVisualizerActive, setIsVisualizerActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCached, setIsCached] = useState(false);
  const { showIcons, showFiles } = useTreeView();
  const [generation, setGeneration] = useState<string>("");
  const { isDisabled, setRateLimited, remainingTime } = useRateLimit();

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
      const { architecture, isCached, success } = await getArchitecture(
        markdownTree
      );

      if (!success) {
        throw new Error("429");
      }

      if (architecture) {
        const mermaidCode = convertToMermaid(architecture);
        setGeneration(mermaidCode);
        setIsCached(isCached);
      }
    } catch (error) {
      if (
        error instanceof UpstashRatelimitError ||
        (error as Error).message === "429"
      ) {
        alert(`Too many requests. Please wait ${RATE_LIMIT_DURATION} seconds.`);
        setRateLimited(RATE_LIMIT_DURATION);
      } else {
        alert("Something went wrong!");
      }
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
            disabled={isLoading || isDisabled}
          >
            {isLoading ? (
              <Loader2Icon className="w-4 h-4 animate-spin" />
            ) : (
              <SparklesIcon />
            )}
            <span className="text-xs">
              {isDisabled ? `Wait ${remainingTime}s` : "AI Visualizer"}
            </span>
          </Button>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-2 px-4 pt-0">
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
