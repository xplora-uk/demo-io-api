import { IProcessEnvForIoApi } from '../../types';
import { defaultLogger } from '../logger';
import { ILoggerService } from '../logger/types';

const TRUTHY = ['true', 'yes', 'on', '1'];

export class EnvService {

  constructor(public penv: IProcessEnvForIoApi = process.env, protected logger: ILoggerService = defaultLogger) {
    logger.info('EnvService.constructor', penv);
  }

  str(key: string, def = '', keyPrefix = ''): string {
    return this.penv[`${keyPrefix}${key}`] || def;
  }

  int(key: string, def = 0, keyPrefix = ''): number {
    let s = this.str(key, String(def), keyPrefix);
    const i = Number.parseInt(s, 10);
    return Number.isNaN(i) ? def : i;
  }

  float(key: string, def = 0.0, keyPrefix = ''): number {
    let s = this.str(key, String(def), keyPrefix);
    const f = Number.parseFloat(s);
    return Number.isNaN(f) ? def : f;
  }

  bool(key: string, def = false, keyPrefix = ''): boolean {
    let s = this.str(key, String(def), keyPrefix).toLowerCase();
    return TRUTHY.includes(s) ? true : Boolean(def);
  }

}
