import { AppSidebar } from "@/component/sidebar/app-sidebar";
import { getSidebarData } from "@/action/sidebar";
import { auth } from "@/action/auth";

export default async function SidebarPage() {
  const session = await auth();
  if (!session || session.error === "RefreshAccessTokenError") {
    return <AppSidebar user={null} allRepos={[]} />;
  }
  const { user, allRepos } = await getSidebarData(session);
  return <AppSidebar user={user} allRepos={allRepos} />;
}
