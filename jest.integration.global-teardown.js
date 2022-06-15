const mongoDbSetup = require('@shelf/jest-mongodb/teardown');

module.exports = async function () {
  if (global.__HTTP_SERVER__) {
    await global.__HTTP_SERVER__.kill();
  }
  await mongoDbSetup();
};
