/* eslint-disable functional/no-let */

import type { ChildProcessWithoutNullStreams } from 'child_process';
import { spawn } from 'child_process';
import { MongoMemoryServer } from 'mongodb-memory-server';
import fetch from 'cross-fetch';

const getRandomInt = (min, max) => {
  const ceiledMin = Math.ceil(min);
  const flooredMax = Math.floor(max);
  return Math.floor(Math.random() * (flooredMax - ceiledMin + 1)) + ceiledMin;
};

const testServerHost = '127.0.0.1';
const testServerPort = getRandomInt(49152, 65535);

const timeout = 20000;
const iterationTimeout = 500;

const startServer = async () => {
  const child = spawn('./node_modules/.bin/tsx', ['bootstrap/index.ts'], {
    env: {
      ...process.env,
      NODE_ENV: 'test',
      MONGO_URI: process.env.MONGO_URI,
      SERVER_HOST: testServerHost,
      SERVER_PORT: `${testServerPort}`,
    },
    detached: true,
  }).once('error', (e) => {
    throw e;
  });

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

let mongoServer: MongoMemoryServer;

let httpServer: ChildProcessWithoutNullStreams;

export const setup = async () => {
  mongoServer = await MongoMemoryServer.create({
    instance: {
      dbName: 'test',
    },
    binary: {
      version: '7.0.16',
    },
  });

  // eslint-disable-next-line functional/immutable-data
  process.env.MONGO_URI = mongoServer.getUri();

  httpServer = await startServer();

  // eslint-disable-next-line functional/immutable-data
  process.env.HTTP_URI = `http://${testServerHost}:${testServerPort}`;
};

export const teardown = async () => {
  await httpServer.kill();
  await mongoServer.stop();
};
