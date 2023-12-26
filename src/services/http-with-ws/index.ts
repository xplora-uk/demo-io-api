import { createServer, Server } from 'http';
import { RawData, WebSocket, WebSocketServer } from 'ws';
import { IConfigService } from '../config/types';
import { ILoggerService } from '../logger/types';
import { IHttpWithWsService, IJsonProcessor, IWsMessageProcessor, IWsMessageSender } from './types';
import { IPayloadAdapter } from '../payload-adapter/types';

const METHODS_WITH_BODY = ['POST', 'PUT', 'PATCH'];
const contentTypeText = { 'Content-Type': 'text/plain' };
const contentTypeJson = { 'Content-Type': 'application/json' };

export class HttpWithWsService implements IHttpWithWsService {

  protected httpServer: Server;

  protected wsServer: WebSocketServer;

  constructor(
    protected config: IConfigService,
    protected logger: ILoggerService,
    protected payloadAdapter: IPayloadAdapter,
    protected msgProcessor: IWsMessageProcessor,
    protected jsonProcessor?: IJsonProcessor,
  ) {
    this.httpServer = createServer((req, res) => {
      
      function root() {
        // just to say server is running
        res.writeHead(200, contentTypeText);
        res.end('okay');
      }

      const reqMethod = String(req.method || 'GET').toUpperCase();
      const reqUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);

      if (METHODS_WITH_BODY.includes(reqMethod) && this.jsonProcessor) {

        const input: Buffer[] = [];

        req.on('error', (err) => {
          logger.warn('HttpWithWsService: req.error', err);
          res.writeHead(400, contentTypeText);
          res.end('error on request');
        });

        req.on('data', (chunk) => {
          input.push(chunk);
        });

        req.on('end', () => {
          let payloadBuffer = Buffer.concat(input);
          input.length = 0; // remove from memory
          let payloadText = '';
          let payloadObj: unknown = {};
          payloadText = payloadBuffer.toString('utf8');

          const contentType = String(req.headers['content-type'] || '');
          if (contentType.includes('application/json')) {
            payloadBuffer = Buffer.from(''); // remove from memory
            try {
              payloadObj = JSON.parse(payloadText);
            } catch (err) {
              logger.warn('HttpWithWsService: req.body JSON.parse error', err);
              res.writeHead(400, contentTypeJson);
              res.end({ error: 'bad json request' });
              return;
            }
            payloadText = ''; // remove from memory
            if (this.jsonProcessor) {
              this.jsonProcessor({ payload: payloadObj, method: reqMethod, url: reqUrl })
                .then((result) => {
                  const payloadJson = JSON.stringify(result);
                  res.writeHead(200, contentTypeJson);
                  res.end(payloadJson);
                })
                .catch((err) => {
                  logger.warn('HttpWithWsService: req.body jsonProcessor error', err);
                  res.writeHead(500, contentTypeJson);
                  res.end({ error: 'server error' });
                });
            } else {
              logger.warn('HttpWithWsService: req.body jsonProcessor not defined');
              res.writeHead(500, contentTypeJson);
              res.end({ error: 'server error' });
            }
          } else {
            logger.warn('HttpWithWsService: req.body unknown content-type', contentType);
            res.writeHead(400, contentTypeText);
            res.end('unknown content-type');
          }
        });
      }

      if (req.url === '/' || reqMethod === 'GET') {
        return root();
      }

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