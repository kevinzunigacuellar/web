import { AstroError } from "astro/errors";
import type { Loader } from "astro/loaders";
import { z } from "astro/zod";
import type { AstroIntegrationLogger } from "astro";

const MAX_RESULTS_PER_PAGE = 100;

const query = `
  query ($first: Int!, $after: String) {
    viewer {
      repositoriesContributedTo(
        first: $first
        contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, REPOSITORY]
        after: $after
      ) {
        totalCount
        pageInfo {
          endCursor
          hasNextPage
        }
        nodes {
          nameWithOwner
          stargazerCount
          forkCount
          url
          description
        }
      }
    }
}
`;

const GitHubContributionsLoaderConfigSchema = z.object({
  /**
   * The GitHub token to use for authentication.
   */
  token: z.string(),
});

const GitHubContributionsRepoSchema = z.object({
  nameWithOwner: z.string(),
  stargazerCount: z.number(),
  forkCount: z.number(),
  url: z.string().url(),
  description: z.string().nullable(),
});

const GitHubContributionsSchema = z.object({
  data: z.object({
    viewer: z.object({
      repositoriesContributedTo: z.object({
        totalCount: z.number(),
        pageInfo: z.object({
          hasNextPage: z.boolean(),
          endCursor: z.string(),
        }),
        nodes: z.array(GitHubContributionsRepoSchema),
      }),
    }),
  }),
});

type GitHubContributionsUserConfig = z.input<
  typeof GitHubContributionsLoaderConfigSchema
>;

type GitHubContributionsLoaderConfig = z.output<
  typeof GitHubContributionsLoaderConfigSchema
>;

type GitHubApiResponse = z.output<typeof GitHubContributionsSchema>;

interface FetchContributionsParams {
  config: GitHubContributionsLoaderConfig;
  logger: AstroIntegrationLogger;
}

async function fetchPaginatedContributions(
  { config, logger }: FetchContributionsParams,
  nextCursor = "",
): Promise<GitHubApiResponse> {
  logger.info("Loading GitHub contributions...");

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.token}`,
    },
    body: JSON.stringify({
      query,
      variables: {
        after: nextCursor,
        first: MAX_RESULTS_PER_PAGE,
      },
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to load GitHub contributions.");
  }

  let json: unknown;

  try {
    json = await res.json();
  } catch (error) {
    throw new Error("Failed to parse JSON response for GitHub contributions.", {
      cause: error,
    });
  }

  const parsedResponse = GitHubContributionsSchema.safeParse(json);

  if (!parsedResponse.success) {
    throw new Error("Invalid GitHub contributions data.");
  }

  return parsedResponse.data;
}

async function fetchReposByUsername(params: FetchContributionsParams) {
  const allContributions = [];
  let nextCursor = "";

  while (true) {
    const contributions = await fetchPaginatedContributions(params, nextCursor);
    const {
      nodes: repos,
      pageInfo,
      totalCount,
    } = contributions.data.viewer.repositoriesContributedTo;
    allContributions.push(...repos);

    if (totalCount < MAX_RESULTS_PER_PAGE || !pageInfo.hasNextPage) break;
    nextCursor = pageInfo.endCursor;
  }

  return allContributions;
}

export function gitHubContributionsLoader(
  userConfig: GitHubContributionsUserConfig,
): Loader {
  const parsedConfig =
    GitHubContributionsLoaderConfigSchema.safeParse(userConfig);

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
    name: "github-contributions-loader",
    schema: GitHubContributionsRepoSchema,
    async load({ logger, parseData, store }) {
      const repos = await fetchReposByUsername({
        config,
        logger,
      });
      for (const repo of repos) {
        const id = repo.nameWithOwner;
        const parsedRepo = await parseData({ id, data: repo });
        store.set({ id, data: parsedRepo });
      }
    },
  };
}
