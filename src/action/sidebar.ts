import { auth, signOut } from "@/action/auth";
import { GitHubClient } from "@/action/github";
import { User } from "@/type";
import { redirect } from "next/navigation";

export async function getSidebarData() {
  const session = await auth();
  
  if (!session) {
    return {
      user: null,
      allRepos: []
    };
  }

  const user: User = {
    name: session.user.name!,
    email: session.user.email!,
    avatar: session.user.image!,
  };
  
  try {
    const githubClient = new GitHubClient(session);
    const allRepos = await githubClient.getAllRepositories();
    return {
      user,
      allRepos,
    };
  } catch (error) {
    signOut();
    redirect("/");
  }
}