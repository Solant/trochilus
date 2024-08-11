import process from 'node:process';
import fs from 'node:fs/promises';
import path from 'node:path';

import { createCommand } from 'commander';
import pc from 'picocolors';

import { parsePackageJson } from './package.ts';
import { archived, bundler, typescript, updates } from './checks';
import { Reporter, groupIssues, stringifyIssue } from './reporter.ts';
import { logger, LogLevel, setLogLevel } from './logger.ts';

const checks = [
  archived,
  typescript,
  bundler,
  updates,
];

const program = createCommand('trochilus');

program
  .option('-v, --verbose', 'Verbose messages', false)
  .argument('[path]', 'Path to project directory', '')
  .action(async (projectPath: string, opts: { verbose: boolean }) => {
    setLogLevel(opts?.verbose ? LogLevel.DEBUG : LogLevel.INFO);

    const root = path.resolve(projectPath ? path.resolve(process.cwd(), projectPath) : process.cwd());
    logger.debug(`Root folder set to ${root}`);

    const packageFile = path.join(root, 'package.json');
    try {
      const stat = await fs.stat(packageFile);
      if (!stat.isFile()) {
        logger.error(`${packageFile} is not a file`);
        process.exit(1);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      if (e.code === 'ENOENT') {
        logger.error(`File ${packageFile} not found`);
        process.exit(1);
      }

      throw e;
    }

    const content = await fs.readFile(packageFile, 'utf-8');
    const pkg = parsePackageJson(content);
    if (!pkg) {
      logger.error(`Failed to parse ${packageFile}, file is not a valid JSON file`);
      return;
    }

    const reporter = new Reporter();
    for (const check of checks) {
      logger.debug(`Starting ${check.name} check`);
      try {
        await check.run(root, pkg, reporter);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        logger.warn(`Error during "${check.name}" check: ${e.message}`);
      }
      logger.debug(`Finished ${check.name} check`);
    }

    if (reporter.issues.length === 0) {
      process.exit(0);
    }

    const result = groupIssues(reporter.issues);
    for (const group of result) {
      logger.info(pc.underline(group[0]));
      for (const group1 of group[1]) {
        logger.info(`\t${group1[0]}:`);

        for (const issue of group1[1]) {
          logger.info(`\t\t${stringifyIssue(issue)}`);
        }
        logger.info('');
      }
    }
    process.exit(1);
  });

program.parse();
