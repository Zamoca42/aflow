"use client";

import { RepoContentMenu } from "@/component/repo/content-menu";
import { TreeView } from "@/component/repo/app-tree-view";
import { TreeViewElement } from "@/component/tree-view-api";
import { VisualizeTab } from "@/component/ai/visualize-tab";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import { VisualizerButton } from "@/component/header/visualizer-button";
import { AppBreadcrumb } from "@/component/header/app-breadcumb";
import { usePathname } from "next/navigation";

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
  const [generation, setGeneration] = useState<string>("");
  const pathname = usePathname();
  const breadcrumbItems = pathname
    .split("/")
    .filter(Boolean)
    .slice(1)
    .map((path) => path.charAt(0).toUpperCase() + path.slice(1));

  return (
    <div className="main-container">
      <header className="header-container">
        <div className="component-menu">
          <AppBreadcrumb items={breadcrumbItems} />
          <VisualizerButton
            structuredRepoTree={structuredRepoTree}
            setIsVisualizerActive={setIsVisualizerActive}
            setIsLoading={setIsLoading}
            setGeneration={setGeneration}
            setIsCached={setIsCached}
            isLoading={isLoading}
          />
        </div>
      </header>
      <div className="content-container">
        <div
          className={`transition-all duration-500 ${
            isVisualizerActive
              ? "component-content active"
              : "bg-transparent h-0 min-h-0 -mt-4 rounded-xl px-4 py-2"
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
        <div className="component-content">
          <RepoContentMenu
            structuredRepoTree={structuredRepoTree}
            repoName={repoName}
          />
          {structuredRepoTree.length > 0 ? (
            <TreeView elements={structuredRepoTree} />
          ) : (
            <div>No data available for {repoName}</div>
          )}
        </div>
      </div>
    </div>
  );
}
