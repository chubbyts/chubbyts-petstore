// eslint-disable-next-line functional/immutable-data, no-undef
module.exports = async function () {
  // eslint-disable-next-line no-undef
  if (global.__HTTP_SERVER__) {
    // eslint-disable-next-line no-undef
    await global.__HTTP_SERVER__.kill();
  }
  // eslint-disable-next-line no-undef
  if (global.__MONGO_SERVER__) {
    // eslint-disable-next-line no-undef
    await global.__MONGO_SERVER__.stop();
  }
};
