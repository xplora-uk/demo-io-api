import { createServer, Server } from 'http';
import { RawData, WebSocket, WebSocketServer } from 'ws';
import { IConfigService } from '../config/types';
import { ILoggerService } from '../logger/types';
import { IHttpWithWsService, IWsMessageProcessor, IWsMessageSender } from './types';
import { IPayloadAdapter } from '../payload-adapter/types';

export class HttpWithWsService implements IHttpWithWsService {

  protected httpServer: Server;

  protected wsServer: WebSocketServer;

  constructor(
    protected config: IConfigService,
    protected logger: ILoggerService,
    protected payloadAdapter: IPayloadAdapter,
    protected msgProcessor: IWsMessageProcessor,
  ) {
    this.httpServer = createServer((_req, res) => {
      // just to say server is running
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('okay');
    });
    this.wsServer = new WebSocketServer({
      server: this.httpServer,
    });
  }

  _onWsMessage = (ws: WebSocket, message: RawData, isBinary: boolean) => {
    const { logger, payloadAdapter, msgProcessor } = this;
    logger.info('HttpWithWsService._onWsMessage...', { isBinary });
    if (message instanceof Buffer) {

      const payload = payloadAdapter.decode(message);
      logger.info('HttpWithWsService._onWsMessage...', payload);
      const sender: IWsMessageSender = {
        send: async (msg: any) => ws.send(payloadAdapter.encode(msg)),
      };
      msgProcessor.onMessage(payload, sender);

    } else {
      logger.warn('HttpWithWsService._onWsMessage: message is not a Buffer');
    }
  }

  _onWsConnection = (ws: WebSocket) => {
    const { logger, _onWsMessage } = this;
    logger.info('HttpWithWsService._onWsConnection...');
    ws.on('message', (message: RawData, isBinary: boolean) => {
      _onWsMessage(ws, message, isBinary);
    });
  }

  _onWsError = (err: any) => {
    this.logger.info('HttpWithWsService._onWsError...', err);
  }

  async start() {
    const { config, logger, httpServer, wsServer, _onWsConnection, _onWsError } = this;
    logger.info('HttpWithWsService.start...');
    await new Promise((resolve, _reject) => {
      httpServer.listen(config.http.port, () => {
        logger.info('HttpWithWsService started on port', this.config.http.port);
        wsServer.on('connection', _onWsConnection);
        wsServer.on('error', _onWsError);
        resolve(null);
      });
    });
  }

  async stop() {
    const { logger } = this;
    logger.info('HttpWithWsService.stop...');
    await new Promise((resolve, _reject) => {
      this.httpServer.close(() => {
        logger.info('HttpWithWsService.stopped');
        resolve(null);
      });
    });
  }
}