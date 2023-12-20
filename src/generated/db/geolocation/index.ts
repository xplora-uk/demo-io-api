import { IDbDto } from '../../../services/db/types';

export interface tbl_history_location extends IDbDto {
  id: number;
  rid: string;
}
