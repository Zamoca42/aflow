import ky from "ky";
import { z } from "zod";
import { Session } from "next-auth";
import { TreeBuilder } from "@/lib/tree";
import { TreeStructureSchema } from "@/lib/schema";
import { Repository, GitTreeResponse, InstallationInfo } from "@/type";

export class GitHubClient {
  private client: typeof ky;
  private username: string;
  private accessToken: string;
  private readonly githubAppName = "repository-tree-viewer";

  constructor(session: Session | null) {
    this.username = this.getSessionUsername(session);
    this.accessToken = this.validateAccessToken(session?.accessToken);

    this.client = ky.extend({
      prefixUrl: "https://api.github.com",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });
  }

  async getAppInstallation(): Promise<InstallationInfo | null> {
    try {
      const installations = await this.client
        .get('user/installations')
        .json<{ installations: InstallationInfo[] }>();

      return installations.installations.find(
        install => install.app_slug === this.githubAppName
      ) || null;
    } catch (error) {
      console.error('Failed to fetch app installation:', error);
      return null;
    }
  }

  getAppInstallUrl(): string {
    return `https://github.com/apps/${this.githubAppName}/installations/new`;
  }

  async getPublicRepoCount(): Promise<number> {
    try {
      const user = await this.client.get('user').json<{
        public_repos: number;
      }>();

      return user.public_repos;
    } catch (error) {
      console.error('Failed to fetch repository count:', error);
      return 0;
    }
  }

  async getAllRepositories(): Promise<Repository[]> {
    const totalCount = await this.getPublicRepoCount();
    const perPage = 100;
    const totalPages = Math.ceil(totalCount / perPage);
    const allPublicRepos: Repository[] = [];

    for (let page = 1; page <= totalPages; page++) {
      const repos = await this.client.get("user/repos", {
        searchParams: {
          affiliation: 'owner',
          per_page: perPage.toString(),
          page: page.toString(),
          sort: "updated",
        }
      }).json<Repository[]>();
      allPublicRepos.push(...repos);
    }

    return allPublicRepos;
  }

  async getStructuredRepoTree(repoName: string, branch: string): Promise<z.infer<typeof TreeStructureSchema>> {
    const data = await this.client
      .get(`repos/${this.username}/${repoName}/git/trees/${branch}`, {
        searchParams: { recursive: "1" },
      })
      .json<GitTreeResponse>();

    if (!data.tree || !Array.isArray(data.tree)) {
      throw new Error("Invalid repository tree data structure");
    }

    return TreeStructureSchema.parse(new TreeBuilder(data.tree).build());
  }

  private validateAccessToken(accessToken: string | undefined): string {
    if (!accessToken) {
      throw new Error("Access token is required");
    }
    return accessToken;
  }

  private getSessionUsername(session: Session | null): string {
    if (!session?.user?.username) {
      throw new Error("Username is required");
    }
    return session.user.username;
  }
}