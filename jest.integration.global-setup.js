const { MongoMemoryServer } = require('mongodb-memory-server');
const { spawn } = require('child_process');
const build = require('./build');
const fetch = require('cross-fetch');

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
  if (!global.__MONGO_SERVER__) {
    global.__MONGO_SERVER__ = await MongoMemoryServer.create(config.mongodbMemoryServerOptions);
    process.env.MONGO_URI = global.__MONGO_SERVER__.getUri();
  }

  if (!global.__HTTP_SERVER__) {
    global.__HTTP_SERVER__ = await startServer();
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
