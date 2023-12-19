import knex from 'knex';
import type { Knex } from 'knex';
import { IConfigService } from '../../config/types';
import { IGeoLocationDb } from './types';
import { ILoggerService } from '../../logger/types';
import { defaultLogger } from '../../logger';

export class GeoLocationDb implements IGeoLocationDb {
  protected _dbRw: Knex;
  protected _dbRo: Knex;
  constructor(protected config: IConfigService, protected logger: ILoggerService = defaultLogger) {
    this._dbRw = knex(config.geoLocationDbRw.knexConfig);
    this._dbRo = knex(config.geoLocationDbRo.knexConfig);
  }

  async start() {
    const result = await this._dbRw.raw('SELECT 1+1 AS result');
    this.logger.info('GeoLocationDb.start rw db', result);

    const result2 = await this._dbRo.raw('SELECT 1+1 AS result');
    this.logger.info('GeoLocationDb.start ro db', result2);
  }

  async stop() {
    await this._dbRw.destroy();
    await this._dbRo.destroy();
  }
}
