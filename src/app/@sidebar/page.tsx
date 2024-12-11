import { AppSidebar } from "@/component/sidebar/app-sidebar";
import { getSidebarData } from "@/lib/sidebar";

export default async function SidebarPage() {
  const { user, allRepos } = await getSidebarData();
  return <AppSidebar user={user} allRepos={allRepos} />;
}