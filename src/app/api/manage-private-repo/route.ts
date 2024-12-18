import { auth } from "@/action/auth";
import { GitHubClient } from "@/action/github";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const githubClient = new GitHubClient(session);
    const installation = await githubClient.getAppInstallation();
    if (!installation) {
      return Response.redirect(
        githubClient.getAppInstallUrl()
      );
    }

    return Response.redirect(installation.html_url);
  } catch (error) {
    console.error("Failed to check GitHub App installation:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}