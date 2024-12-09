import { AppSidebar } from "@/component/sidebar/app-sidebar";
import { getSidebarData } from "@/lib/sidebar";
import { redirect } from "next/navigation";

export default async function DefaultSidebar() {
  const { user, publicRepo } = await getSidebarData();

  if (!user) {
    redirect("/");
  }

  return <AppSidebar user={user} publicRepo={publicRepo} />;
}
