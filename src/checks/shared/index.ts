import { Reporter } from '../../reporter.ts';
import { PackageJson } from '../../package.ts';

export interface Rule {
  name: string,

  run(projectPath: string, pkg: PackageJson, reporter: Reporter): Promise<void>,
}

export class PackageGroup {
  private rules: Array<{ value: string | RegExp | string[], description: string }> = [];

  add(
    rule: typeof this.rules[number]['value'],
    description?: string,
  ) {
    this.rules.push({
      value: rule,
      description: description ?? '',
    });
  }

  test(name: string): boolean {
    return this.rules.some((rule) => {
      if (typeof rule.value === 'string') {
        return rule.value === name;
      }

      if (Array.isArray(rule.value)) {
        return rule.value.includes(name);
      }

      return rule.value.test(name);
    });
  }
}
