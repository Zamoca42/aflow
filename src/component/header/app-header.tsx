"use client";

import { HeaderBreadcrumb } from "@/component/header/header-breadcumb";
import { Button } from "@/component/ui/button";
import { Loader2Icon, SparklesIcon } from "lucide-react";
import { useVisualize } from "@/context/visualizer";
import { useRateLimit } from "@/context/rate-limit";
import { RATE_LIMIT_DURATION } from "@/lib/constant";
import { usePathname } from "next/navigation";

export function AppHeader() {
  const { isLoading, handleVisualize } = useVisualize();
  const { isDisabled, setRateLimited, remainingTime } = useRateLimit();
  const pathname = usePathname();
  const isRepoPage = pathname.startsWith("/repo/");

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
    <>
      <HeaderBreadcrumb />
      {isRepoPage && (
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
      )}
    </>
  );
}
