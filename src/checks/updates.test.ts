import { describe, expect, test } from 'vitest';

import { updates } from './updates';
import { Reporter } from '../reporter.ts';

describe('updates check', () => {
  test('should detect new version', async () => {
    const reporter = new Reporter();
    await updates.run('', {
      dependencies: {
        lodash: '^4.17.15',
      },
    }, reporter);

    expect(reporter.issues).toHaveLength(1);
  });

  test('should not raise error on max version', async () => {
    const reporter = new Reporter();
    await updates.run('', {
      dependencies: {
        nomnom: '^1.8.1',
      },
    }, reporter);

    expect(reporter.issues).toHaveLength(0);
  });
});
