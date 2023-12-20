import { IBasicService } from '../../types';
import { IConfigService } from '../config/types';
import { ICoreDb } from '../db/core/types';
import { IFcmDb } from '../db/fcm/types';
import { IGeoLocationDb } from '../db/geolocation/types';
import { IEnvService } from '../env/types';
import { IHttpWithWsService } from '../http-with-ws/types';
import { IPayloadAdapter } from '../payload-adapter/types';

export interface IFactory extends IBasicService {
  env          : IEnvService;
  config       : IConfigService;
  coreDb       : ICoreDb;
  fcmDb        : IFcmDb;
  geoLocationDb: IGeoLocationDb;
  httpWithWs   : IHttpWithWsService;
  payloadAdaper: IPayloadAdapter;
}
