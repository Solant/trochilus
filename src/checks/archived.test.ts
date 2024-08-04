import { test, describe, expect } from 'vitest';

import { archived } from './archived.ts';
import { Reporter } from '../reporter.ts';

describe('archived', () => {
  test('detect archived repo in dependencies', async () => {
    const reporter = new Reporter();
    await archived.run('', {
      dependencies: { 'nomnom': '^1.8.1' },
    }, reporter);
    expect(reporter.issues).toHaveLength(1);
  });

  test('detect archived repo in devDependencies', async () => {
    const reporter = new Reporter();
    await archived.run('', {
      devDependencies: { 'nomnom': '^1.8.1' },
    }, reporter);
    expect(reporter.issues).toHaveLength(1);
  });
});
