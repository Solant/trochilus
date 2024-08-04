# Trochilus

CLI tool to check various issues in JavaScript project dependencies.
Specifically made for end projects, to ensure all dependencies are up-to-date, correctly installed and actively
maintained.

## Usage

```
npx trochilus <path-to-project-root-folder>
```

### Options

| Option | Description           |
|--------|-----------------------|
| -v     | Enable verbose output |
| -h     | Print help            |

## Current checks

- [X] Correct type of dependencies (e.g. `dependencies` and `devDependencies`)
- [X] Stale dependencies with archived source code repository
- [X] New minor and patch versions of dependencies
