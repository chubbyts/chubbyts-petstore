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

  const nodeRequestToUndiciRequestFactory = createNodeRequestToUndiciRequestFactory();
  const undiciResponseToNodeResponseEmitter = createUndiciResponseToNodeResponseEmitter();

  const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    undiciResponseToNodeResponseEmitter(await app(nodeRequestToUndiciRequestFactory(req)), res);
  });

  const config = container.get<Config>('config');

  const { port, host } = config.server;

  server.listen(port, host, () => {
    console.log(`Listening to ${host}:${port}`);
  });

  process.on('SIGINT', () => shutdownServer(server));
  process.on('SIGTERM', () => shutdownServer(server));
})();
