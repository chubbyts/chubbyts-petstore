import type { IncomingMessage, Server, ServerResponse } from 'node:http';
import { createServer } from 'node:http';
import { createApplication } from '@chubbyts/chubbyts-framework/application';
import {
  createNodeRequestToServerRequestFactory,
  createResponseToNodeResponseEmitter,
} from '@chubbyts/chubbyts-http-node/node';
import type { ServerRequestFactory, UriFactory } from '@chubbyts/chubbyts-http-types/message-factory';
import type { ServerRequestHelpers } from '@chubbyts/chubbyts-http-types/message-helper';
import type { Middleware } from '@chubbyts/chubbyts-http-types/middleware';
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

  const nodeRequestToServerRequestFactory = createNodeRequestToServerRequestFactory(
    container.get<UriFactory>('uriFactory'),
    container.get<ServerRequestFactory>('serverRequestFactory'),
    container.get<ServerRequestHelpers>('serverRequestHelpers'),
    baseUrl,
    requestBodyTimeoutMs,
  );
  const responseToNodeResponseEmitter = createResponseToNodeResponseEmitter(responseSendTimeoutMs);

  const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    try {
      const serverRequest = nodeRequestToServerRequestFactory(req, res);
      const response = await app(serverRequest);
      responseToNodeResponseEmitter(response, res);
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
