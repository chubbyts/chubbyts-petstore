const { spawn } = require('child_process');
const { cwd } = require('process');
const { rmSync, existsSync, mkdirSync, cpSync } = require('fs');

const build = async (watch = false) => {
  const rootDir = cwd();

  if (!existsSync(`${rootDir}/dist`)) {
    mkdirSync(`${rootDir}/dist`, { recursive: true });
  }

  return Promise.all(
    ['bin', 'bootstrap', 'config', 'src'].map((dir) => {
      return new Promise((resolve, reject) => {
        if (existsSync(`${rootDir}/dist/${dir}`)) {
          rmSync(`${rootDir}/dist/${dir}`, { recursive: true });
        }

        const subProcess = spawn(process.argv[0], [
          'node_modules/.bin/swc',
          dir,
          '--out-dir',
          `${rootDir}/dist/${dir}`,
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
