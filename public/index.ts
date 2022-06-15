import { createApplication } from '@chubbyts/chubbyts-framework/dist/application';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import {
  createNodeToServerRequestFactory,
  createResponseToNodeEmitter,
} from '@chubbyts/chubbyts-framework/dist/server/node-http';
import container from '../bootstrap/container';
import { Middleware } from '@chubbyts/chubbyts-http-types/dist/middleware';
import {
  ServerRequestFactory,
  StreamFromResourceFactory,
  UriFactory,
} from '@chubbyts/chubbyts-http-types/dist/message-factory';
import { Config } from '../config/prod';

const boostrapedContainer = container(process.env.APP_ENV ?? 'dev');

const config = boostrapedContainer.get<Config>('config');

const app = createApplication(boostrapedContainer.get<Array<Middleware>>('middlewares'));

const nodeToServerRequestFactory = createNodeToServerRequestFactory(
  boostrapedContainer.get<UriFactory>('uriFactory'),
  boostrapedContainer.get<ServerRequestFactory>('serverRequestFactory'),
  boostrapedContainer.get<StreamFromResourceFactory>('streamFromResourceFactory'),
);

const responseToNodeEmitter = createResponseToNodeEmitter();

const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
  responseToNodeEmitter(await app(nodeToServerRequestFactory(req)), res);
});

const { port, host } = config.server;

server.listen(port, host, () => {
  console.log(`Listening to ${host}:${port}`);
});
