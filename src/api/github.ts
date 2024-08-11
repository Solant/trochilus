import fetch, { type HeadersInit } from 'node-fetch';

export function isGitHub(url: string): boolean {
  return url.includes('github.com');
}

interface GithubRepository {
  owner: string,
  repo: string,
}

export function getOwnerAndRepo(url: string): GithubRepository | undefined {
  if (!isGitHub(url)) {
    return;
  }

  const matches = url.match(/github.com\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)/);
  if (matches && matches.length === 3) {
    return {
      owner: matches[1],
      repo: matches[2],
    };
  }
}

export async function isArchived(repo: GithubRepository): Promise<boolean> {
  const headers: HeadersInit = process.env.GITHUB_TOKEN ? {
    authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  } : {};

  const response = await fetch(`https://api.github.com/repos/${repo.owner}/${repo.repo}`, { headers });
  if (!response.ok) {
    if (Number.parseInt(response.headers.get('x-ratelimit-remaining') ?? '', 10) === 0) {
      let message = 'GitHub API rate limit exceeded';
      if (!process.env.GITHUB_TOKEN) {
        message += ', pass GITHUB_TOKEN env variable to increase limit';
      }
      throw new Error(message);
    }
  }

  const repositoryInfo = await response.json();
  if (typeof repositoryInfo === 'object' && repositoryInfo != null && 'archived' in repositoryInfo) {
    return repositoryInfo.archived === true;
  }

  return false;
}
