import { IssueCode, Reporter } from '../reporter.ts';
import { Rule, PackageGroup } from './shared';
import { PackageJson } from '../package.ts';

const ts = new PackageGroup();
ts.add('typescript', 'TypeScript compiler');
ts.add(/^@types\//, 'TypeScript definitions');
ts.add([
  'ts-node',
  'tsx',
  '@swc/register',
  '@swc-node/register',
  'esbuild-runner',
  'jiti',
  'sucrase',
  'tsm',
], 'TypeScript runtimes for Node.js');

export const typescript: Rule = {
  name: 'typescript',
  async run(path: string, pkg: PackageJson, reporter: Reporter) {
    for (const dependency of Object.keys(pkg.dependencies ?? {})) {
      if (ts.test(dependency)) {
        reporter.addIssue({
          path,
          packageName: dependency,
          code: IssueCode.WRONG_DEPENDENCY_TYPE,
          expected: 'development',
          got: 'production',
        });
      }
    }

    return Promise.resolve();
  },
};
