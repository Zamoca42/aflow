"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";


type TreeViewContextType = {
  showIcons: boolean;
  showFiles: boolean;
  setShowIcons: (show: boolean) => void;
  setShowFiles: (show: boolean) => void;
};

const TreeViewContext = createContext<TreeViewContextType | undefined>(
  undefined
);

export function TreeViewProvider({ children }: { children: ReactNode }) {
  const [showIcons, setShowIcons] = useState(true);
  const [showFiles, setShowFiles] = useState(true);

  return (
    <TreeViewContext.Provider
      value={{ showIcons, showFiles, setShowIcons, setShowFiles }}
    >
      {children}
    </TreeViewContext.Provider>
  );
}

export function useTreeView() {
  const context = useContext(TreeViewContext);
  if (context === undefined) {
    throw new Error("useTreeView must be used within a TreeViewProvider");
  }
  return context;
}
