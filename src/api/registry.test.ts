import { describe, expect, test } from 'vitest';
import { resolvePackageMetadata } from './registry.ts';

describe('NPM registry client', () => {
  test('should fetch package metadata', async () => {
    const data = await resolvePackageMetadata('nomnom');
    expect(data?.name).toBe('nomnom');
  });

  test('should return undefined if package was not found', async () => {
    const data = await resolvePackageMetadata('DOESNTEXIST');
    expect(data).toBe(undefined);
  });
});
