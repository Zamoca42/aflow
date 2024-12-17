"use client";

import {
  BookOpen,
  BookCopy,
  FolderTree,
  BookLock,
  Send,
  Settings,
} from "lucide-react";

import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/component/ui/sidebar";
import { Repository, SidebarRepoItem, User } from "@/type";
import { NavRepository } from "@/component/sidebar/nav-repository";
import { NavMenus } from "@/component/sidebar/nav-menus";
import { NavUser } from "@/component/sidebar/nav-user";
import { signIn } from "next-auth/react";
import { GitHubIcon } from "@/component/icon";

const FEEDBACK_EMAIL = "contact@choo.ooo";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: User | null;
  allRepos: Repository[];
}

interface TransformedRepos {
  forked: SidebarRepoItem[];
  owned: SidebarRepoItem[];
  private: SidebarRepoItem[];
}

const transformRepos = (repos: Repository[]): TransformedRepos => {
  return repos
    .map((repo) => ({
      title: repo.name,
      url: `${repo.name}?b=${repo.default_branch}`,
      fork: repo.fork,
      private: repo.private,
    }))
    .reduce<TransformedRepos>(
      (acc, repo) => {
        if (repo.fork) {
          acc.forked.push(repo);
        } else if (repo.private) {
          acc.private.push(repo);
        } else {
          acc.owned.push(repo);
        }
        return acc;
      },
      { forked: [], owned: [], private: [] }
    );
};

export function AppSidebar({ user, allRepos, ...props }: AppSidebarProps) {
  const transformedRepos = transformRepos(allRepos);
  const data = {
    repo: [
      {
        title: "Owned",
        url: "owned",
        icon: BookOpen,
        items: transformedRepos.owned,
        badge: transformedRepos.owned.length,
      },
      {
        title: "Forked",
        url: "forked",
        icon: BookCopy,
        items: transformedRepos.forked,
        badge: transformedRepos.forked.length,
      },
      {
        title: "Private",
        url: "private",
        icon: BookLock,
        items: transformedRepos.private,
        badge: transformedRepos.private.length,
      },
    ],
    menu: [
      {
        title: "Feedback",
        url: `mailto:${FEEDBACK_EMAIL}`,
        icon: Send,
      },
      user && {
        title: "Manage Private Repository",
        url: `/api/manage-private-repo`,
        icon: Settings,
      },
    ].filter((item) => item !== null),
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <FolderTree className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    Repo Tree Viewer
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavRepository items={data.repo} />
        <NavMenus items={data.menu} user={user} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        {user ? (
          <NavUser user={user} />
        ) : (
          <SidebarMenuButton
            onClick={() => signIn("github")}
            className="flex items-center justify-start"
          >
            <span>Sign in with GitHub</span>
            <GitHubIcon />
          </SidebarMenuButton>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
