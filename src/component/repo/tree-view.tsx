"use client";

import { File, Folder, Tree, TreeViewElement } from "@/component/tree-view-api";
import { useTreeView } from "@/context/view-filter";

type TreeItemProps = {
  elements: TreeViewElement[];
  showIcons?: boolean;
  showFiles?: boolean;
};

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
