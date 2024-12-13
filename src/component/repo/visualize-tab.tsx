"use client";

import mermaid from "mermaid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/component/ui/tabs";
import { vs2015 } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useEffect, useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/prism";

const MERMAID_THEMES = ["default", "forest", "dark", "neutral"] as const;
type MermaidTheme = (typeof MERMAID_THEMES)[number];

interface VisualizeTabProps {
  mermaidCode: string;
}

export function VisualizeTab({ mermaidCode }: VisualizeTabProps) {
  const [activeTab, setActiveTab] = useState("preview");

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: "neutral",
      securityLevel: "loose",
      fontFamily: "var(--font-sans)",
    });
  });

  useEffect(() => {
    const renderDiagram = async () => {
      if (activeTab === "preview") {
        mermaid.contentLoaded();
      }
    };

    renderDiagram();
  }, [activeTab]);

  return (
    <div className="w-full mx-auto">
      <Tabs
        defaultValue="preview"
        className="w-full"
        onValueChange={(value) => setActiveTab(value)}
      >
        <div className="component-menu">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent
          value="preview"
          className="min-h-[25vh] p-4 animate-in fade-in duration-300"
        >
          <div className="mermaid transform-origin-center transition-transform duration-200">
            {mermaidCode}
          </div>
        </TabsContent>
        <TabsContent value="code" className="animate-in fade-in duration-300">
          <SyntaxHighlighter language="mermaid" style={vs2015}>
            {mermaidCode}
          </SyntaxHighlighter>
        </TabsContent>
      </Tabs>
    </div>
  );
}
