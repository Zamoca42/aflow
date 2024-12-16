"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/component/ui/tabs";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/prism";
import { copyToClipboard, simulateDownload } from "@/lib/share";
import { CheckIcon, ClipboardIcon, ImageDownIcon } from "lucide-react";
import { Button } from "@/component/ui/button";

interface VisualizeTabProps {
  mermaidCode: string;
}

const MermaidViewer = dynamic(
  () =>
    import("@/component/repo/mermaid-viewer").then((mod) => mod.MermaidViewer),
  {
    ssr: false,
  }
);

export function VisualizeTab({ mermaidCode }: VisualizeTabProps) {
  const [activeTab, setActiveTab] = useState("preview");
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyToClipboard = async () => {
    if (!mermaidCode) {
      alert("No content to copy. The tree is empty.");
      return;
    }
    try {
      await copyToClipboard(mermaidCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const getFileName = (extension: string) => `mermaid-diagram.${extension}`;

  const getBase64SVG = (svg: SVGElement): string => {
    const clonedSvg = svg.cloneNode(true) as SVGElement;

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
      getFileName("svg"),
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
        <div className="component-menu">
          <div>
            {activeTab === "preview" ? (
              <div>
                <Button variant="ghost" size="icon" onClick={handleSvgDownload}>
                  <ImageDownIcon />
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleCopyToClipboard}
                variant="ghost"
                size="icon"
              >
                {isCopied ? <CheckIcon /> : <ClipboardIcon />}
              </Button>
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
