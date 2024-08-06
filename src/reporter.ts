import semver from 'semver';
import pc from 'picocolors';

export enum IssueCode {
  WRONG_DEPENDENCY_TYPE,
  ABANDONED,
  OUTDATED,
}

interface BaseIssue {
  path: string,
  packageName: string,
}

interface WrongDependencyType extends BaseIssue {
  code: IssueCode.WRONG_DEPENDENCY_TYPE,
  expected: 'production' | 'development',
  got: 'production' | 'development',
}

interface AbandonedDependency extends BaseIssue {
  code: IssueCode.ABANDONED,
  reason: string,
}

interface OutdatedDependency extends BaseIssue {
  code: IssueCode.OUTDATED,
  current: string,
  max: string,
}

export type Issue = WrongDependencyType
  | AbandonedDependency
  | OutdatedDependency;

export function stringifyIssue(issue: Issue): string {
  switch (issue.code) {
    case IssueCode.WRONG_DEPENDENCY_TYPE: {
      return `Marked as a wrong dependency type, expected ${issue.expected}, got ${issue.got}`;
    }
    case IssueCode.ABANDONED: {
      return `Project is no longer supported: ${issue.reason}`;
    }
    case IssueCode.OUTDATED: {
      const updateType = semver.diff(issue.current, issue.max)!;
      let update: string = updateType;
      if (updateType.includes('major')) {
        update = pc.red(updateType);
      } else if (updateType.includes('minor')) {
        update = pc.yellow(updateType);
      } else if (updateType.includes('patch')) {
        update = pc.green(updateType);
      }

      return `New ${update} version available: ${issue.current} -> ${issue.max}`;
    }
  }
}

export class Reporter {
  issues: Issue[] = [];

  addIssue(issue: Issue) {
    this.issues.push(issue);
  }
}

type GroupedIssues = Map<string, Map<string, Issue[]>>;

export function groupIssues(issues: Issue[]): GroupedIssues {
  return issues.reduce((acc, cur) => {
    let path: Map<string, Issue[]>;
    if (acc.has(cur.path)) {
      path = acc.get(cur.path)!;
    } else {
      path = new Map<string, Issue[]>();
      acc.set(cur.path, path);
    }

    let pkg: Issue[];
    if (path.has(cur.packageName)) {
      pkg = path.get(cur.packageName)!;
    } else {
      pkg = [] as Issue[];
      path.set(cur.packageName, pkg);
    }

    pkg.push(cur);

    return acc;
  }, new Map() as GroupedIssues);
}
