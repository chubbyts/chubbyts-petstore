/* oxlint-disable functional/no-let */

import type { ChildProcessWithoutNullStreams } from 'child_process';
import { spawn } from 'child_process';
import fetch from 'cross-fetch';
import { MongoClient } from 'mongodb';
import { parse, format } from 'mongodb-uri';
import { getRequiredEnv } from './config/production';

const getRandomInt = (min: number, max: number) => {
  const ceiledMin = Math.ceil(min);
  const flooredMax = Math.floor(max);
  return Math.floor(Math.random() * (flooredMax - ceiledMin + 1)) + ceiledMin;
};

const testServerHost = '127.0.0.1';
const testServerPort = getRandomInt(49152, 65535);

const timeout = 20000;
const oidcProviderTimeout = 120000; // keycloak needs a while to boot and import the realm
const iterationTimeout = 500;

const bootstrapMongoDbTestDatabase = async (mongoUriWithoutDatabase: string, testDatabase: string): Promise<void> => {
  const mongoClient = await MongoClient.connect(mongoUriWithoutDatabase);

  await mongoClient.db(testDatabase).dropDatabase();
  await mongoClient.close();
};

// the tests run against a real oidc provider (keycloak, see docker-compose.yml / .github/workflows/ci.yml)
const waitForOidcProvider = async (issuer: string): Promise<void> => {
  const url = `${issuer}/.well-known/openid-configuration`;

  for (let i = oidcProviderTimeout; i > 0; i -= iterationTimeout) {
    try {
      const response = await fetch(url);

      if (response.ok) {
        return;
      }
    } catch (e) {
      if (e.code !== 'ECONNREFUSED' && e.code !== 'ECONNRESET') {
        throw e;
      }
    }

    console.log('wait for oidc provider to be up and running...');
    await new Promise((resolve) => setTimeout(resolve, iterationTimeout));
  }

  throw new Error(`Timeout in waiting for oidc provider "${issuer}"`);
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
  const mongoUri = getRequiredEnv('MONGO_URI');
  const oidcIssuer = getRequiredEnv('OIDC_ISSUER');
  getRequiredEnv('OIDC_AUDIENCE');

  const { database, ...mongoConfigWithoutDatabase } = parse(mongoUri);

  const testDatabase = `${database}_test`;

  const mongoUriWithoutDatabase = format({ ...mongoConfigWithoutDatabase });
  const mongoUriWithTestDatabase = format({ ...mongoConfigWithoutDatabase, database: testDatabase });

  // oxlint-disable-next-line functional/immutable-data
  process.env.MONGO_URI = mongoUriWithTestDatabase;
  // oxlint-disable-next-line functional/immutable-data
  process.env.SERVER_HOST = testServerHost;
  // oxlint-disable-next-line functional/immutable-data
  process.env.SERVER_PORT = `${testServerPort}`;

  await bootstrapMongoDbTestDatabase(mongoUriWithoutDatabase, testDatabase);

  await waitForOidcProvider(oidcIssuer);

  httpServer = await startServer();

  // oxlint-disable-next-line functional/immutable-data
  process.env.HTTP_URI = `http://${testServerHost}:${testServerPort}`;
};

export const teardown = async () => {
  httpServer.kill();
};
