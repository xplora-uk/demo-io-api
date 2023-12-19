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
  const env    = new EnvService(penv, logger);
  const config = new ConfigService(env, logger);

  // TODO: can change logger based on config

  const coreDb        = new CoreDb(config, logger);
  const fcmDb         = new FcmDb(config, logger);
  const geoLocationDb = new GeoLocationDb(config, logger);

  const payloadAdapter = new MsgPackPayloadAdapter();
  const apiService     = new ApiService(config, logger);
  const httpWithWs     = new HttpWithWsService(config, logger, payloadAdapter, apiService);

  async function start() {
    await coreDb.start();
    await fcmDb.start();
    await geoLocationDb.start();
  }

  async function stop() {
    await coreDb.stop();
    await fcmDb.start();
    await geoLocationDb.stop();
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
