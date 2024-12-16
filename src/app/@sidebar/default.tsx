import { AppSidebar } from "@/component/sidebar/app-sidebar";
import { getSidebarData } from "@/action/sidebar";
import { redirect } from "next/navigation";
import { signIn } from "@/action/auth";

export default async function DefaultSidebar() {
  const { user, allRepos } = await getSidebarData();

  if (!user) {
    await signIn("github");
    redirect("/");
  }

  return <AppSidebar user={user} allRepos={allRepos} />;
}
