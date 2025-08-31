/* eslint-disable functional/no-let */

import type { ChildProcessWithoutNullStreams } from 'child_process';
import { execSync, spawn } from 'child_process';
import fetch from 'cross-fetch';
import { Client } from 'pg';
import { ConnectionString } from 'connection-string';

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
  const postgresUriWithDatabase = process.env.POSTGRES_URI as string;

  const connectionString = new ConnectionString(postgresUriWithDatabase);

  if (connectionString.path?.length !== 1) {
    throw new Error('Cannot parse database name');
  }

  const database = connectionString.path[0];
  const testDatabase = `${database}_test`;

  const connectionStringWithoutDatabase = new ConnectionString(postgresUriWithDatabase);
  // eslint-disable-next-line functional/immutable-data
  connectionStringWithoutDatabase.path = [];
  const postgresUriWithoutDatabase = connectionStringWithoutDatabase.toString();

  const connectionStringWithTestDatabase = new ConnectionString(postgresUriWithDatabase);
  // eslint-disable-next-line functional/immutable-data
  connectionStringWithTestDatabase.path = [testDatabase];
  const postgresUriWithTestDatabase = connectionStringWithTestDatabase.toString();

  console.log({
    postgresUriWithoutDatabase,
    postgresUriWithDatabase,
    postgresUriWithTestDatabase,
  });

  const postgresClient = new Client(postgresUriWithoutDatabase);
  await postgresClient.connect();
  await postgresClient.query(`DROP DATABASE IF EXISTS "${testDatabase}"`);
  await postgresClient.query(`CREATE DATABASE "${testDatabase}"`);

  execSync('./node_modules/.bin/drizzle-kit push', {
    env: {
      ...process.env,
      NODE_ENV: 'test',
      POSTGRES_URI: postgresUriWithTestDatabase,
    },
    stdio: 'inherit',
  });

  const child = spawn('./node_modules/.bin/tsx', ['bootstrap/index.ts'], {
    env: {
      ...process.env,
      NODE_ENV: 'test',
      POSTGRES_URI: postgresUriWithTestDatabase,
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
