import { AppSidebar } from "@/component/sidebar/app-sidebar";
import { getSidebarData } from "@/action/sidebar";

export default async function SidebarPage() {
  const { user, allRepos } = await getSidebarData();
  return <AppSidebar user={user} allRepos={allRepos} />;
}
