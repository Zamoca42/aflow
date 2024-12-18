import { auth, signIn } from "@/action/auth";
import { GitHubClient } from "@/action/github";
import { User } from "@/type";
import { redirect } from "next/navigation";

export async function getSidebarData() {
  const session = await auth();

  if (!session || session.error === "RefreshAccessTokenError") {
    await signIn("github");
    redirect("/");
  }

  const user: User = {
    name: session.user.name!,
    email: session.user.email!,
    avatar: session.user.image!,
  };

  const githubClient = new GitHubClient(session);
  const allRepos = await githubClient.getAllRepositories();
  return {
    user,
    allRepos,
  };
}