import { AppSidebar } from "@/component/sidebar/app-sidebar";
import { auth } from "@/action/auth";
import { redirect } from "next/navigation";

export default async function DefaultSidebar() {
  const session = await auth();
  if (!session) {
    return redirect("/");
  }
  return <AppSidebar user={null} allRepos={[]} />;
}
