import { createApplication } from '@chubbyts/chubbyts-framework/dist/application';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import {
  createNodeToServerRequestFactory,
  createResponseToNodeEmitter,
} from '@chubbyts/chubbyts-node-http-bridge/dist/node-http';
import containerFactory from '../bootstrap/container';
import { Middleware } from '@chubbyts/chubbyts-http-types/dist/middleware';
import {
  ServerRequestFactory,
  StreamFromResourceFactory,
  UriFactory,
} from '@chubbyts/chubbyts-http-types/dist/message-factory';
import { Config } from '../config/production';

const container = containerFactory(process.env.NODE_ENV as string);

const config = container.get<Config>('config');

const app = createApplication(container.get<Array<Middleware>>('middlewares'));

const nodeToServerRequestFactory = createNodeToServerRequestFactory(
  container.get<UriFactory>('uriFactory'),
  container.get<ServerRequestFactory>('serverRequestFactory'),
  container.get<StreamFromResourceFactory>('streamFromResourceFactory'),
);

const responseToNodeEmitter = createResponseToNodeEmitter();

const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
  responseToNodeEmitter(await app(nodeToServerRequestFactory(req)), res);
});

const { port, host } = config.server;

server.listen(port, host, () => {
  console.log(`Listening to ${host}:${port}`);
});
