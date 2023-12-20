// shared types here

import { Knex } from "knex";

export type IProcessEnv = typeof process.env;

export interface IProcessEnvForIoApi extends IProcessEnv {
  HTTP_PORT?: string;

  CORE_RW_DB_URL?: string;
  CORE_RW_DB_POOL_MIN?: string;
  CORE_RW_DB_POOL_MAX?: string;

  CORE_RO_DB_URL?: string;
  CORE_RO_DB_POOL_MIN?: string;
  CORE_RO_DB_POOL_MAX?: string;

  FCM_RW_DB_URL?: string;
  FCM_RW_DB_POOL_MIN?: string;
  FCM_RW_DB_POOL_MAX?: string;

  FCM_RO_DB_URL?: string;
  FCM_RO_DB_POOL_MIN?: string;
  FCM_RO_DB_POOL_MAX?: string;
  
  GEO_LOCATION_RW_DB_URL?: string;
  GEO_LOCATION_RW_DB_POOL_MIN?: string;
  GEO_LOCATION_RW_DB_POOL_MAX?: string;

  GEO_LOCATION_RO_DB_URL?: string;
  GEO_LOCATION_RO_DB_POOL_MIN?: string;
  GEO_LOCATION_RO_DB_POOL_MAX?: string;
}

export interface IStartableService {
  start(): Promise<void>;
}
export interface IStopableService {
  stop(): Promise<void>;
}
export type IBasicService = IStartableService & IStopableService;
