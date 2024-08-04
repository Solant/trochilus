export interface PackageJson {
  dependencies?: Record<string, string>,
  devDependencies?: Record<string, string>,
}

export function parsePackageJson(content: string): PackageJson | undefined {
  try {
    return JSON.parse(content) as PackageJson;
  } catch {
    return undefined;
  }
}
