/* eslint-disable functional/no-let */

import type { ChildProcessWithoutNullStreams } from 'child_process';
import { execSync, spawn } from 'child_process';
import fetch from 'cross-fetch';
import { Client } from 'pg';
import { ConnectionString } from 'connection-string';
import { getRequiredEnv } from './config/production';

const getRandomInt = (min: number, max: number) => {
  const ceiledMin = Math.ceil(min);
  const flooredMax = Math.floor(max);
  return Math.floor(Math.random() * (flooredMax - ceiledMin + 1)) + ceiledMin;
};

const testServerHost = '127.0.0.1';
const testServerPort = getRandomInt(49152, 65535);

const timeout = 20000;
const iterationTimeout = 500;

const resolveDatabaseFromPostgresUri = (postgresUri: string) => {
  const connectionString = new ConnectionString(postgresUri);

  if (connectionString.path?.length !== 1) {
    throw new Error('Cannot parse database name');
  }

  return connectionString.path[0];
};

const resolvePostgresConnectionStringWithDifferentDatabase = (postgresUri: string, database: string | undefined) => {
  const connectionString = new ConnectionString(postgresUri);
  // eslint-disable-next-line functional/immutable-data
  connectionString.path = database ? [database] : [];

  return connectionString.toString();
};

const bootstrapPostgresTestDatabase = async (
  postgresUriWithoutDatabase: string,
  testDatabase: string,
): Promise<void> => {
  const postgresClient = new Client(postgresUriWithoutDatabase);
  await postgresClient.connect();
  await postgresClient.query(`DROP DATABASE IF EXISTS "${testDatabase}"`);
  await postgresClient.query(`CREATE DATABASE "${testDatabase}"`);

  execSync('./node_modules/.bin/drizzle-kit push', {
    env: process.env,
    stdio: 'inherit',
  });
};

const startServer = async () => {
  const child = spawn('./node_modules/.bin/tsx', ['bootstrap/index.ts'], {
    env: process.env,
    //stdio: 'inherit', // helpful for debugging
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
  const postgresUri = getRequiredEnv('POSTGRES_URI');

  const database = resolveDatabaseFromPostgresUri(postgresUri);
  const testDatabase = `${database}_test`;

  const postgresUriWithoutDatabase = resolvePostgresConnectionStringWithDifferentDatabase(postgresUri, undefined);
  const postgresUriWithTestDatabase = resolvePostgresConnectionStringWithDifferentDatabase(postgresUri, testDatabase);

  // eslint-disable-next-line functional/immutable-data
  process.env.POSTGRES_URI = postgresUriWithTestDatabase;
  // eslint-disable-next-line functional/immutable-data
  process.env.SERVER_HOST = testServerHost;
  // eslint-disable-next-line functional/immutable-data
  process.env.SERVER_PORT = `${testServerPort}`;

  await bootstrapPostgresTestDatabase(postgresUriWithoutDatabase, testDatabase);

  httpServer = await startServer();

  // eslint-disable-next-line functional/immutable-data
  process.env.HTTP_URI = `http://${testServerHost}:${testServerPort}`;
};

export const teardown = async () => {
  httpServer.kill();
};
