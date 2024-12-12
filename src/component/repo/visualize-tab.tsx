"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/component/ui/tabs";

export function VisualizeTab() {
  return (
    <div className="w-full mx-auto opacity-0 translate-y-[-10px] transition-all duration-500 delay-500 [.active_&]:opacity-100 [.active_&]:translate-y-0">
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
          <span>Code</span>
        </TabsContent>
      </Tabs>
    </div>
  );
}
