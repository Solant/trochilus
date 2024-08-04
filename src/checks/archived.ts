import { resolvePackageMetadata } from '../api/registry.ts';
import { IssueCode, Reporter } from '../reporter.ts';
import { getOwnerAndRepo, isArchived } from '../api/github.ts';
import { Rule } from './shared';
import { PackageJson } from '../package.ts';
import { logger } from '../logger.ts';

export const archived: Rule = {
  name: 'archived',
  async run(path: string, pkg: PackageJson, reporter: Reporter) {
    const dependencies = [
      ...Object.keys(pkg.dependencies ?? {}),
      ...Object.keys(pkg.devDependencies ?? {}),
    ];

    for (const dependency of dependencies) {
      logger.debug(`Getting package metadata from npm for ${dependency}`);
      const data = await resolvePackageMetadata(dependency);
      if (!data) {
        logger.warn(`Failed to resolve ${dependency} from npm registry`);
        continue;
      }

      const repo = getOwnerAndRepo(data.repository?.url ?? '');
      if (repo) {
        logger.debug(`Detected GitHub repo for ${dependency}`, repo);
        if (await isArchived(repo)) {
          reporter.addIssue({
            path,
            packageName: dependency,
            code: IssueCode.ABANDONED,
            reason: `GitHub repository is archived at https://github.com/${repo.owner}/${repo.repo}`,
          });
        }
      }
    }
  },
};
