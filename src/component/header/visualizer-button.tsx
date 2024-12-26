"use client";

import { Button } from "@/component/ui/button";
import { Loader2Icon, SparklesIcon } from "lucide-react";
import { useRateLimit } from "@/context/rate-limit";
import { RATE_LIMIT_DURATION } from "@/lib/constant";
import { getArchitecture } from "@/action/ai-visualize";
import { convertToMermaid } from "@/lib/mermaid";
import { useMemo } from "react";
import { MarkdownTreeGenerator } from "@/action/markdown";
import { TreeViewElement } from "@/component/tree-view-api";

interface VisualizerButtonProps {
  structuredRepoTree: TreeViewElement[];
  setIsVisualizerActive: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  setGeneration: (value: string) => void;
  setIsCached: (value: boolean) => void;
  isLoading: boolean;
}

export function VisualizerButton({
  structuredRepoTree,
  setIsVisualizerActive,
  setIsLoading,
  setGeneration,
  setIsCached,
  isLoading,
}: VisualizerButtonProps) {
  const { isDisabled, setRateLimited, remainingTime } = useRateLimit();
  const markdownTree = useMemo(() => {
    return new MarkdownTreeGenerator(structuredRepoTree, {
      showIcons: false,
      showFiles: true,
      hideDotFiles: true,
    }).generate();
  }, [structuredRepoTree]);

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

  const onVisualize = async () => {
    try {
      await handleVisualize();
    } catch (error) {
      if ((error as Error).message === "429") {
        alert(`Too many requests. Please wait ${RATE_LIMIT_DURATION} seconds.`);
        setRateLimited(RATE_LIMIT_DURATION);
      } else {
        alert("Something went wrong!");
      }
    }
  };

  return (
    <Button
      variant="outline"
      className="p-2 h-7"
      onClick={onVisualize}
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
  );
}
