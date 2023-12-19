import { IBasicService } from '../../types';
import { IConfigService } from '../config/types';
import { IWsMessageProcessor, IWsMessageSender } from '../http-with-ws/types';
import { defaultLogger } from '../logger';
import { ILoggerService } from '../logger/types';

export class ApiService implements IBasicService, IWsMessageProcessor {

  constructor(protected config: IConfigService, protected logger: ILoggerService = defaultLogger) {

  }

  async start(): Promise<void> {

  }

  async stop(): Promise<void> {

  }

  async onMessage(payload: any, sender: IWsMessageSender): Promise<void> {
    this.logger.info('ApiService.onMessage', payload);
    sender.send({ echo: payload });
  }
}