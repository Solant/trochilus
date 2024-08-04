import semver from 'semver';

import { Rule } from './shared';
import { PackageJson } from '../package.ts';
import { IssueCode, Reporter } from '../reporter.ts';
import { resolvePackageMetadata } from '../api/registry.ts';
import { logger } from '../logger.ts';

export const updates: Rule = {
  name: 'updates',
  async run(projectPath: string, pkg: PackageJson, reporter: Reporter): Promise<void> {
    const dependencies = [
      ...Object.keys(pkg.dependencies ?? {}),
      ...Object.keys(pkg.devDependencies ?? {}),
    ];

    for (const dep of dependencies) {
      const dependency = await resolvePackageMetadata(dep);
      if (!dependency) {
        logger.warn(`Failed to resolve ${dep} from npm registry`);
        continue;
      }

      const versions = Object.keys(dependency.versions);
      const currentVersion = pkg.dependencies?.[dep] ?? pkg.devDependencies?.[dep];
      if (!currentVersion) {
        continue;
      }

      const maxSemver = semver.maxSatisfying(versions, currentVersion)!;
      const curSemver = semver.minVersion(currentVersion)!;
      if (!semver.eq(maxSemver, curSemver)) {
        reporter.addIssue({
          code: IssueCode.OUTDATED,
          path: projectPath,
          packageName: dep,
          max: maxSemver,
          current: curSemver.toString(),
        });
      }
    }
  },
};
