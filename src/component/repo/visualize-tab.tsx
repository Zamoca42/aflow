"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/component/ui/tabs";
import { vs } from "react-syntax-highlighter/dist/esm/styles/prism";
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/prism";

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
          className="animate-in fade-in duration-300"
        >
          <MermaidViewer code={mermaidCode} activeTab={activeTab} />
        </TabsContent>
        <TabsContent value="code" className="animate-in fade-in duration-300">
          <SyntaxHighlighter language="mermaid" style={vs} className="text-xs rounded-xl">
            {mermaidCode}
          </SyntaxHighlighter>
        </TabsContent>
      </Tabs>
    </div>
  );
}
