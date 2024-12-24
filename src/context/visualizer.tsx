"use client";

import { createContext, useContext, useState, useMemo } from "react";
import { getArchitecture } from "@/action/ai-visualize";
import { convertToMermaid } from "@/lib/mermaid";
import { TreeViewElement } from "@/component/tree-view-api";
import { MarkdownTreeGenerator } from "@/action/markdown";
import { useTreeView } from "@/context/tree-view";

interface VisualizeContextType {
  isVisualizerActive: boolean;
  isLoading: boolean;
  isCached: boolean;
  generation: string;
  markdownTree: string | null;
  setStructuredRepoTree: (tree: TreeViewElement[]) => void;
  handleVisualize: () => Promise<void>;
  setIsVisualizerActive: (active: boolean) => void;
}

const VisualizeContext = createContext<VisualizeContextType | undefined>(
  undefined
);

export function VisualizeProvider({ children }: { children: React.ReactNode }) {
  const [structuredRepoTree, setStructuredRepoTree] = useState<
    TreeViewElement[]
  >([]);
  const { showIcons, showFiles } = useTreeView();

  const markdownTree = useMemo(() => {
    if (structuredRepoTree.length === 0) return null;
    return new MarkdownTreeGenerator(
      structuredRepoTree,
      showIcons,
      showFiles
    ).generate();
  }, [structuredRepoTree, showIcons, showFiles]);

  const [isVisualizerActive, setIsVisualizerActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCached, setIsCached] = useState(false);
  const [generation, setGeneration] = useState<string>("");

  const handleVisualize = async () => {
    setIsVisualizerActive(true);
    setIsLoading(true);
    try {
      if (!markdownTree) {
        throw new Error("No markdown tree available");
      }

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
      setIsVisualizerActive(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VisualizeContext.Provider
      value={{
        isVisualizerActive,
        isLoading,
        isCached,
        generation,
        markdownTree,
        setStructuredRepoTree,
        handleVisualize,
        setIsVisualizerActive,
      }}
    >
      {children}
    </VisualizeContext.Provider>
  );
}

export function useVisualize() {
  const context = useContext(VisualizeContext);
  if (!context) {
    throw new Error("useVisualize must be used within a VisualizeProvider");
  }
  return context;
}
