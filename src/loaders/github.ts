import { AstroError } from "astro/errors";
import type { Loader } from "astro/loaders";
import Slugger from "github-slugger";
import { z } from "astro/zod";
import type { AstroIntegrationLogger } from "astro";

const MAX_RESULTS_PER_PAGE = 100;

const GitHubReposLoaderConfigSchema = z.object({
  /**
   * The GitHub username of the repositories to load.
   */
  username: z.string(),
  /**
   * The sort order of the repositories.
   */
  sort: z
    .enum(["created", "updated", "pushed", "full_name"])
    .default("full_name"),
  /**
   * The sort direction of the repositories.
   */
  direction: z.enum(["asc", "desc"]).default("asc"),
  /**
   * The type of repositories to load.
   */
  type: z.enum(["all", "owner", "member"]).default("owner"),
});

const GithubReposSchema = z.object({
  node_id: z.string(),
  name: z.string(),
  full_name: z.string(),
  owner: z.object({
    login: z.string(),
    id: z.number(),
    node_id: z.string(),
    avatar_url: z.string().url(),
    gravatar_id: z.string(),
    url: z.string().url(),
    html_url: z.string().url(),
    followers_url: z.string().url(),
    following_url: z.string().url(),
    gists_url: z.string().url(),
    starred_url: z.string().url(),
    subscriptions_url: z.string().url(),
    organizations_url: z.string().url(),
    repos_url: z.string().url(),
    events_url: z.string().url(),
    received_events_url: z.string().url(),
    type: z.string(),
    site_admin: z.boolean(),
  }),
  private: z.boolean(),
  html_url: z.string().url(),
  description: z.string().nullable(),
  fork: z.boolean(),
  url: z.string().url(),
  archive_url: z.string().url(),
  assignees_url: z.string().url(),
  blobs_url: z.string().url(),
  branches_url: z.string().url(),
  collaborators_url: z.string().url(),
  comments_url: z.string().url(),
  commits_url: z.string().url(),
  compare_url: z.string().url(),
  contents_url: z.string().url(),
  contributors_url: z.string().url(),
  deployments_url: z.string().url(),
  downloads_url: z.string().url(),
  events_url: z.string().url(),
  forks_url: z.string().url(),
  git_commits_url: z.string().url(),
  git_refs_url: z.string().url(),
  git_tags_url: z.string().url(),
  git_url: z.string().url(),
  issue_comment_url: z.string().url(),
  issue_events_url: z.string().url(),
  issues_url: z.string().url(),
  keys_url: z.string().url(),
  labels_url: z.string().url(),
  languages_url: z.string().url(),
  merges_url: z.string().url(),
  milestones_url: z.string().url(),
  notifications_url: z.string().url(),
  pulls_url: z.string().url(),
  releases_url: z.string().url(),
  ssh_url: z.string(),
  stargazers_url: z.string().url(),
  statuses_url: z.string().url(),
  subscribers_url: z.string().url(),
  subscription_url: z.string().url(),
  tags_url: z.string().url(),
  teams_url: z.string().url(),
  trees_url: z.string().url(),
  clone_url: z.string().url(),
  mirror_url: z.string().url().nullable(),
  hooks_url: z.string().url(),
  svn_url: z.string().url(),
  homepage: z.string().nullable(),
  language: z.string().nullable(),
  forks_count: z.number(),
  stargazers_count: z.number(),
  watchers_count: z.number(),
  size: z.number(),
  default_branch: z.string(),
  open_issues_count: z.number(),
  is_template: z.boolean(),
  topics: z.array(z.string()),
  has_issues: z.boolean(),
  has_projects: z.boolean(),
  has_wiki: z.boolean(),
  has_pages: z.boolean(),
  has_downloads: z.boolean(),
  has_discussions: z.boolean(),
  archived: z.boolean(),
  disabled: z.boolean(),
  visibility: z.string(),
  pushed_at: z.coerce.date(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

type GitHubReposLoaderConfigSchema = z.input<
  typeof GitHubReposLoaderConfigSchema
>;

type GitHubReposLoaderConfig = z.output<typeof GitHubReposLoaderConfigSchema>;

const ReposResponseSchema = z.array(
  z
    .object({
      name: z.string(),
    })
    .passthrough(),
);

type ReposResponse = z.output<typeof ReposResponseSchema>;

interface FetchReposByUsernameParams {
  config: GitHubReposLoaderConfig;
  logger: AstroIntegrationLogger;
}

async function fetchPaginatedReposByUsername(
  { config, logger }: FetchReposByUsernameParams,
  page = 1,
): Promise<ReposResponse> {
  const { username, direction, sort, type } = config;
  logger.info(`Loading ${username}'s repositories`);

  const url = new URL(`https://api.github.com/users/${username}/repos`);
  url.searchParams.set("per_page", String(MAX_RESULTS_PER_PAGE));
  url.searchParams.set("page", String(page));
  url.searchParams.set("sort", sort);
  url.searchParams.set("direction", direction);
  url.searchParams.set("type", type);

  const res = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to load repositories for ${username}.`);
  }

  let json: unknown;

  try {
    json = await res.json();
  } catch (error) {
    throw new Error(`Failed to parse JSON response for ${username}.`, {
      cause: error,
    });
  }

  const parsedRepos = ReposResponseSchema.safeParse(json);

  if (!parsedRepos.success) {
    throw new Error(`Invalid repo data for ${username}.`);
  }

  return parsedRepos.data;
}

async function fetchReposByUsername(params: FetchReposByUsernameParams) {
  let page = 1;
  const allRepos = [];

  while (true) {
    const repos = await fetchPaginatedReposByUsername(params, page);
    allRepos.push(...repos);

    if (repos.length < MAX_RESULTS_PER_PAGE) break;
    page += 1;
  }

  return allRepos;
}

export function gitHubReposLoader(
  userConfig: GitHubReposLoaderConfigSchema,
): Loader {
  const parsedConfig = GitHubReposLoaderConfigSchema.safeParse(userConfig);

  if (!parsedConfig.success) {
    throw new AstroError(
      `The provided loader configuration is invalid.\n${parsedConfig.error.issues
        .map((issue) => issue.message)
        .join("\n")}`,
      "See the error report above for more information.",
    );
  }

  const config = parsedConfig.data;

  return {
    name: "github-repos-loader",
    schema: GithubReposSchema,
    async load({ logger, parseData, store }) {
      const repos = await fetchReposByUsername({
        config,
        logger,
      });
      const slugger = new Slugger();
      for (const repo of repos) {
        const id = slugger.slug(repo.name);
        const parsedRepo = await parseData({ id, data: repo });
        store.set({ id, data: parsedRepo });
      }
    },
  };
}
