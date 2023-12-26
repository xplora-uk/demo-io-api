import { Knex } from 'knex';
import { ILoggerService } from '../logger/types';
import { IBasicDbRepo, IBasicDbService, IDbDto } from './types';
import { BasicDbRepo } from './BasicDbRepo';

export class BasicDb implements IBasicDbService {
  name = 'BasicDb';
  protected _repoCache = new Map<string, IBasicDbRepo<any>>();
  constructor(
    protected _dbRw: Knex,
    protected _dbRo: Knex,
    protected logger: ILoggerService,
  ) {
    
  }

  dbRw() {
    return this._dbRw;
  }

  dbRo() {
    return this._dbRo;
  }

  repo<TDto extends IDbDto = IDbDto>(tableName: string, onCreate: IBasicDbRepo<TDto> = new BasicDbRepo<TDto>(this, tableName)): IBasicDbRepo<TDto> {
    if (!this._repoCache.has(tableName)) {
      this._repoCache.set(tableName, onCreate);
    }
    return this._repoCache.get(tableName) as IBasicDbRepo<TDto>; // pretending but it's ok
  }

  async start() {
    const result = await this._dbRw.raw('SELECT 1+1 AS result');
    this.logger.info(this.name + '.start rw db', result);

    const result2 = await this._dbRo.raw('SELECT 1+1 AS result');
    this.logger.info(this.name + '.start ro db', result2);
  }

  async stop() {
    await this._dbRw.destroy();
    await this._dbRo.destroy();
  }
}
