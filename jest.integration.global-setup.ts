import { spawn } from 'child_process';
import { MongoMemoryServer } from 'mongodb-memory-server';
import fetch from 'cross-fetch';
import { build } from './build';

const getRandomInt = (min: number, max: number) => {
  const ceiledMin = Math.ceil(min);
  const flooredMax = Math.floor(max);
  return Math.floor(Math.random() * (flooredMax - ceiledMin + 1)) + ceiledMin;
};

const testServerHost = '127.0.0.1';
const testServerPort = getRandomInt(49152, 65535).toString();

const timeout = 20000;
const iterationTimeout = 500;

const startServer = async () => {
  await build();

  const child = spawn(process.argv[0], ['dist/bootstrap/index.js'], {
    env: {
      NODE_ENV: 'jest',
      MONGO_URI: process.env.MONGO_URI,
      SERVER_HOST: testServerHost,
      SERVER_PORT: testServerPort,
    },
    detached: true,
  }).once('error', (e) => {
    throw e;
  });

  // eslint-disable-next-line functional/no-let
  for (let i = timeout; i > 0; i -= iterationTimeout) {
    try {
      await fetch(`http://${testServerHost}:${testServerPort}`);
      return child;
    } catch (e) {
      if (e.code === 'ECONNREFUSED') {
        console.log('wait for test server to be up and running...');
        await new Promise((resolve) => setTimeout(resolve, iterationTimeout));
      } else {
        throw e;
      }
    }
  }

  throw new Error('Timeout in starting the server');
};

const setup = async () => {
  if (!global.__MONGO_SERVER__) {
    // eslint-disable-next-line functional/immutable-data
    global.__MONGO_SERVER__ = await MongoMemoryServer.create({
      instance: {
        dbName: 'jest',
      },
      binary: {
        version: '6.0.11',
      },
    });
    // eslint-disable-next-line functional/immutable-data
    process.env.MONGO_URI = global.__MONGO_SERVER__.getUri();
  }

  if (!global.__HTTP_SERVER__) {
    // eslint-disable-next-line functional/immutable-data
    global.__HTTP_SERVER__ = await startServer();
    // eslint-disable-next-line functional/immutable-data
    process.env.HTTP_URI = `http://${testServerHost}:${testServerPort}`;
  }

  console.log(
    JSON.stringify(
      {
        HTTP_URI: process.env.HTTP_URI,
        MONGO_URI: process.env.MONGO_URI,
      },
      null,
      2,
    ),
  );
};

export default setup;
