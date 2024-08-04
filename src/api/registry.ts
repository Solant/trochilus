import fetch from 'node-fetch';
import { logger } from '../logger.ts';

interface Version {
  name: string,
  description: string,
  version: string,
  deprecated?: string,
}

interface PackageMetadata {
  _id: string,
  _rev: string,
  name: string,
  description: string,
  keywords: string[],
  'dist-tags': Record<string, string>,
  versions: Record<string, Version>,
  repository?: {
    type: string,
    url: string,
  },
}

interface NpmError {
  error: string,
}

function isError(arg: unknown): arg is NpmError {
  return typeof arg === 'object' && arg != null && 'error' in arg && typeof arg.error === 'string';
}

const cache = new Map<string, Promise<PackageMetadata | undefined>>;

export function resolvePackageMetadata(name: string): Promise<PackageMetadata | undefined> {
  if (cache.has(name)) {
    logger.debug(`Package metadata for "${name}" resolved from cache`);
    return cache.get(name)!;
  }

  const promise: Promise<PackageMetadata | undefined> = fetch(`https://registry.npmjs.org/${name}`)
    .then(r => r.json())
    .then(data => isError(data) ? undefined : data as PackageMetadata);
  cache.set(name, promise);
  logger.debug(`Fetching package metadata for "${name}"`);

  return promise;
}
