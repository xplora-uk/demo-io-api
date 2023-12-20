import { ConfigService } from '../config';
import { CoreDb } from '../db/core';
import { FcmDb } from '../db/fcm';
import { GeoLocationDb } from '../db/geolocation';
import { EnvService } from '../env';
import { IProcessEnvForIoApi } from '../../types';
import { defaultLogger } from '../logger';
import { HttpWithWsService } from '../http-with-ws';
import { MsgPackPayloadAdapter } from '../payload-adapter';
import { ApiService } from '../api';


export async function factory(penv: IProcessEnvForIoApi = process.env) {
  let   logger = defaultLogger;
  const env    = new EnvService(penv, logger, '');
  const config = new ConfigService(env, logger);

  // TODO: can change logger based on config

  const coreDb        = new CoreDb(config, logger);
  const fcmDb         = new FcmDb(config, logger);
  const geoLocationDb = new GeoLocationDb(config, logger);

  const payloadAdapter = new MsgPackPayloadAdapter();
  const apiService     = new ApiService(config, logger, coreDb, fcmDb, geoLocationDb);
  const httpWithWs     = new HttpWithWsService(config, logger, payloadAdapter, apiService);

  async function start() {
    logger.info('starting all services...');
    return Promise.all([
      coreDb.start(),
      fcmDb.start(),
      geoLocationDb.start(),
      apiService.start(),
      httpWithWs.start(),
    ]).then(() => {
      logger.info('starting all services... done!');
    });
  }

  async function stop() {
    logger.info('stopping all services...');
    await httpWithWs.stop();
    await apiService.stop();
    await coreDb.stop();
    await fcmDb.stop();
    await geoLocationDb.stop();
    logger.info('stopping all services... done!');
  }

  return {
    env,
    config,
    coreDb,
    fcmDb,
    geoLocationDb,
    apiService,
    payloadAdapter,
    httpWithWs,
    start,
    stop,
  };
}
