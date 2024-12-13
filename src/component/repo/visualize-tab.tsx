"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/component/ui/tabs";
import { useState } from "react";

export function VisualizeTab({ generation }: { generation: string }) {
  const [mounted, setMounted] = useState(false);

  setTimeout(() => {
    setMounted(true);
  }, 500);

  return (
    mounted && (
      <div className="w-full mx-auto">
        <Tabs defaultValue="preview" className="w-full">
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
            <span>Preview</span>
          </TabsContent>
          <TabsContent value="code" className="animate-in fade-in duration-300">
            <div className="text-sm p-2">{generation}</div>
          </TabsContent>
        </Tabs>
      </div>
    )
  );
}
