import { expect, test, describe } from 'vitest';

import { typescript } from './typescript.ts';
import { Reporter } from '../reporter.ts';

describe('typescript checks', () => {
  test('detect typescript as production dependency', async () => {
    const reporter = new Reporter();
    await typescript.run('', {
      dependencies: {
        typescript: '1.2.3',
      },
    }, reporter);
    expect(reporter.issues).toHaveLength(1);
  });

  test('detect typescript runtime as production dependency', async () => {
    const reporter = new Reporter();
    await typescript.run('', {
      dependencies: {
        'ts-node': '1.2.3',
      },
    }, reporter);
    expect(reporter.issues).toHaveLength(1);
  });

  test('detect typescript definitions as production dependency', async () => {
    const reporter = new Reporter();
    await typescript.run('', {
      dependencies: {
        '@types/lodash': '1.2.3',
      },
    }, reporter);
    expect(reporter.issues).toHaveLength(1);
  });
});
