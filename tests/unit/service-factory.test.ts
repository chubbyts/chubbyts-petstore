import { Container } from '@chubbyts/chubbyts-dic-types/dist/container';
import { describe, expect, test } from '@jest/globals';
import {
  acceptNegotiationMiddlewareServiceFactory,
  acceptNegotiatorServiceFactory,
  apiErrorMiddlewareServiceFactory,
  cleanDirectoriesCommandServiceFactory,
  contentTypeNegotiationMiddlewareServiceFactory,
  contentTypeNegotiatorServiceFactory,
  decoderServiceFactory,
  encoderServiceFactory,
  errorMiddlewareServiceFactory,
  loggerServiceFactory,
  matchServiceFactory,
  middlewaresServiceFactory,
  mongoClientServiceFactory,
  pingHandlerServiceFactory,
  requestFactoryServiceFactory,
  responseFactoryServiceFactory,
  routeMatcherMiddlewareServiceFactory,
  routesServiceFactory,
  serverRequestFactoryServiceFactory,
  streamFactoryServiceFactory,
  streamFromResourceFactoryServiceFactory,
  uriFactoryServiceFactory,
} from '../../src/service-factory';

jest.mock('mongodb', () => ({
  MongoClient: {
    connect: async () => ({}),
  },
}));

const createGetMock = (givenCalls: Array<[string, unknown]>) => {
  const calls = [...givenCalls];

  return (givenId: string) => {
    const call = calls.shift();
    if (!call) {
      fail('Missing call');
    }

    const [id, service] = call;

    expect(givenId).toBe(id);

    return service;
  };
};

describe('service-factory', () => {
  test('acceptNegotiationMiddlewareServiceFactory', () => {
    const calls: Array<[string, unknown]> = [['acceptNegotiator', {}]];

    const get = jest.fn(createGetMock(calls));

    const container = { get } as unknown as Container;

    expect(acceptNegotiationMiddlewareServiceFactory(container)).toBeInstanceOf(Function);

    expect(get).toHaveBeenCalledTimes(calls.length);
  });

  test('acceptNegotiatorServiceFactory', () => {
    const calls: Array<[string, unknown]> = [['encoder', { contentTypes: ['application/json'] }]];

    const get = jest.fn(createGetMock(calls));

    const container = { get } as unknown as Container;

    expect(acceptNegotiatorServiceFactory(container)).toBeInstanceOf(Object);

    expect(get).toHaveBeenCalledTimes(calls.length);
  });

  test('apiErrorMiddlewareServiceFactory', () => {
    const calls: Array<[string, unknown]> = [
      ['responseFactory', () => undefined],
      ['encoder', {}],
      ['config', { debug: true }],
      ['logger', () => undefined],
    ];

    const get = jest.fn(createGetMock(calls));

    const container = { get } as unknown as Container;

    expect(apiErrorMiddlewareServiceFactory(container)).toBeInstanceOf(Object);

    expect(get).toHaveBeenCalledTimes(calls.length);
  });

  test('cleanDirectoriesCommandServiceFactory', () => {
    const calls: Array<[string, unknown]> = [['config', { directories: new Map([]) }]];

    const get = jest.fn(createGetMock(calls));

    const container = { get } as unknown as Container;

    expect(cleanDirectoriesCommandServiceFactory(container)).toBeInstanceOf(Function);

    expect(get).toHaveBeenCalledTimes(calls.length);
  });

  test('contentTypeNegotiationMiddlewareServiceFactory', () => {
    const calls: Array<[string, unknown]> = [['contentTypeNegotiator', {}]];

    const get = jest.fn(createGetMock(calls));

    const container = { get } as unknown as Container;

    expect(contentTypeNegotiationMiddlewareServiceFactory(container)).toBeInstanceOf(Function);

    expect(get).toHaveBeenCalledTimes(calls.length);
  });

  test('contentTypeNegotiatorServiceFactory', () => {
    const calls: Array<[string, unknown]> = [['decoder', { contentTypes: ['application/json'] }]];

    const get = jest.fn(createGetMock(calls));

    const container = { get } as unknown as Container;

    expect(contentTypeNegotiatorServiceFactory(container)).toBeInstanceOf(Object);

    expect(get).toHaveBeenCalledTimes(calls.length);
  });

  test('decoderServiceFactory', () => {
    expect(decoderServiceFactory()).toBeInstanceOf(Object);
  });

  test('encoderServiceFactory', () => {
    expect(encoderServiceFactory()).toBeInstanceOf(Object);
  });

  test('errorMiddlewareServiceFactory', () => {
    const calls: Array<[string, unknown]> = [
      ['responseFactory', () => undefined],
      ['config', { debug: true }],
      ['logger', () => undefined],
    ];

    const get = jest.fn(createGetMock(calls));

    const container = { get } as unknown as Container;

    expect(errorMiddlewareServiceFactory(container)).toBeInstanceOf(Function);

    expect(get).toHaveBeenCalledTimes(calls.length);
  });

  test('loggerServiceFactory', () => {
    const calls: Array<[string, unknown]> = [
      [
        'config',
        {
          pino: {
            options: {},
            stream: { write: () => undefined },
          },
        },
      ],
    ];

    const get = jest.fn(createGetMock(calls));

    const container = { get } as unknown as Container;

    expect(loggerServiceFactory(container)).toBeInstanceOf(Object);

    expect(get).toHaveBeenCalledTimes(calls.length);
  });

  test('matchServiceFactory', () => {
    const calls: Array<[string, unknown]> = [['routes', []]];

    const get = jest.fn(createGetMock(calls));

    const container = { get } as unknown as Container;

    expect(matchServiceFactory(container)).toBeInstanceOf(Function);

    expect(get).toHaveBeenCalledTimes(calls.length);
  });

  test('middlewaresServiceFactory', () => {
    const calls: Array<[string, unknown]> = [];

    const get = jest.fn(createGetMock(calls));

    const container = { get } as unknown as Container;

    const middlewares = middlewaresServiceFactory(container);

    expect(middlewares).toBeInstanceOf(Array);

    expect(middlewares).toMatchInlineSnapshot(`
      Array [
        [Function],
        [Function],
      ]
    `);

    expect(get).toHaveBeenCalledTimes(calls.length);
  });

  test('mongoClientServiceFactory', async () => {
    const calls: Array<[string, unknown]> = [
      [
        'config',
        {
          mongodb: {
            uri: 'mongodb://localhost',
            indexes: {},
          },
        },
      ],
    ];

    const get = jest.fn(createGetMock(calls));

    const container = { get } as unknown as Container;

    const middlewares = await mongoClientServiceFactory(container);

    expect(middlewares).toBeInstanceOf(Object);

    expect(get).toHaveBeenCalledTimes(calls.length);
  });

  test('pingHandlerServiceFactory', () => {
    const calls: Array<[string, unknown]> = [['responseFactory', () => undefined]];

    const get = jest.fn(createGetMock(calls));

    const container = { get } as unknown as Container;

    expect(pingHandlerServiceFactory(container)).toBeInstanceOf(Function);

    expect(get).toHaveBeenCalledTimes(calls.length);
  });

  test('requestFactoryServiceFactory', () => {
    const calls: Array<[string, unknown]> = [
      ['uriFactory', () => undefined],
      ['streamFactory', () => undefined],
    ];

    const get = jest.fn(createGetMock(calls));

    const container = { get } as unknown as Container;

    expect(requestFactoryServiceFactory(container)).toBeInstanceOf(Function);

    expect(get).toHaveBeenCalledTimes(calls.length);
  });

  test('responseFactoryServiceFactory', () => {
    const calls: Array<[string, unknown]> = [['streamFactory', () => undefined]];

    const get = jest.fn(createGetMock(calls));

    const container = { get } as unknown as Container;

    expect(responseFactoryServiceFactory(container)).toBeInstanceOf(Function);

    expect(get).toHaveBeenCalledTimes(calls.length);
  });

  test('routeMatcherMiddlewareServiceFactory', () => {
    const calls: Array<[string, unknown]> = [['match', () => undefined]];

    const get = jest.fn(createGetMock(calls));

    const container = { get } as unknown as Container;

    expect(routeMatcherMiddlewareServiceFactory(container)).toBeInstanceOf(Function);

    expect(get).toHaveBeenCalledTimes(calls.length);
  });

  test('routesServiceFactory', () => {
    const calls: Array<[string, unknown]> = [];

    const get = jest.fn(createGetMock(calls));

    const container = { get } as unknown as Container;

    const routes = routesServiceFactory(container);

    expect(routes).toBeInstanceOf(Array);

    expect(routes).toMatchInlineSnapshot(`
      Array [
        Object {
          "_route": "Route",
          "attributes": Object {},
          "handler": [Function],
          "method": "GET",
          "middlewares": Array [],
          "name": "ping",
          "path": "/ping",
          "pathOptions": Object {},
        },
      ]
    `);

    expect(get).toHaveBeenCalledTimes(calls.length);
  });

  test('serverRequestFactoryServiceFactory', () => {
    const calls: Array<[string, unknown]> = [['requestFactory', () => undefined]];

    const get = jest.fn(createGetMock(calls));

    const container = { get } as unknown as Container;

    expect(serverRequestFactoryServiceFactory(container)).toBeInstanceOf(Function);

    expect(get).toHaveBeenCalledTimes(calls.length);
  });

  test('streamFactoryServiceFactory', () => {
    expect(streamFactoryServiceFactory()).toBeInstanceOf(Function);
  });

  test('streamFromResourceFactoryServiceFactory', () => {
    expect(streamFromResourceFactoryServiceFactory()).toBeInstanceOf(Function);
  });

  test('uriFactoryServiceFactory', () => {
    expect(uriFactoryServiceFactory()).toBeInstanceOf(Function);
  });
});
