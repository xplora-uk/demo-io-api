import { pack, unpack } from 'msgpackr';
import { IPayloadAdapter } from './types';

export class MsgPackPayloadAdapter implements IPayloadAdapter {

  encode(payload: any): Buffer {
    return pack(payload);
  }

  decode<T = any>(payloadBuffer: Buffer): T {
    return unpack(payloadBuffer) as T; // TODO: pretending to be T
  }
}
