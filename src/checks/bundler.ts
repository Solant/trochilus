import { Rule } from './shared';
import { PackageJson } from '../package.ts';
import { IssueCode, Reporter } from '../reporter.ts';
import { PackageGroup } from './shared';

const webpack = new PackageGroup();
webpack.add('webpack', 'Webpack bundler');
webpack.add(/^webpack-/, 'Webpack loaders and plugins');

const vite = new PackageGroup();
vite.add('vite', 'Vite bundler');
vite.add(/^@vitejs\//, 'Vite plugins');

export const bundler: Rule = {
  name: 'bundler',
  run(path: string, pkg: PackageJson, reporter: Reporter) {
    for (const dependency of Object.keys(pkg.dependencies ?? {})) {
      if (
        webpack.test(dependency)
        || vite.test(dependency)
      ) {
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
