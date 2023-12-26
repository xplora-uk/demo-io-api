import { DtoUser } from '../../../generated/db/core';
import { BasicDbRepo } from '../BasicDbRepo';
import { IBasicDbService } from '../types';

export class UserRepo extends BasicDbRepo<DtoUser> {
  constructor(db: IBasicDbService, tableName = 'tbl_user') {
    super(db, tableName);
  }
}
