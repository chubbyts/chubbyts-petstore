const { spawn } = require('child_process');

const mongoDbSetup = require('@shelf/jest-mongodb/setup');

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const testServerHost = '127.0.0.1';
const testServerPort = getRandomInt(49152, 65535);

const startServer = async () => {
  return new Promise((resolve, reject) => {
    const child = spawn(process.argv[0], ['node_modules/.bin/ts-node', 'public/index.ts'], {
      env: {
        NODE_ENV: 'jest',
        MONGO_URI: process.env.MONGO_URI,
        SERVER_HOST: testServerHost,
        SERVER_PORT: testServerPort,
      },
      detached: true,
    }).once('error', (err) => {
      console.error(err);
      reject();
    });

    let data = '';

    child.stdout.on('data', function (buffer) {
      data += buffer.toString('utf-8');

      if (-1 !== data.search('Listening to')) {
        resolve(child);
      }
    });
  });
};

module.exports = async () => {
  if (!process.env.INTEGRATION_ENDPOINT) {
    await mongoDbSetup();
    process.env.INTEGRATION_ENDPOINT = `http://${testServerHost}:${testServerPort}`;
    process.env.MONGO_URI = process.env.MONGO_URL;
    global.__HTTP_SERVER__ = await startServer();
  }

  console.log(JSON.stringify({
    INTEGRATION_ENDPOINT: process.env.INTEGRATION_ENDPOINT,
    MONGO_URI: process.env.MONGO_URI,
  }, null, 2));
};
