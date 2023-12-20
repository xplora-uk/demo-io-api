import { tbl_user } from '../../../generated/db/core';
import { IBasicService } from '../../../types';
import { IBasicDbRepo } from '../types';

export interface ICoreDb extends IBasicService {
  repoUser(): IBasicDbRepo<tbl_user>;
}
