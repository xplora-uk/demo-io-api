import knex from 'knex';
import type { Knex } from 'knex';
import { IConfigService } from '../../config/types';
import { ICoreDb } from './types';
import { ILoggerService } from '../../logger/types';
import { defaultLogger } from '../../logger';

export class CoreDb implements ICoreDb {
  protected _dbRw: Knex;
  protected _dbRo: Knex;
  constructor(protected config: IConfigService, protected logger: ILoggerService = defaultLogger) {
    this._dbRw = knex(config.coreDbRw.knexConfig);
    this._dbRo = knex(config.coreDbRo.knexConfig);
  }

  async start() {
    const result = await this._dbRw.raw('SELECT 1+1 AS result');
    this.logger.info('CoreDb.start rw db', result);

    const result2 = await this._dbRo.raw('SELECT 1+1 AS result');
    this.logger.info('CoreDb.start ro db', result2);
  }

  async stop() {
    await this._dbRw.destroy();
    await this._dbRo.destroy();
  }
}
