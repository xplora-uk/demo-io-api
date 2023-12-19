import { IBasicService } from '../../types';

export interface IHttpWithWsService extends IBasicService {
  
}

export interface IWsMessageProcessor {
  onMessage(payload: any, sender: IWsMessageSender): Promise<void>;
}

export interface IWsMessageSender {
  send(payload: any): Promise<void>;
}
