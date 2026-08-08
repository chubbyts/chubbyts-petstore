import type { IncomingMessage, Server, ServerResponse } from 'http';
import { createServer } from 'http';
import { createApplication } from '@chubbyts/chubbyts-framework/dist/application';
import {
  createNodeRequestToUndiciRequestFactory,
  createUndiciResponseToNodeResponseEmitter,
} from '@chubbyts/chubbyts-undici-server-node/dist/node';
import type { Middleware } from '@chubbyts/chubbyts-undici-server/dist/server';
import type { Config } from '../config/production.js';
import { containerFactory } from '../bootstrap/container.js';

const shutdownServer = (server: Server) => {
  server.close((err) => {
    if (err) {
      console.warn(`Shutdown server with error: ${err}`);
      process.exit(1);
    }

    console.log('Shutdown server');
    process.exit(0);
  });
};

(async () => {
  const container = await containerFactory(process.env.NODE_ENV as string);

  const app = createApplication(container.get<Array<Middleware>>('middlewares'));

  const config = container.get<Config>('config');

  const { port, host, baseUrl, requestBodyTimeoutMs, responseSendTimeoutMs } = config.server;

  const nodeRequestToUndiciRequestFactory = createNodeRequestToUndiciRequestFactory(baseUrl, requestBodyTimeoutMs);
  const undiciResponseToNodeResponseEmitter = createUndiciResponseToNodeResponseEmitter(responseSendTimeoutMs);

  const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    try {
      undiciResponseToNodeResponseEmitter(await app(nodeRequestToUndiciRequestFactory(req)), res);
    } catch (error) {
      console.error(`Failed to handle request: ${error}`);

      // once headers are sent the response cannot be turned into a 500 anymore:
      // destroying the socket is the only way to signal the failure to the client
      if (res.headersSent) {
        res.destroy(error instanceof Error ? error : new Error(String(error)));

        return;
      }

      res.writeHead(500, { 'content-type': 'text/plain' }).end('Internal Server Error');
    }
  });

  server.listen(port, host, () => {
    console.log(`Listening to ${host}:${port}`);
  });

  process.on('SIGINT', () => shutdownServer(server));
  process.on('SIGTERM', () => shutdownServer(server));
})();
