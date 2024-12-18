import { GitHubClient } from "@/action/github";
import { User } from "@/type";
import { type Session } from "next-auth";

export async function getSidebarData(session: Session) {
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