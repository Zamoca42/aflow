"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { File, Folder, Tree, TreeViewElement } from "@/component/tree-view-api";

type TreeItemProps = {
  elements: TreeViewElement[];
  showIcons?: boolean;
  showFiles?: boolean;
};

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

export const TreeView = ({ elements: fileTree }: TreeItemProps) => {
  const { showIcons, showFiles } = useTreeView();

  return (
    <Tree indicator={true} showIcons={showIcons} showFiles={showFiles}>
      {fileTree.map((element, _) => (
        <TreeItem
          key={element.id}
          elements={[element]}
          showIcons={showIcons}
          showFiles={showFiles}
        />
      ))}
    </Tree>
  );
};

export const TreeItem = ({ elements }: TreeItemProps) => {
  return (
    <ul className="w-full space-y-1 text-sm">
      {elements.map((element) => (
        <li key={element.id} className="w-full space-y-2">
          {element.children !== undefined ? (
            <Folder
              element={element.name}
              value={element.id}
              isSelectable={element.isSelectable}
              className="px-px pr-1"
            >
              <TreeItem
                key={element.id}
                aria-label={`folder ${element.name}`}
                elements={element.children}
              />
            </Folder>
          ) : (
            <File
              key={element.id}
              value={element.id}
              isSelectable={element.isSelectable}
              className={"px-1"}
            >
              <span className="ml-1">{element?.name}</span>
            </File>
          )}
        </li>
      ))}
    </ul>
  );
};
