import knex from 'knex';
import { Knex } from 'knex';
import { IConfigService } from '../../config/types';
import { ICoreDb } from './types';
import { ILoggerService } from '../../logger/types';
import { BasicDb } from '../BasicDb';
import { tbl_user } from '../../../generated/db/core';

export class CoreDb extends BasicDb implements ICoreDb {
  protected _dbRw: Knex;
  protected _dbRo: Knex;
  constructor(protected config: IConfigService, protected logger: ILoggerService) {
    const _dbRw = knex(config.coreDbRw.knexConfig);
    const _dbRo = knex(config.coreDbRo.knexConfig);
    super(_dbRw, _dbRo, logger);
    this._dbRw = _dbRw;
    this._dbRo = _dbRo;
  }

  repoUser() {
    return this.repo<tbl_user>('tbl_user');
  }

  async start() {
    const result = await this._dbRw.column(this._dbRw.raw('1 as connected')).select();
    this.logger.info('CoreDb.start rw db', result);

    const result2 = await this._dbRo.column(this._dbRo.raw('1 as connected')).select();
    this.logger.info('CoreDb.start ro db', result2);
  }

  async stop() {
    await this._dbRw.destroy();
    await this._dbRo.destroy();
  }
}
