import { IBasicDbService, IBasicDbRepo, IDbDto, IdType, RidType, ISelectOneOptions, ISelectManyOptions } from './types';

export class BasicDbRepo<TRow extends IDbDto = IDbDto> implements IBasicDbRepo<TRow> {
  
  constructor(
    public db: IBasicDbService,
    public tableName: string,
  ) {
    
  }

  selectMany(options: ISelectManyOptions) {
    let { columns = '*', criteria = {}, orderBy = 'id', orderDir = 'asc', limit = 1000, offset = 0, sender, originalPayload = {} } = options;
    if (limit > 1000) limit = 1000;
    const { meta = {} } = originalPayload || {};
    return this.db.dbRo()
      .select(columns)
      .from<TRow>(this.tableName)
      .where(criteria)
      .orderBy(orderBy, orderDir)
      .limit(limit)
      .offset(offset)
      .stream((stream) => {
        stream.on('data', (row) => {
          sender.send({ meta, data: row });
        });
        stream.on('error', (err) => {
          sender.send({ meta: { ...meta, last: true }, data: null, error: err });
        });
        stream.on('end', () => {
          sender.send({ meta: { ...meta, last: true }, data: null });
        });
      });
  }

  selectOne(options: ISelectOneOptions) {
    const { columns = '*', criteria = {}, orderBy = 'id', orderDir = 'asc' } = options;
    return this.db.dbRo()
      .select(columns)
      .from<TRow>(this.tableName)
      .where(criteria)
      .orderBy(orderBy, orderDir)
      .first();
  }

  insertOne(data: Partial<TRow>) {
    return this.db.dbRw()(this.tableName).insert(data);
  }

  updateById(id: IdType, data: Partial<TRow>) {
    return this.db.dbRw()(this.tableName).where({ id }).update(data);
  }

  updateByRid(rid: RidType, data: Partial<TRow>) {
    return this.db.dbRw()(this.tableName).where({ rid }).update(data);
  }

  deleteById(id: IdType) {
    return this.db.dbRw()(this.tableName).where({ id }).del();
  }

  deleteByRid(rid: RidType) {
    return this.db.dbRw()(this.tableName).where({ rid }).del();
  }
}
