import { IDbDto } from '../../../services/db/types';

export interface tbl_user extends IDbDto {
  id: number;
  rid: string;
}
