"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/component/ui/tabs";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/prism";
import { copyToClipboard, simulateDownload } from "@/lib/share";
import {
  CheckIcon,
  ClipboardIcon,
  DatabaseZapIcon,
  ImageDownIcon,
} from "lucide-react";
import { Button } from "@/component/ui/button";
import { AppTooltip } from "@/component/app-tooltip";

interface VisualizeTabProps {
  mermaidCode: string;
  isCached: boolean;
  repoName: string;
}

const MermaidViewer = dynamic(
  () =>
    import("@/component/ai/mermaid-viewer").then((mod) => mod.MermaidViewer),
  {
    ssr: false,
  }
);

export function VisualizeTab({
  mermaidCode,
  isCached,
  repoName,
}: VisualizeTabProps) {
  const [activeTab, setActiveTab] = useState("preview");
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyToClipboard = async () => {
    if (!mermaidCode) {
      alert("No content to copy. The code is empty.");
      return;
    }

    await copyToClipboard(mermaidCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const getBase64SVG = (svg: SVGElement): string => {
    const clonedSvg = svg.cloneNode(true) as SVGElement;

    const currentViewBox = clonedSvg
      .getAttribute("viewBox")
      ?.split(" ")
      .map(Number);
    if (currentViewBox) {
      const padding = 20;

      const newViewBox = [
        currentViewBox[0] - padding,
        currentViewBox[1] - padding,
        currentViewBox[2] + padding * 2,
        currentViewBox[3] + padding * 2,
      ].join(" ");

      clonedSvg.setAttribute("viewBox", newViewBox);
    }

    const svgString = clonedSvg.outerHTML
      .replaceAll("<br>", "<br/>")
      .replaceAll(/<img([^>]*)>/g, (m, g: string) => `<img ${g} />`);

    return btoa(`<?xml version="1.0" encoding="UTF-8"?>
  ${svgString}`);
  };

  const handleSvgDownload = async () => {
    const svgElement = document.querySelector(".mermaid svg") as SVGElement;
    if (!svgElement) return;

    simulateDownload(
      `${repoName}-architecture-diagram.svg`,
      `data:image/svg+xml;base64,${getBase64SVG(svgElement)}`
    );
  };

  return (
    <div className="w-full mx-auto">
      <Tabs
        defaultValue="preview"
        className="w-full"
        onValueChange={(value) => setActiveTab(value)}
      >
        <div className="component-menu-end">
          <div>
            {activeTab === "preview" ? (
              <div className="flex items-center gap-2">
                <AppTooltip content="Cached">
                  {isCached && <DatabaseZapIcon className="w-4 h-4" />}
                </AppTooltip>
                <AppTooltip content="Download SVG" asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleSvgDownload}
                  >
                    <ImageDownIcon />
                  </Button>
                </AppTooltip>
              </div>
            ) : (
              <AppTooltip content="Copy to clipboard" asChild>
                <Button
                  onClick={handleCopyToClipboard}
                  variant="ghost"
                  size="icon"
                >
                  {isCopied ? <CheckIcon /> : <ClipboardIcon />}
                </Button>
              </AppTooltip>
            )}
          </div>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent
          value="preview"
          className="animate-in fade-in duration-300"
        >
          <MermaidViewer code={mermaidCode} activeTab={activeTab} />
        </TabsContent>
        <TabsContent value="code" className="animate-in fade-in duration-300">
          <SyntaxHighlighter
            language="mermaid"
            style={oneLight}
            className="text-xs rounded-xl bg-sidebar/70"
          >
            {mermaidCode}
          </SyntaxHighlighter>
        </TabsContent>
      </Tabs>
    </div>
  );
}
