const { spawn, spawnSync } = require('child_process');
const fetch = require('cross-fetch');

const mongoDbSetup = require('@shelf/jest-mongodb/lib/setup');
const build = require('./build');

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const testServerHost = '127.0.0.1';
const testServerPort = getRandomInt(49152, 65535);

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

  throw new Error(`Timeout in starting the server`);
};

module.exports = async (config) => {
  if (!process.env.INTEGRATION_ENDPOINT) {
    await mongoDbSetup(config);
    process.env.INTEGRATION_ENDPOINT = `http://${testServerHost}:${testServerPort}`;
    global.__HTTP_SERVER__ = await startServer();
  }

  console.log(JSON.stringify({
    INTEGRATION_ENDPOINT: process.env.INTEGRATION_ENDPOINT,
    MONGO_URI: process.env.MONGO_URI,
  }, null, 2));
};
