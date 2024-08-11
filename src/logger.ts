/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import pc from 'picocolors';

export const enum LogLevel {
  FATAL,
  ERROR,
  WARN,
  INFO,
  DEBUG,
  TRACE,
}

interface Logger {
  fatal: (...args: any[]) => void,
  error: (...args: any[]) => void,
  warn: (...args: any[]) => void,
  info: (...args: any[]) => void,
  debug: (...args: any[]) => void,
  trace: (...args: any[]) => void
}

let logLevel: LogLevel = LogLevel.INFO;

export function setLogLevel(level: LogLevel) {
  logLevel = level;
}

export const logger: Logger = {
  fatal(...args: any) {
    if (LogLevel.FATAL <= logLevel) {
      console.error(pc.red('FATAL\t'), ...args);
    }
  },
  error(...args: any) {
    if (LogLevel.ERROR <= logLevel) {
      console.error(pc.red('ERROR\t'), ...args);
    }
  },
  warn(...args: any) {
    if (LogLevel.WARN <= logLevel) {
      console.warn(pc.yellow('WARN\t'), ...args);
    }
  },
  info(...args: any) {
    if (LogLevel.INFO <= logLevel) {
      console.info(...args);
    }
  },
  debug(...args: any) {
    if (LogLevel.DEBUG <= logLevel) {
      console.debug(pc.blue('DEBUG\t'), ...args);
    }
  },
  trace(...args: any[]) {
    if (LogLevel.TRACE <= logLevel) {
      console.trace(pc.gray('TRACE\t'), ...args);
    }
  },
};
