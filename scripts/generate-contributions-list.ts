import fs from 'node:fs/promises';
import fetch from "node-fetch";

interface DataType {
  data: {
    viewer: {
      repositoriesContributedTo: {
        nodes: Repo[];
      };
    };
  };
}

interface Repo {
  nameWithOwner: string;
  stargazerCount: number;
  url: string;
  languages: {
    nodes: Language[];
  };
}

interface Language {
  name: string;
}

async function getOpenSourceContributions() {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `bearer ${process.env.GITHUB_TOKEN}`,
    },
    body: JSON.stringify({
      query: `
      query {
        viewer {
          repositoriesContributedTo(
            first: 20
            orderBy: {field: STARGAZERS, direction: DESC}
            contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, REPOSITORY]
          ) {
            nodes {
              nameWithOwner
              stargazerCount
              url
              languages(first: 4, orderBy: {field: SIZE, direction: DESC}) {
                nodes {
                  name
                }
              }
            }
          }
        }
      }
    `,
    }),
  });

  const { data } = await res.json() as DataType;
  const contributions = data.viewer.repositoriesContributedTo.nodes
    .filter((repo) => repo.languages.nodes.length > 1)
    .map((repository) => {
      return {
        name: repository.nameWithOwner,
        stars: repository.stargazerCount,
        url: repository.url,
        languages: repository.languages.nodes.map((language) => language.name),
      };
    });
  return contributions;
}

const contributions = await getOpenSourceContributions();
await fs.writeFile(
  "./src/content/contributions.json",
  JSON.stringify(contributions, null, 2)
);

console.log("Contributions list generated");
