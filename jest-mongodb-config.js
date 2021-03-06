// eslint-disable-next-line @typescript-eslint/no-var-requires
const os = require('os');

if (os.platform() === 'linux') {
  // eslint-disable-next-line no-console
  console.log(
    'WARNING: Monkey patching mongoms download URL for debian 10 in our docker builds!',
  );
  process.env.MONGOMS_DOWNLOAD_URL =
    'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-debian10-4.4.14.tgz';
}

module.exports = {
  mongodbMemoryServerOptions: {
    instance: {
      dbName: 'jest',
    },
    binary: {
      version: '4.4.14',
    },
    autoStart: false,
  },
};
