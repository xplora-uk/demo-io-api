import { PassThrough as StreamPassThrough } from 'node:stream';
import { Knex } from 'knex';
import { IBasicService } from '../../types';
import { IWsMessageSender } from '../http-with-ws/types';

export type IdType = number;
export type RidType = string;
export type IDbDtoScalar = string | number | boolean | null | Object; // Object is for JSON fields
export type IDbDto = Record<string, IDbDtoScalar>;

export interface IBasicDbService extends IBasicService {
  name: string;
  dbRw(): Knex;
  dbRo(): Knex;
  repo<TDto extends IDbDto>(tableName: string, onCreate: IBasicDbRepo<TDto>): IBasicDbRepo<TDto>;
}

export interface ISharedSelectOptions {
  columns ?: string[] | string;
  criteria?: any;
  limit   ?: number;
  offset  ?: number;
  orderBy ?: string;
  orderDir?: 'asc' | 'desc';

  // payload received by API, we can inject 'meta' as it is for correlation of responses
  originalPayload?: any;
}

export type ISelectOneOptions = ISharedSelectOptions;

export interface ISelectManyOptions extends ISharedSelectOptions {
  //streamReader: IStreamReader;
  sender: IWsMessageSender;
}

export interface IStreamReader {
  (stream: StreamPassThrough): void;
}

export interface IBasicDbRepo<TRow extends IDbDto = IDbDto> {
  db: IBasicDbService;
  tableName: string;
  selectMany(options: ISelectManyOptions): Promise<any>;
  selectOne(options: ISelectOneOptions): Knex.QueryBuilder<TRow>;
  insertOne(data: Partial<TRow>): Knex.QueryBuilder<TRow>;
  updateById(id: IdType, data: Partial<TRow>): Knex.QueryBuilder<TRow>;
  updateByRid(rid: RidType, data: Partial<TRow>): Knex.QueryBuilder<TRow>;
  deleteById(id: IdType): Knex.QueryBuilder;
  deleteByRid(rid: RidType): Knex.QueryBuilder;
}
