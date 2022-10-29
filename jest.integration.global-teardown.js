const mongoDbTeardown = require('@shelf/jest-mongodb/lib/teardown');

module.exports = async function (config) {
  if (global.__HTTP_SERVER__) {
    await global.__HTTP_SERVER__.kill();
  }
  await mongoDbTeardown(config);
};
