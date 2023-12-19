import type { Knex } from 'knex';
import { IEnvService } from '../env/types';

export interface IConfigService {
  env: IEnvService;

  http: {
    port: number;
  };

  coreDbRw       : IDbConfig;
  coreDbRo       : IDbConfig;
  fcmDbRw        : IDbConfig;
  fcmDbRo        : IDbConfig;
  geoLocationDbRw: IDbConfig;
  geoLocationDbRo: IDbConfig;
}

export interface IDbConfig {
  knexConfig: Knex.Config;
}
