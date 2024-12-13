import { AppSidebar } from "@/component/sidebar/app-sidebar";
import { getSidebarData } from "@/action/sidebar";
import { redirect } from "next/navigation";

export default async function DefaultSidebar() {
  const { user, allRepos } = await getSidebarData();

  if (!user) {
    redirect("/");
  }

  return <AppSidebar user={user} allRepos={allRepos} />;
}
