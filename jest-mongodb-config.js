// eslint-disable-next-line @typescript-eslint/no-var-requires
const os = require('os');

const version = '5.0.11'

if (os.platform() === 'linux') {
  // eslint-disable-next-line no-console
  console.log(
    'WARNING: Monkey patching mongoms download URL for debian 10 in our docker builds!',
  );
  process.env.MONGOMS_DOWNLOAD_URL =
    `https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-debian10-${version}.tgz`;
}

module.exports = {
  mongodbMemoryServerOptions: {
    instance: {
      dbName: 'jest',
    },
    binary: {
      version,
    },
    autoStart: false,
  },
  mongoURLEnvName: 'MONGO_URI',
};
