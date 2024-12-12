"use client";

import { useState } from "react";
import { RepoHeader } from "./header";
import { RepoContentMenu } from "./content-menu";
import { VisualizeTab } from "./visualize-tab";
import { TreeView } from "@/component/repo/tree-view";
import { TreeViewElement } from "@/component/tree-view-api";
import { Button } from "../ui/button";
import { SparklesIcon } from "lucide-react";

interface RepoContentProps {
  repoName: string;
  structuredRepoTree: TreeViewElement[];
}

export function AppRepoContent({
  repoName,
  structuredRepoTree,
}: RepoContentProps) {
  const [isVisualizerActive, setIsVisualizerActive] = useState(false);

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex flex-1 items-center gap-2 px-4">
          <RepoHeader />
          <Button
            variant="outline"
            className="p-2 h-7"
            onClick={() => setIsVisualizerActive(true)}
          >
            <SparklesIcon />
            <span className="text-xs">AI Visualize</span>
          </Button>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-2 px-4 pt-0">
        <div
          className={`rounded-xl transition-all duration-500 px-4 py-2 ${
            isVisualizerActive
              ? "bg-sidebar/70 min-h-[25vh] active"
              : "bg-transparent h-0 min-h-0"
          }`}
        >
          <VisualizeTab />
        </div>
        <div className="min-h-[50vh] bg-sidebar/70 rounded-xl px-4 py-2">
          <RepoContentMenu
            treeStructure={structuredRepoTree}
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
