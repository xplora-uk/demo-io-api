import knex from 'knex';
import type { Knex } from 'knex';
import { IConfigService } from '../../config/types';
import { IFcmDb } from './types';
import { ILoggerService } from '../../logger/types';
import { BasicDb } from '../BasicDb';

export class FcmDb extends BasicDb implements IFcmDb {
  protected _dbRw: Knex;
  protected _dbRo: Knex;
  constructor(protected config: IConfigService, protected logger: ILoggerService) {
    const _dbRw = knex(config.fcmDbRw.knexConfig);
    const _dbRo = knex(config.fcmDbRo.knexConfig);
    super(_dbRw, _dbRo, logger);
    this._dbRw = _dbRw;
    this._dbRo = _dbRo;
  }

  async start() {
    const result = await this._dbRw.column(this._dbRw.raw('1 as connected')).select();
    this.logger.info('FcmDb.start rw db', result);

    const result2 = await this._dbRo.column(this._dbRo.raw('1 as connected')).select();
    this.logger.info('FcmDb.start ro db', result2);
  }

  async stop() {
    await this._dbRw.destroy();
    await this._dbRo.destroy();
  }
}
