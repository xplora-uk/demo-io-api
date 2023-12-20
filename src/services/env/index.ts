import { IProcessEnvForIoApi } from '../../types';
import { ILoggerService } from '../logger/types';
import { IEnvService } from './types';

const TRUTHY = ['true', 'yes', 'on', '1'];

export class EnvService implements IEnvService {
  penv: IProcessEnvForIoApi;
  constructor(
    penv: IProcessEnvForIoApi,
    protected logger: ILoggerService,
    public keyPrefix: string,
  ) {
    this.penv = this._filterPenv(penv, keyPrefix);
    logger.info('EnvService.constructor', this.penv);
  }

  _filterPenv(penv: IProcessEnvForIoApi, keyPrefix: string): IProcessEnvForIoApi {
    if (!keyPrefix) return penv;
    const result: IProcessEnvForIoApi = {};
    Object.entries(penv)
      .filter(([key]) => key.startsWith(keyPrefix))
      .forEach(([key, value]) => {
        result[key] = value;
      });
    return result;
  }

  newEnv(keyPrefix: string): EnvService {
    return new EnvService(this.penv, this.logger, `${this.keyPrefix}${keyPrefix}`);
  }

  str(key: string, def = ''): string {
    return this.penv[`${this.keyPrefix}${key}`] || def;
  }

  int(key: string, def = 0): number {
    let s = this.str(key, String(def));
    const i = Number.parseInt(s, 10);
    return Number.isNaN(i) ? def : i;
  }

  float(key: string, def = 0.0): number {
    let s = this.str(key, String(def));
    const f = Number.parseFloat(s);
    return Number.isNaN(f) ? def : f;
  }

  bool(key: string, def = false): boolean {
    let s = this.str(key, String(def)).toLowerCase();
    return TRUTHY.includes(s) ? true : Boolean(def);
  }

}
