/* eslint-disable functional/no-let */

import type { ChildProcessWithoutNullStreams } from 'child_process';
import { exec, execSync, spawn } from 'child_process';
import fetch from 'cross-fetch';
import { Client } from 'pg';
import { parse } from 'pg-connection-string';

const getRandomInt = (min: number, max: number) => {
  const ceiledMin = Math.ceil(min);
  const flooredMax = Math.floor(max);
  return Math.floor(Math.random() * (flooredMax - ceiledMin + 1)) + ceiledMin;
};

const testServerHost = '127.0.0.1';
const testServerPort = getRandomInt(49152, 65535);

const timeout = 20000;
const iterationTimeout = 500;

const startServer = async () => {
  const { database, ...postgresConfig } = parse(process.env.POSTGRES_URI_TEST as string);

  const postgresClient = new Client(postgresConfig);
  await postgresClient.connect();
  await postgresClient.query(`DROP DATABASE IF EXISTS "${database}"`);
  await postgresClient.query(`CREATE DATABASE "${database}"`);

  execSync('./node_modules/.bin/drizzle-kit push', {
    env: {
      ...process.env,
      NODE_ENV: 'test',
      POSTGRES_URI: process.env.POSTGRES_URI_TEST,
    },
    stdio: 'inherit',
  });

  const child = spawn('./node_modules/.bin/tsx', ['bootstrap/index.ts'], {
    env: {
      ...process.env,
      NODE_ENV: 'test',
      POSTGRES_URI: process.env.POSTGRES_URI_TEST,
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

let httpServer: ChildProcessWithoutNullStreams;

export const setup = async () => {
  httpServer = await startServer();

  // eslint-disable-next-line functional/immutable-data
  process.env.HTTP_URI = `http://${testServerHost}:${testServerPort}`;
};

export const teardown = async () => {
  await httpServer.kill();
};
