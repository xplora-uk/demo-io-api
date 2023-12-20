import knex from 'knex';
import type { Knex } from 'knex';
import { IConfigService } from '../../config/types';
import { IGeoLocationDb } from './types';
import { ILoggerService } from '../../logger/types';
import { BasicDb } from '../BasicDb';
import { tbl_history_location } from '../../../generated/db/geolocation';

export class GeoLocationDb extends BasicDb implements IGeoLocationDb {
  protected _dbRw: Knex;
  protected _dbRo: Knex;
  constructor(protected config: IConfigService, protected logger: ILoggerService) {
    const _dbRw = knex(config.geoLocationDbRw.knexConfig);
    const _dbRo = knex(config.geoLocationDbRo.knexConfig);
    super(_dbRw, _dbRo, logger);
    this._dbRw = _dbRw;
    this._dbRo = _dbRo;
  }

  repoLocationHistory() {
    return this.repo<tbl_history_location>('tbl_history_location');
  }

  async start() {
    const result = await this._dbRw.column(this._dbRw.raw('1 as connected')).select();
    this.logger.info('GeoLocationDb.start rw db', result);

    const result2 = await this._dbRo.column(this._dbRo.raw('1 as connected')).select();
    this.logger.info('GeoLocationDb.start ro db', result2);
  }

  async stop() {
    await this._dbRw.destroy();
    await this._dbRo.destroy();
  }
}
