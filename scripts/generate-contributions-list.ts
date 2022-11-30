import fs from "node:fs/promises";
import { Octokit } from "@octokit/core";

interface DataType {
  viewer: {
    repositoriesContributedTo: {
      nodes: Repo[];
    };
  };
}

interface Repo {
  nameWithOwner: string;
  stargazerCount: number;
  description: string;
  url: string;
  languages: {
    nodes: Language[];
  };
}

interface Language {
  name: string;
}

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const response = (await octokit.graphql(
  `query {
    viewer {
      repositoriesContributedTo(
      first: 20
      orderBy: {field: STARGAZERS, direction: DESC}
      contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, REPOSITORY]
    ) {
        nodes {
        nameWithOwner
        description
        stargazerCount
        url
        languages(first: 4, orderBy: {field: SIZE, direction: DESC}) {
          nodes {
          name
        }}
      }
    }
  }
}`,
  { login: "kevinzunigacuellar" }
)) as DataType;

const maintainerRepos = new Set(["withastro/docs"]);
const projectList = new Set(["remark-code-title", "astro-layouts"]);

let authoredProjects = await Promise.all(
  [...projectList].map(async (repo) => {
    const { data } = await octokit.request("GET /repos/{owner}/{repo}", {
      owner: "kevinzunigacuellar",
      repo,
    });
    return {
      name: data.name,
      stars: data.stargazers_count,
      url: data.html_url,
      description: data.description,
      languages: [data.language],
      role: "author",
    };
  })
);

const contributions = response.viewer.repositoriesContributedTo.nodes
  .filter((repo) => repo.languages.nodes.length > 1)
  .map((repository) => {
    return {
      name: repository.nameWithOwner,
      stars: repository.stargazerCount,
      url: repository.url,
      description: repository.description,
      languages: repository.languages.nodes.map((language) => language.name),
      role: maintainerRepos.has(repository.nameWithOwner)
        ? "maintainer"
        : "contributor",
    };
  });

const all = [...authoredProjects,...contributions,];

await fs.writeFile(
  "./src/content/contributions.json",
  JSON.stringify(all, null, 2)
);

console.log("Contributions list generated");
