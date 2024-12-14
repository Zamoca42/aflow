import { auth, signIn } from "@/action/auth";
import { GitHubClient } from "@/action/github";
import { User } from "@/type";

export async function getSidebarData() {
  const session = await auth();

  if (session?.error === "RefreshAccessTokenError") {
    await signIn("github");
  }

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

  const githubClient = new GitHubClient(session);
  const allRepos = await githubClient.getAllRepositories();
  return {
    user,
    allRepos,
  };
}