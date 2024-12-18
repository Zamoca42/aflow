"use client";

import { copyToClipboard, simulateDownload } from "@/lib/share";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/component/ui/dropdown-menu";
import { ClipboardIcon, DownloadIcon, MoreHorizontalIcon } from "lucide-react";
import { Button } from "@/component/ui/button";
import { Checkbox } from "@/component/ui/checkbox";
import { TreeViewElement } from "@/component/tree-view-api";
import { useTreeView } from "@/component/repo/tree-view";

type CheckboxOptionProps = {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

function CheckboxOption({
  id,
  label,
  checked,
  onCheckedChange,
}: CheckboxOptionProps) {
  return (
    <div className="flex items-center space-x-1 text-sm">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(checked) => onCheckedChange(checked as boolean)}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}

interface RepoContentMenuProps {
  repoName: string;
  markdownTree: string;
  structuredRepoTree: TreeViewElement[];
}

export function RepoContentMenu({
  structuredRepoTree,
  markdownTree,
  repoName,
}: RepoContentMenuProps) {
  const { showIcons, showFiles, setShowIcons, setShowFiles } = useTreeView();
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyToClipboard = async () => {
    if (!markdownTree) {
      alert("No content to copy. The tree is empty.");
      return;
    }

    await copyToClipboard(
      process.env.NODE_ENV === "development"
        ? JSON.stringify(structuredRepoTree, null, 2)
        : markdownTree
    );
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    if (!markdownTree) {
      alert("No content to download. The tree is empty.");
      return;
    }

    const blob = new Blob([markdownTree], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    simulateDownload(`${repoName}-tree.md`, url);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="component-menu">
      <div className="flex items-center space-x-2">
        <CheckboxOption
          id="show-icons"
          label="Show Icons"
          checked={showIcons}
          onCheckedChange={setShowIcons}
        />
        <CheckboxOption
          id="show-files"
          label="Show Files"
          checked={showFiles}
          onCheckedChange={setShowFiles}
        />
      </div>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild className="hover:bg-muted rounded-md">
          <Button variant="ghost" size="sm" className="h-7 w-7">
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={handleCopyToClipboard}>
            <ClipboardIcon className="h-4 w-4" />
            {isCopied ? <span>Copied!</span> : <span>Copy to Clipboard</span>}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDownloadMarkdown}>
            <DownloadIcon className="h-4 w-4" />
            <span>Download Markdown</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
