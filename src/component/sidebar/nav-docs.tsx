"use client";

import { type LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/util";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/component/ui/sidebar";

export function NavDocs({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    badge?: number;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="gap-1">
        <span>Documents</span>
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const docsPath = `/docs/${item.url}`;
          const isActive = pathname === docsPath;
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                className={cn(
                  isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
                )}
              >
                <Link href={docsPath}>{item.title}</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
