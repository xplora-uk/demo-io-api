import { IProcessEnvForIoApi } from '../../types';

export interface IEnvService {
  penv: IProcessEnvForIoApi;
  keyPrefix: string;
  str(key: string, def?: string, keyPrefix?: string): string;
  int(key: string, def?: number, keyPrefix?: string): number;
  float(key: string, def?: number, keyPrefix?: string): number;
  bool(key: string, def?: boolean, keyPrefix?: string): boolean;
}
