export interface IPayloadAdapter {
  encode(payload: any): Buffer;
  decode<T = any>(payloadBuffer: Buffer): T
}
