import { ILoggerService } from './types';

export const defaultLogger: ILoggerService = {
  debug: console.debug,
  info: console.info,
  warn: console.warn,
  error: console.error,
};
