const { spawn } = require('child_process');

const build = async (watch = false) => {
  return Promise.all(
    ['bin', 'bootstrap', 'config', 'src'].map((dir) => {
      return new Promise((resolve, reject) => {
        const subProcess = spawn(process.argv[0], [
          'node_modules/.bin/swc',
          dir,
          '--out-dir',
          `dist/${dir}`,
          ...(watch ? ['-w'] : []),
        ]);

        subProcess.on('close', (code) => {
          if (code !== 0) {
            reject();
          }

          resolve();
        });

        process.on('SIGINT', () => {
          subProcess.kill('SIGINT');
          resolve();
        });
      });
    }),
  );
};

module.exports = build;
