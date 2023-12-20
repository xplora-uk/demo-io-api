import { IBasicService } from '../../types';
import { IConfigService } from '../config/types';
import { ICoreDb } from '../db/core/types';
import { IFcmDb } from '../db/fcm/types';
import { IGeoLocationDb } from '../db/geolocation/types';
import { IWsMessageProcessor, IWsMessageSender } from '../http-with-ws/types';
import { ILoggerService } from '../logger/types';

export class ApiService implements IBasicService, IWsMessageProcessor {

  constructor(
    protected config: IConfigService,
    protected logger: ILoggerService,
    protected coreDb: ICoreDb,
    protected fcmDb: IFcmDb,
    protected geoLocationDb: IGeoLocationDb,
  ) {

  }

  async start(): Promise<void> {

  }

  async stop(): Promise<void> {

  }

  async onMessage(payload: any, sender: IWsMessageSender): Promise<void> {
    this.logger.info('ApiService.onMessage', payload);
    const { meta = {} } = payload;
    const { id, cmd } = meta;
    switch (cmd) {
      case 'echo': await this.cmd_echo(payload, sender); break;
      case 'select_user': await this.cmd_select_user(payload, sender); break;
      case 'select_users': await this.cmd_select_users(payload, sender); break;
      default: sender.send({ id, error: 'unknown command' }); break;
    }
  }

  async cmd_echo(payload: any, sender: IWsMessageSender): Promise<void> {
    return sender.send(payload);
  }

  async cmd_select_user(payload: any, sender: IWsMessageSender): Promise<void> {
    const { meta = {}, data = {} } = payload;
    // criteria can be { id: 1 } or { rid: 'abc123' }
    const { columns = '*', offset = 0, limit = 10, criteria = {}, orderBy = 'id', orderDir = 'asc' } = data || {};
    const user = await this.coreDb.repoUser().selectOne({ columns, criteria, orderBy, orderDir, offset, limit });
    sender.send({ meta: { ...meta, last: true }, data: user });
  }

  async cmd_select_users(payload: any, sender: IWsMessageSender): Promise<void> {
    const { data = {} } = payload;
    const { columns = '*', offset = 0, limit = 10, criteria = {}, orderBy = 'id', orderDir = 'asc' } = data || {};
    return this.coreDb.repoUser().selectMany({
      columns,
      criteria,
      orderBy,
      orderDir,
      offset,
      limit,
      originalPayload: payload,
      sender,
    });
  }
}