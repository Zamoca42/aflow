import { auth } from "@/action/auth";
import { GitHubClient } from "@/action/github";
import { AppRepoContent } from "@/component/repo/app-content";
import { redirect } from "next/navigation";

type SearchParams = Promise<{
  b: string;
  visualize?: string;
}>;

type Params = Promise<{
  slug: string[];
}>;

interface PageProps {
  params: Params;
  searchParams: SearchParams;
}

export default async function RepoPage({ params, searchParams }: PageProps) {
  const session = await auth();
  const { b: branch } = await searchParams;
  const { slug } = await params;
  const repoName = slug[1];

  if (!session || session.error === "RefreshAccessTokenError") {
    redirect("/");
  }

  if (!repoName || !branch) {
    throw new Error("Invalid Parameters");
  }

  const githubClient = new GitHubClient(session);
  const structuredRepoTree = await githubClient.getStructuredRepoTree(
    repoName,
    branch
  );

  return (
    <AppRepoContent
      repoName={repoName}
      structuredRepoTree={structuredRepoTree}
    />
  );
}
