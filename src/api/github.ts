import fetch from 'node-fetch';
import { logger } from '../logger.ts';

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
  const response = await fetch(`https://api.github.com/repos/${repo.owner}/${repo.repo}`, {
    headers: {
      authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    },
  });
  if (!response.ok) {
    // @ts-expect-error fix me
    logger.error((await response.json()).message);
    return false;
  }

  const repositoryInfo = await response.json();
  if (typeof repositoryInfo === 'object' && repositoryInfo != null && 'archived' in repositoryInfo) {
    return repositoryInfo.archived === true;
  }

  return false;
}
